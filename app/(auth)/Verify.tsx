import ButtonComponent from "@/common/ButtonComponent";
import PageContainer from "@/common/PageContainer";
import Toast, { ToastType } from "@/common/Toast";
import { useAppColors } from "@/constants/Colors";
import { typography } from "@/constants/styles";
import {
  setUserAccessToken,
  setUserProfile,
  setUserVerified,
} from "@/redux/actions/userActions";
import { SendOTP, VerifyOTP } from "@/services/auth";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
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

export default function VerifyPage() {
  const colors = useAppColors();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);
  const params = useLocalSearchParams();
  const email = params.email as string;

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

  // Handle OTP input changes
  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    // Only allow numeric input
    const numericValue = text.replace(/[^0-9]/g, "");
    newOtp[index] = numericValue;
    setOtp(newOtp);

    // Auto focus to next input if current input is filled
    if (numericValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key press for backspace functionality
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSendOTP = async () => {
    if (!email) {
      showToast("Email address is required", "error", 2000);
      return;
    }

    setIsLoading(true);
    showToast("Sending verification code...", "info", 2000);

    try {
      const response = await SendOTP(email);

      if (response.error || response.status === "error") {
        const errorMessage =
          response.message || "Failed to send OTP. Please try again.";
        showToast(errorMessage, "error", 2000);

        errorShake.value = withSequence(
          withTiming(-10, { duration: 100 }),
          withTiming(10, { duration: 100 }),
          withTiming(-10, { duration: 100 }),
          withTiming(0, { duration: 100 })
        );
      } else {
        setEmailOtpSent(true);
        showToast("Verification code sent successfully", "success", 2000);
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      const errorMessage = error.message || "An unexpected error occurred";
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

  const handleVerifyOTP = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      showToast("Please enter all 6 digits", "error", 2000);

      errorShake.value = withSequence(
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(-10, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
      return;
    }

    setIsLoading(true);
    showToast("Verifying code...", "info", 2000);

    try {
      const response = await VerifyOTP(email, otpCode);

      if (
        response.error ||
        response.status === "error" ||
        response.otpExpired ||
        response.message?.includes("Expired") ||
        response.message?.includes("expired") ||
        response.message?.includes("Invalid")
      ) {
        const errorMessage =
          response.message || "Invalid verification code. Please try again.";
        showToast(errorMessage, "error", 2000);

        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();

        if (
          response.otpExpired ||
          response.message?.includes("Expired") ||
          response.message?.includes("expired")
        ) {
          setEmailOtpSent(false);
          showToast(
            "Your verification code has expired. Please request a new one.",
            "warning",
            3000
          );
        }

        errorShake.value = withSequence(
          withTiming(-10, { duration: 100 }),
          withTiming(10, { duration: 100 }),
          withTiming(-10, { duration: 100 }),
          withTiming(0, { duration: 100 })
        );

        setIsLoading(false);
        return;
      } else {
        dispatch(setUserVerified(response.isVerified));

        dispatch(setUserAccessToken(response.authToken));

        dispatch(
          setUserProfile({
            email: response.email,
            phoneNumber: response.mobile,
            username: "",
            _id: response._id,
          })
        );

        showToast("Verification successful!", "success", 2000);

        // Check if username exists and is not empty
        if (
          !response.userName ||
          response.userName === "" ||
          response.userName.trim() === ""
        ) {
          console.log("Username is empty");

          router.push({
            pathname: "/(auth)/Username",
          });
        } else {
          console.log("Username is not empty");
          router.replace("/(tabs)/Home" as any);
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || "An unexpected error occurred";
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

  const primaryButtonText = emailOtpSent ? "Verify" : "Send OTP";
  const primaryButtonAction = emailOtpSent ? handleVerifyOTP : handleSendOTP;

  return (
    <PageContainer>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        onHide={hideToast}
      />
      <TouchableOpacity
        onPress={() => {
          router.back();
        }}
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          top: 40,
          left: 20,
          zIndex: 100,
          gap: 8,
        }}
      >
        <Ionicons name="arrow-back" size={24} color={colors.font_dark} />
        <Text style={[{ color: colors.font_dark }, typography.h3]}>Back</Text>
      </TouchableOpacity>
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
            Verify Email
          </Animated.Text>
          <Animated.Text
            style={[
              typography.body,
              styles.subheaderText,
              headerTextStyle,
              { color: colors.font_dark },
            ]}
          >
            {emailOtpSent
              ? "Enter the 6-digit code sent to your email address"
              : "Click Send OTP to receive a verification code on your email address"}
          </Animated.Text>
        </Animated.View>

        <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
          {emailOtpSent && (
            <View style={styles.emailNotificationContainer}>
              <Text
                style={[
                  typography.body,
                  {
                    color: colors.font_dark,
                    textAlign: "center",
                    width: "90%",
                  },
                ]}
              >
                We&apos;ve sent an OTP to
                <Text
                  style={[
                    typography.body,
                    {
                      color: colors.font_brand,
                      textAlign: "center",
                      fontWeight: "bold",
                      width: "90%",
                    },
                  ]}
                >
                  {" "}
                  {email || "your email"}
                </Text>
              </Text>
            </View>
          )}

          <Animated.View style={[styles.otpContainer, errorAnimatedStyle]}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                style={[
                  styles.otpInput,
                  { backgroundColor: colors.bg_gray, color: colors.font_dark },
                  !emailOtpSent && { opacity: 0.5 },
                  otp[index] === "" &&
                    emailOtpSent && {
                      borderWidth: 1,
                      borderColor: colors.font_placeholder,
                    },
                ]}
                maxLength={1}
                keyboardType="numeric"
                value={otp[index]}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                cursorColor={colors.font_brand}
                editable={emailOtpSent}
              />
            ))}
          </Animated.View>
        </Animated.View>

        <Animated.View style={[styles.buttonsContainer, buttonsAnimatedStyle]}>
          <ButtonComponent
            text={
              isLoading
                ? emailOtpSent
                  ? "Verifying..."
                  : "Sending..."
                : primaryButtonText
            }
            textColor={colors.font_brand}
            bgColor={colors.bg_light_brand}
            onPress={primaryButtonAction}
            disabled={isLoading}
            icon={
              isLoading
                ? () => (
                    <ActivityIndicator size="small" color={colors.font_brand} />
                  )
                : undefined
            }
          />

          {emailOtpSent && (
            <View style={styles.resendContainer}>
              <Text
                style={[
                  typography.bodySm,
                  { color: colors.font_dark, textAlign: "center" },
                ]}
              >
                Didn&apos;t receive the code?{" "}
              </Text>
              <TouchableOpacity
                onPress={isLoading ? undefined : handleSendOTP}
                disabled={isLoading}
                style={styles.resendButton}
              >
                <Text
                  style={[
                    typography.bodySm,
                    {
                      color: isLoading
                        ? colors.font_placeholder
                        : colors.font_brand,
                      fontWeight: "bold",
                    },
                  ]}
                >
                  {isLoading ? "Sending..." : "Resend Code"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
  emailNotificationContainer: {
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  otpInput: {
    width: 40,
    height: 50,
    borderRadius: 12,
    textAlign: "center",
    fontSize: 20,
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
  },
  resendContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    gap: 4,
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
