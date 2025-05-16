import ButtonComponent from "@/common/ButtonComponent";
import PageContainer from "@/common/PageContainer";
import { useAppColors } from "@/constants/Colors";
import { typography } from "@/constants/styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
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

export default function ForgotPasswordPage() {
  const colors = useAppColors();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentStep, setCurrentStep] = useState("selectMethod");
  const inputRefs = useRef<TextInput[]>([]);

  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const headerTextOpacity = useSharedValue(0);
  const headerTextTranslateY = useSharedValue(20);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(30);
  const buttonsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(30);

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

  // Trigger animations on component mount and when step changes
  useEffect(() => {
    // Reset animations
    formOpacity.value = 0;
    formTranslateY.value = 30;
    buttonsOpacity.value = 0;
    buttonsTranslateY.value = 30;

    // Logo animation (only on first mount)
    if (logoOpacity.value === 0) {
      logoOpacity.value = withTiming(1, {
        duration: 600,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      logoScale.value = withSequence(
        withTiming(1.1, { duration: 400 }),
        withTiming(1, { duration: 200 })
      );

      // Header text animations with staggered delay
      headerTextOpacity.value = withDelay(
        300,
        withTiming(1, { duration: 600 })
      );
      headerTextTranslateY.value = withDelay(
        300,
        withSpring(0, { damping: 12 })
      );
    }

    // Form animations
    formOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    formTranslateY.value = withDelay(300, withSpring(0, { damping: 12 }));

    // Buttons animations
    buttonsOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
    buttonsTranslateY.value = withDelay(500, withSpring(0, { damping: 12 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];

    const numericValue = text.replace(/[^0-9]/g, "");
    newOtp[index] = numericValue;
    setOtp(newOtp);

    if (numericValue && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSendOTP = () => {
    if (!email) {
      // Show error for email
      return;
    }

    // First fade out the form
    formOpacity.value = withTiming(0, { duration: 300 });
    formTranslateY.value = withTiming(10, { duration: 300 });

    // Then update the state and fade in with new content
    setTimeout(() => {
      setCurrentStep("verification");

      // Fade in with the new content
      formOpacity.value = withTiming(1, { duration: 300 });
      formTranslateY.value = withTiming(0, { duration: 300 });
    }, 300);
  };

  const handleResendOTP = () => {
    setOtp(["", "", "", ""]);

    console.log("Resending OTP");
  };

  const handleVerifyOTP = () => {
    if (otp.some((digit) => digit === "")) {
      // Show error for incomplete OTP
      return;
    }

    // fade out the form
    formOpacity.value = withTiming(0, { duration: 300 });
    formTranslateY.value = withTiming(10, { duration: 300 });

    setTimeout(() => {
      setCurrentStep("resetPassword");

      // Fade in with the new content
      formOpacity.value = withTiming(1, { duration: 300 });
      formTranslateY.value = withTiming(0, { duration: 300 });
    }, 300);
  };

  const handleResetPassword = () => {
    if (password === confirmPassword && password !== "") {
      console.log("Password reset successfully");
      router.back();
    }
  };

  const handleBackPress = () => {
    if (currentStep === "selectMethod") {
      router.back();
    } else if (currentStep === "verification") {
      // fade out the form
      formOpacity.value = withTiming(0, { duration: 300 });
      formTranslateY.value = withTiming(10, { duration: 300 });

      setTimeout(() => {
        setCurrentStep("selectMethod");

        // Fade in with the new content
        formOpacity.value = withTiming(1, { duration: 300 });
        formTranslateY.value = withTiming(0, { duration: 300 });
      }, 300);
    } else if (currentStep === "resetPassword") {
      return;
    }
  };

  const getScreenTitle = () => {
    switch (currentStep) {
      case "selectMethod":
        return "Reset Password";
      case "verification":
        return "Verify Account";
      case "resetPassword":
        return "Create Password";
      default:
        return "Reset Password";
    }
  };

  const getScreenSubtitle = () => {
    switch (currentStep) {
      case "selectMethod":
        return "Enter your email to reset your password";
      case "verification":
        return "Enter the verification code sent to your email";
      case "resetPassword":
        return "Create a new secure password";
      default:
        return "";
    }
  };

  return (
    <PageContainer>
      {currentStep !== "resetPassword" && (
        <TouchableOpacity
          onPress={handleBackPress}
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
      )}

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
            {getScreenTitle()}
          </Animated.Text>
          <Animated.Text
            style={[
              typography.body,
              styles.subheaderText,
              headerTextStyle,
              { color: colors.font_dark },
            ]}
          >
            {getScreenSubtitle()}
          </Animated.Text>
        </Animated.View>

        {currentStep === "selectMethod" && (
          <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.bg_gray,
                    color: colors.font_dark,
                  },
                ]}
                cursorColor={colors.font_brand}
                placeholder="Email"
                placeholderTextColor={colors.font_placeholder}
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </Animated.View>
        )}

        {currentStep === "verification" && (
          <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
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
                    color: colors.font_dark,
                    textAlign: "center",
                    fontWeight: "bold",
                    width: "90%",
                  },
                ]}
              >
                {" "}
                {email}
              </Text>
            </Text>

            <View style={styles.otpContainer}>
              {[0, 1, 2, 3].map((index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    if (ref) inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.otpInput,
                    {
                      backgroundColor: colors.bg_gray,
                      color: colors.font_dark,
                    },
                  ]}
                  maxLength={1}
                  keyboardType="numeric"
                  value={otp[index]}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  cursorColor={colors.font_brand}
                />
              ))}
            </View>
          </Animated.View>
        )}

        {currentStep === "resetPassword" && (
          <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
            <TextInput
              style={[
                styles.textInput,
                { backgroundColor: colors.bg_gray, color: colors.font_dark },
              ]}
              placeholder="Password"
              placeholderTextColor={colors.font_placeholder}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              cursorColor={colors.font_brand}
            />

            <TextInput
              style={[
                styles.textInput,
                { backgroundColor: colors.bg_gray, color: colors.font_dark },
              ]}
              placeholder="Confirm password"
              placeholderTextColor={colors.font_placeholder}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              cursorColor={colors.font_brand}
            />
          </Animated.View>
        )}

        <Animated.View style={[styles.buttonsContainer, buttonsAnimatedStyle]}>
          {currentStep === "selectMethod" && (
            <ButtonComponent
              text="Send OTP"
              textColor={colors.font_brand}
              bgColor={colors.bg_light_brand}
              onPress={handleSendOTP}
            />
          )}

          {currentStep === "verification" && (
            <>
              <ButtonComponent
                text="Verify"
                textColor={colors.font_brand}
                bgColor={colors.bg_light_brand}
                onPress={handleVerifyOTP}
              />

              <Text
                style={[
                  typography.bodySm,
                  { color: colors.font_dark, textAlign: "center" },
                ]}
              >
                Didn&apos;t receive it?{" "}
                <Text
                  onPress={handleResendOTP}
                  style={[typography.bodySm, { color: colors.font_brand }]}
                >
                  Resend
                </Text>
              </Text>
            </>
          )}

          {currentStep === "resetPassword" && (
            <ButtonComponent
              text="Reset Password"
              textColor={colors.font_brand}
              bgColor={colors.bg_light_brand}
              onPress={handleResetPassword}
            />
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
  inputContainer: {
    width: "100%",
    position: "relative",
  },
  textInput: {
    width: "100%",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontFamily: "CalSans",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
  },
  otpInput: {
    width: 50,
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
});
