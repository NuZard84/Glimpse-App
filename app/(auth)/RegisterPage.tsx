import ButtonComponent from "@/common/ButtonComponent";
import CountryCodeSelector from "@/common/CountryCodeSelector";
import PageContainer from "@/common/PageContainer";
import ThemeToggleIcon from "@/common/ThemeToggleIcon";
import Toast, { ToastType } from "@/common/Toast";
import { useAppColors } from "@/constants/Colors";
import { typography } from "@/constants/styles";
import { setUserProfile, setUserVerified } from "@/redux/actions/userActions";
import { SignUp } from "@/services/auth";
import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
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

export default function RegisterPage() {
  const colors = useAppColors();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
    password: "",
    general: "",
  });
  const [isLoading, setIsLoading] = useState(false);
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

  // Terms animation styles
  const termsAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: termsOpacity.value,
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return "Email is required";
    } else if (!emailRegex.test(email)) {
      return "Invalid email format";
    }
    return "";
  };

  const validatePhone = (phone: string) => {
    if (!phone.trim()) {
      return "Phone number is required";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return "Password is required";
    } else if (password.length < 8) {
      return "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  const validateForm = () => {
    const emailError = validateEmail(email);
    const phoneError = validatePhone(phoneNumber);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError,
      phone: phoneError,
      password: passwordError,
      general: "",
    });

    if (emailError || phoneError || passwordError) {
      // Show toast with validation errors
      const errorMessages = [emailError, phoneError, passwordError].filter(
        Boolean
      );
      if (errorMessages.length > 0) {
        showToast("Failed to sign up", "error", 2000);
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

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    showToast("Creating your account...", "info", 2000);

    try {
      const response = await SignUp(email, password, phoneNumber);

      if (
        response.error ||
        response.status === "error" ||
        response.message?.includes("Already Exist")
      ) {
        if (response.errors) {
          const errorMessages: string[] = [];

          Object.entries(response.errors).forEach(([field, message]) => {
            errorMessages.push(message as string);

            // Also set field-specific errors
            if (field === "email") {
              setErrors((prev) => ({ ...prev, email: message as string }));
            } else if (field === "mobile") {
              setErrors((prev) => ({ ...prev, phone: message as string }));
            } else if (field === "password") {
              setErrors((prev) => ({ ...prev, password: message as string }));
            }
          });

          setErrors((prev) => ({
            ...prev,
            general: errorMessages.join(". "),
          }));

          showToast("Failed to sign up", "error", 2000);
        } else {
          const errorMessage =
            response.message || "Signup failed. Please try again.";
          setErrors({
            ...errors,
            general: errorMessage,
          });
          showToast("Failed to sign up", "error", 2000);
        }

        errorShake.value = withSequence(
          withTiming(-10, { duration: 100 }),
          withTiming(10, { duration: 100 }),
          withTiming(-10, { duration: 100 }),
          withTiming(0, { duration: 100 })
        );
      } else {
        const userData = {
          _id: response._id,
          email: response.email,
          username: "",
          phoneNumber: "",
        };

        dispatch(setUserProfile(userData));
        dispatch(setUserVerified(response.isVerified));

        showToast(
          "Signup successful! Redirecting to verification...",
          "success",
          2000
        );
        setTimeout(() => {
          router.push({
            pathname: "/(auth)/Verify",
            params: { email },
          });
        }, 1000);
      }
    } catch (error: any) {
      const errorMessage = error.message || "An unexpected error occurred";
      setErrors({
        ...errors,
        general: errorMessage,
      });
      showToast("Failed to sign up", "error", 2000);

      errorShake.value = withSequence(
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(-10, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
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
            Sign up
          </Animated.Text>
          <Animated.Text
            style={[
              typography.body,
              styles.subheaderText,
              headerTextStyle,
              { color: colors.font_dark },
            ]}
          >
            Join us and enjoy exclusive features tailored just for you.
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
              placeholder="Email"
              placeholderTextColor={colors.font_placeholder}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors({ ...errors, email: "", general: "" });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Feather
              name="mail"
              size={20}
              color={colors.font_placeholder}
              style={styles.inputIcon}
            />
            {errors.email ? (
              <Animated.Text
                style={[
                  styles.errorText,
                  errorAnimatedStyle,
                  { color: colors.font_error },
                ]}
              >
                {errors.email}
              </Animated.Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <CountryCodeSelector
              phoneNumber={phoneNumber}
              setPhoneNumber={(text) => {
                setPhoneNumber(text);
                setErrors({ ...errors, phone: "", general: "" });
              }}
              placeholder="Phone number"
              error={errors.phone ? colors.font_error : undefined}
            />
            <AntDesign
              name="phone"
              size={20}
              color={colors.font_placeholder}
              style={styles.inputIcon}
            />
            {errors.phone ? (
              <Animated.Text
                style={[
                  styles.errorText,
                  errorAnimatedStyle,
                  { color: colors.font_error },
                ]}
              >
                {errors.phone}
              </Animated.Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <View
              style={[
                styles.passwordContainer,
                { backgroundColor: colors.bg_gray },
                errors.password
                  ? [
                      styles.inputError,
                      {
                        borderColor: colors.font_error,
                      },
                    ]
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
                  styles.errorText,
                  errorAnimatedStyle,
                  {
                    color: colors.font_error,
                  },
                ]}
              >
                {errors.password}
              </Animated.Text>
            ) : null}
          </View>
        </Animated.View>

        <Animated.View style={[styles.buttonsContainer, buttonsAnimatedStyle]}>
          <ButtonComponent
            text={isLoading ? "Signing up..." : "Signup"}
            textColor={colors.font_brand}
            bgColor={colors.bg_light_brand}
            onPress={handleSignUp}
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
              { color: colors.font_dark },
              { textAlign: "center" },
            ]}
          >
            Already have an account?{" "}
            <Text
              onPress={() => {
                router.navigate("/(auth)/LoginPage");
              }}
              style={[typography.bodySm, { color: colors.font_brand }]}
            >
              Login
            </Text>
          </Text>
        </Animated.View>

        <Animated.View
          style={[styles.termsContainer, termsAnimatedStyle, { marginTop: 64 }]}
        >
          <Text
            style={[
              typography.bodySm,
              { textAlign: "center" },
              { color: colors.font_dark },
            ]}
          >
            By signing to create an account I accept Company&apos;s{" "}
            <Text
              onPress={() => {
                showToast(
                  "Terms and Privacy documentation will open soon",
                  "info",
                  2000
                );
              }}
              style={[typography.bodySm, { color: colors.font_brand }]}
            >
              Terms of Use and Privacy Policy
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
  dividerContainer: {
    width: "100%",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
  },
  googleButtonContainer: {
    width: "100%",
    paddingHorizontal: 16,
  },
  termsContainer: {
    width: "100%",
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  inputContainer: {
    width: "100%",
    position: "relative",
    marginBottom: 8,
  },
  inputIcon: {
    position: "absolute",
    right: 16,
    top: 14,
    zIndex: 1,
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
