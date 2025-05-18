import ButtonComponent from "@/common/ButtonComponent";
import PageContainer from "@/common/PageContainer";
import ThemeToggleIcon from "@/common/ThemeToggleIcon";
import Toast, { ToastType } from "@/common/Toast";
import { useAppColors } from "@/constants/Colors";
import { typography } from "@/constants/styles";
import {
  setIsForgotPassword,
  setUserAccessToken,
  setUserProfile,
  setUserVerified,
} from "@/redux/actions/userActions";
import { SignIn } from "@/services/auth";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useDispatch } from "react-redux";

export default function LoginPage() {
  const colors = useAppColors();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "info" as ToastType,
    duration: 1500,
  });

  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const headerTextOpacity = useSharedValue(0);
  const headerTextTranslateY = useSharedValue(20);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(30);
  const buttonsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(30);
  const termsOpacity = useSharedValue(0);
  const errorShake = useSharedValue(0);

  // Logo animation styles
  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [{ scale: logoScale.value }],
    };
  });

  // Header text animation styles
  const headerTextStyle = useAnimatedStyle(() => {
    return {
      opacity: headerTextOpacity.value,
      transform: [{ translateY: headerTextTranslateY.value }],
    };
  });

  // Form animation styles
  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
      transform: [{ translateY: formTranslateY.value }],
    };
  });

  // Buttons animation styles
  const buttonsAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonsOpacity.value,
      transform: [{ translateY: buttonsTranslateY.value }],
    };
  });

  // Error animation style
  const errorAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: errorShake.value }],
    };
  });

  // Handle toast hiding
  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  // Show toast with message and type
  const showToast = (
    message: string,
    type: ToastType = "info",
    duration: number = 1500
  ) => {
    setToast({ visible: true, message, type, duration });
  };

  // Trigger animations on component mount
  useEffect(() => {
    // Staggered animations for a smooth entry

    // Logo animation
    logoOpacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    logoScale.value = withSequence(
      withTiming(1.1, { duration: 400 }),
      withTiming(1, { duration: 200 })
    );

    // Header text animations with staggered delay
    headerTextOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    headerTextTranslateY.value = withDelay(300, withSpring(0, { damping: 12 }));

    // Form animations with further delay
    formOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
    formTranslateY.value = withDelay(600, withSpring(0, { damping: 12 }));

    // Buttons animations with even further delay
    buttonsOpacity.value = withDelay(900, withTiming(1, { duration: 600 }));
    buttonsTranslateY.value = withDelay(900, withSpring(0, { damping: 12 }));

    // Terms animation
    termsOpacity.value = withDelay(1200, withTiming(1, { duration: 600 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email: string) => {
    if (!email.trim()) {
      return "Email or Username is required";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return "Password is required";
    }
    return "";
  };

  const validateForm = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError,
      password: passwordError,
      general: "",
    });

    if (emailError || passwordError) {
      // Show toast with validation errors
      const errorMessages = [emailError, passwordError].filter(Boolean);
      if (errorMessages.length > 0) {
        showToast("Failed to sign in", "error", 2000);
      }

      // Trigger error shake animation
      errorShake.value = withSequence(
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(-10, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    showToast("Signing in...", "info", 2000);

    try {
      const response = await SignIn(email, password);

      if (response.error || response.status === "error") {
        if (
          (typeof response.message === "string" &&
            response.message.includes("verify your email")) ||
          (typeof response.error === "string" &&
            response.error.includes("verify your email"))
        ) {
          // verification needed
          showToast("Please verify your email", "warning", 2000);
          setTimeout(() => {
            router.push({
              pathname: "/(auth)/Verify",
              params: { email },
            });
          }, 1000);
        } else if (
          (typeof response.message === "string" &&
            response.message.includes("User Not Found")) ||
          (typeof response.error === "string" &&
            response.error.includes("User Not Found"))
        ) {
          // User not found
          setErrors({
            ...errors,
            email: "",
            general: "Account not found with this email/username",
          });
          showToast("Account not found", "error", 2000);

          errorShake.value = withSequence(
            withTiming(-10, { duration: 100 }),
            withTiming(10, { duration: 100 }),
            withTiming(-10, { duration: 100 }),
            withTiming(0, { duration: 100 })
          );
        } else if (
          (typeof response.message === "string" &&
            response.message.includes("check your password")) ||
          (typeof response.error === "string" &&
            response.error.includes("check your password"))
        ) {
          // Password incorrect
          setErrors({
            ...errors,
            password: "",
            general: "Incorrect password",
          });
          showToast("Incorrect password", "error", 2000);

          errorShake.value = withSequence(
            withTiming(-10, { duration: 100 }),
            withTiming(10, { duration: 100 }),
            withTiming(-10, { duration: 100 }),
            withTiming(0, { duration: 100 })
          );
        } else if (response.errors?.password) {
          // Password validation error
          let passwordError = response.errors.password;

          if (passwordError.includes("String must contain")) {
            passwordError = passwordError.replace("String", "Password");
          }
          setErrors({
            ...errors,
            password: passwordError,
            general: "",
          });
          showToast("Please check your password", "error", 2000);

          errorShake.value = withSequence(
            withTiming(-10, { duration: 100 }),
            withTiming(10, { duration: 100 }),
            withTiming(-10, { duration: 100 }),
            withTiming(0, { duration: 100 })
          );
        } else {
          // Any other error
          const errorMessage =
            response.message ||
            response.error ||
            "Login failed. Please try again.";
          setErrors({
            ...errors,
            email: "",
            password: "",
            general: errorMessage,
          });
          showToast("Failed to sign in", "error", 2000);

          errorShake.value = withSequence(
            withTiming(-10, { duration: 100 }),
            withTiming(10, { duration: 100 }),
            withTiming(-10, { duration: 100 }),
            withTiming(0, { duration: 100 })
          );
        }
      } else {
        const userData = {
          _id: response._id,
          email: response.email,
          username: response.userName,
          phoneNumber: response.mobile,
        };

        dispatch(setUserProfile(userData));
        dispatch(setUserVerified(response.isVerified));

        // Store access token if user is verified
        if (response.isVerified && response.authToken) {
          dispatch(setUserAccessToken(response.authToken));
        }
        dispatch(setIsForgotPassword(false));

        showToast("Login successful!", "success", 2000);

        if (
          !response.userName ||
          response.userName === "" ||
          response.userName.trim() === ""
        ) {
          console.log("Username is empty");
          setTimeout(() => {
            router.push("/(auth)/Username");
          }, 1000);
        } else {
          console.log("Username is not empty");
          router.replace("/(tabs)/Home" as any);
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || "An unexpected error occurred";
      const errorResponse = error.response?.data;
      if (
        typeof errorMessage === "string" &&
        errorMessage.includes("verify your email")
      ) {
        showToast("Please verify your email", "warning", 2000);
        setTimeout(() => {
          router.push({
            pathname: "/(auth)/Verify",
            params: { email },
          });
        }, 1000);
      } else if (
        (typeof errorMessage === "string" &&
          errorMessage.includes("User Not Found")) ||
        (errorResponse &&
          typeof errorResponse.message === "string" &&
          errorResponse.message.includes("User Not Found"))
      ) {
        // User not found
        setErrors({
          ...errors,
          email: "",
          general: "Account not found with this email/username",
        });
        showToast("Account not found", "error", 2000);

        errorShake.value = withSequence(
          withTiming(-10, { duration: 100 }),
          withTiming(10, { duration: 100 }),
          withTiming(-10, { duration: 100 }),
          withTiming(0, { duration: 100 })
        );
      } else if (
        (typeof errorMessage === "string" &&
          errorMessage.includes("check your password")) ||
        (errorResponse &&
          typeof errorResponse.message === "string" &&
          errorResponse.message.includes("check your password"))
      ) {
        setErrors({
          ...errors,
          password: "",
          general: "Incorrect password",
        });
        showToast("Incorrect password", "error", 2000);

        errorShake.value = withSequence(
          withTiming(-10, { duration: 100 }),
          withTiming(10, { duration: 100 }),
          withTiming(-10, { duration: 100 }),
          withTiming(0, { duration: 100 })
        );
      } else if (errorResponse && errorResponse.errors?.password) {
        let passwordError = errorResponse.errors.password;

        if (passwordError.includes("String must contain")) {
          passwordError = passwordError.replace("String", "Password");
        }
        setErrors({
          ...errors,
          password: passwordError,
          general: "",
        });
        showToast("Please check your password", "error", 2000);

        errorShake.value = withSequence(
          withTiming(-10, { duration: 100 }),
          withTiming(10, { duration: 100 }),
          withTiming(-10, { duration: 100 }),
          withTiming(0, { duration: 100 })
        );
      } else {
        setErrors({
          ...errors,
          email: "",
          password: "",
          general: errorMessage,
        });
        showToast("Failed to sign in", "error", 2000);

        // Trigger error shake animation
        errorShake.value = withSequence(
          withTiming(-10, { duration: 100 }),
          withTiming(10, { duration: 100 }),
          withTiming(-10, { duration: 100 }),
          withTiming(0, { duration: 100 })
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        onHide={hideToast}
      />
      <ThemeToggleIcon style={styles.themeToggle} size={22} />
      <View style={styles.container}>
        <Animated.View style={[styles.headerContainer, logoAnimatedStyle]}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
          />
          <Animated.Text
            style={[
              typography.h1,
              headerTextStyle,
              { color: colors.font_dark },
            ]}
          >
            Log In
          </Animated.Text>
          <Animated.Text
            style={[
              typography.body,
              styles.subheaderText,
              { color: colors.font_dark },
              headerTextStyle,
            ]}
          >
            We&apos;re happy to see you again.
          </Animated.Text>
        </Animated.View>

        {errors.general ? (
          <Animated.View
            style={[
              styles.errorContainer,
              errorAnimatedStyle,
              { backgroundColor: colors.bg_error },
            ]}
          >
            <Text
              style={[
                typography.body,
                styles.errorText,
                { color: colors.font_error },
              ]}
            >
              {errors.general}
            </Text>
          </Animated.View>
        ) : null}

        <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.bg_gray,
                  color: colors.font_dark,
                },
                errors.email
                  ? [styles.inputError, { borderColor: colors.font_error }]
                  : null,
              ]}
              cursorColor={colors.font_brand}
              placeholder="Email or Username"
              placeholderTextColor={colors.font_placeholder}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors({ ...errors, email: "", general: "" });
              }}
              keyboardType="default"
              autoCapitalize="none"
            />
            {errors.email ? (
              <Animated.Text
                style={[
                  styles.fieldErrorText,
                  errorAnimatedStyle,
                  { color: colors.font_error },
                ]}
              >
                {errors.email}
              </Animated.Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <View
              style={[
                styles.passwordContainer,
                { backgroundColor: colors.bg_gray },
                errors.password
                  ? [styles.inputError, { borderColor: colors.font_error }]
                  : null,
              ]}
            >
              <TextInput
                style={[styles.passwordInput, { color: colors.font_dark }]}
                cursorColor={colors.font_brand}
                placeholder="Password"
                placeholderTextColor={colors.font_placeholder}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors({ ...errors, password: "", general: "" });
                }}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={togglePasswordVisibility}>
                <Entypo
                  name={showPassword ? "eye" : "eye-with-line"}
                  size={20}
                  color={colors.font_placeholder}
                />
              </Pressable>
            </View>
            {errors.password ? (
              <Animated.Text
                style={[
                  styles.fieldErrorText,
                  errorAnimatedStyle,
                  { color: colors.font_error },
                ]}
              >
                {errors.password}
              </Animated.Text>
            ) : null}
          </View>

          <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity
              onPress={() => {
                dispatch(setIsForgotPassword(true));
                router.push("/(auth)/ForgotPassword");
              }}
            >
              <Text
                style={[
                  styles.forgotPasswordText,
                  { color: colors.font_brand },
                ]}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View style={[styles.buttonsContainer, buttonsAnimatedStyle]}>
          <ButtonComponent
            text={isLoading ? "Signing in..." : "Login"}
            textColor={colors.font_brand}
            bgColor={colors.bg_light_brand}
            onPress={handleLogin}
            disabled={isLoading}
            icon={
              isLoading
                ? () => (
                    <ActivityIndicator size="small" color={colors.font_brand} />
                  )
                : undefined
            }
          />
          <Text
            style={[
              typography.bodySm,
              { textAlign: "center" },
              { color: colors.font_dark },
            ]}
          >
            Don&apos;t have an account yet?{" "}
            <Text
              onPress={() => {
                router.push("/(auth)/RegisterPage");
              }}
              style={[typography.bodySm, { color: colors.font_brand }]}
            >
              Signup
            </Text>
          </Text>
        </Animated.View>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  logo: {
    objectFit: "contain",
    width: 72,
    height: 72,
  },
  subheaderText: {
    textAlign: "center",
    width: "80%",
    marginTop: 4,
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: 16,
    paddingHorizontal: 16,
  },
  textInput: {
    width: "100%",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontFamily: "CalSans",
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
    fontFamily: "CalSans",
  },
  forgotPasswordContainer: {
    width: "100%",
    alignItems: "flex-end",
    marginRight: 4,
  },
  forgotPasswordText: {
    ...typography.bodySm,
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: 16,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  inputContainer: {
    width: "100%",
    position: "relative",
    marginBottom: 8,
  },
  themeToggle: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 100,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: "CalSans",
    paddingHorizontal: 4,
  },
  fieldErrorText: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: "CalSans",
    paddingHorizontal: 4,
    marginLeft: 4,
  },
  errorContainer: {
    padding: 10,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
    marginBottom: 10,
  },
  inputError: {
    borderWidth: 1,
  },
});
