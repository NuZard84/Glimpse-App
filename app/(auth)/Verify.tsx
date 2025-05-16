import ButtonComponent from "@/common/ButtonComponent";
import PageContainer from "@/common/PageContainer";
import { useAppColors } from "@/constants/Colors";
import { typography } from "@/constants/styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
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

export default function VerifyPage() {
  const colors = useAppColors();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
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
    if (numericValue && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key press for backspace functionality
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSendOTP = () => {
    setEmailOtpSent(true);
    inputRefs.current[0]?.focus();
  };

  const handleVerifyOTP = () => {
    console.log("verifying otp", otp.join(""));
    router.push("/(auth)/Username");
  };

  const primaryButtonText = emailOtpSent ? "Verify" : "Send OTP";
  const primaryButtonAction = emailOtpSent ? handleVerifyOTP : handleSendOTP;

  return (
    <PageContainer>
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
              ? "Enter the 4-digit code sent to your email address"
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
                  example@email.com
                </Text>
              </Text>
            </View>
          )}

          <View style={styles.otpContainer}>
            {[0, 1, 2, 3].map((index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                style={[
                  styles.otpInput,
                  { backgroundColor: colors.bg_gray, color: colors.font_dark },
                  !emailOtpSent && { opacity: 0.5 },
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
          </View>
        </Animated.View>

        <Animated.View style={[styles.buttonsContainer, buttonsAnimatedStyle]}>
          <ButtonComponent
            text={primaryButtonText}
            textColor={colors.font_brand}
            bgColor={colors.bg_light_brand}
            onPress={primaryButtonAction}
          />

          {emailOtpSent && (
            <Text
              style={[
                typography.bodySm,
                { color: colors.font_dark, textAlign: "center" },
              ]}
            >
              Didn&apos;t receive it?{" "}
              <Text
                onPress={handleSendOTP}
                style={[typography.bodySm, { color: colors.font_brand }]}
              >
                Resend
              </Text>
            </Text>
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
