import ButtonComponent from "@/common/ButtonComponent";
import PageContainer from "@/common/PageContainer";
import Toast, { ToastType } from "@/common/Toast";
import { useAppColors } from "@/constants/Colors";
import { typography } from "@/constants/styles";
import { setUsernameToProfile } from "@/redux/actions/userActions";
import { SetUsername } from "@/services/auth";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
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

export default function UsernamePage() {
  const dispatch = useDispatch();
  const colors = useAppColors();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "info" as ToastType,
    duration: 1500,
  });

  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const headerTextOpacity = useSharedValue(0);
  const headerTextTranslateY = useSharedValue(20);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(30);
  const buttonsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(30);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUsernameChange = (text: string) => {
    // Allow only alphanumeric characters and underscore
    const sanitizedText = text.replace(/[^a-zA-Z0-9_]/g, "");
    setUsername(sanitizedText);
    setError(""); // Clear error when user types
  };

  const validateUsername = () => {
    if (!username.trim()) {
      setError("Username is required");
      return false;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return false;
    }

    if (username.length > 20) {
      setError("Username must be less than 20 characters");
      return false;
    }

    return true;
  };

  const handleContinue = async () => {
    if (!validateUsername()) {
      errorShake.value = withSequence(
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(-10, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );

      showToast(error, "error", 2000);
      return;
    }

    setIsLoading(true);
    showToast("Setting up your username...", "info", 2000);

    try {
      const response = await SetUsername(username);

      if (
        response.error ||
        response.status === "error" ||
        response.code === 401
      ) {
        const errorMessage =
          response.message || "Failed to set username. Please try again.";
        setError(errorMessage);
        showToast(errorMessage, "error", 2000);

        errorShake.value = withSequence(
          withTiming(-10, { duration: 100 }),
          withTiming(10, { duration: 100 }),
          withTiming(-10, { duration: 100 }),
          withTiming(0, { duration: 100 })
        );
        console.log("Error response:", JSON.stringify(response));
      } else {
        dispatch(setUsernameToProfile(username));
        showToast("Username set successfully!", "success", 2000);

        router.replace("/(tabs)/Home" as any);
      }
    } catch (error: any) {
      const errorMessage = error.message || "An unexpected error occurred";
      setError(errorMessage);
      showToast(errorMessage, "error", 2000);

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
            Almost Done!
          </Animated.Text>
          <Animated.Text
            style={[
              typography.body,
              styles.subheaderText,
              headerTextStyle,
              { color: colors.font_dark },
            ]}
          >
            Choose a unique username for your appearance
          </Animated.Text>
        </Animated.View>

        <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
          <Animated.View style={[styles.inputContainer, errorAnimatedStyle]}>
            <TextInput
              style={[
                styles.textInput,
                { backgroundColor: colors.bg_gray, color: colors.font_dark },
                error
                  ? { borderWidth: 1, borderColor: colors.font_error }
                  : null,
              ]}
              placeholderTextColor={colors.font_placeholder}
              placeholder="Username"
              value={username}
              onChangeText={handleUsernameChange}
              cursorColor={colors.font_brand}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {error ? (
              <Text
                style={[
                  typography.bodySm,
                  {
                    color: colors.font_error,
                    marginTop: 4,
                    alignSelf: "flex-start",
                    marginLeft: 4,
                  },
                ]}
              >
                {error}
              </Text>
            ) : username.length > 0 ? (
              <Text
                style={[
                  typography.bodySm,
                  { color: colors.font_dark, marginTop: 8 },
                ]}
              >
                This is how other users will identify you
              </Text>
            ) : null}
          </Animated.View>
        </Animated.View>

        <Animated.View style={[styles.buttonsContainer, buttonsAnimatedStyle]}>
          <ButtonComponent
            text={isLoading ? "Setting up..." : "Continue"}
            textColor={colors.font_brand}
            bgColor={colors.bg_light_brand}
            onPress={handleContinue}
            disabled={isLoading}
            icon={
              isLoading
                ? () => (
                    <ActivityIndicator size="small" color={colors.font_brand} />
                  )
                : undefined
            }
          />
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
  inputContainer: {
    width: "100%",
    alignItems: "center",
  },
  textInput: {
    width: "100%",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontFamily: "CalSans",
    fontSize: 16,
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: 16,
    paddingHorizontal: 16,
  },
});
