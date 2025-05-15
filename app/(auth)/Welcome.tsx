import ButtonComponent from "@/common/ButtonComponent";
import PageContainer from "@/common/PageContainer";
import ThemeToggleIcon from "@/common/ThemeToggleIcon";
import { useAppColors } from "@/constants/Colors";
import { typography } from "@/constants/styles";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function Welcome() {
  const colors = useAppColors();

  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.5);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(30);

  // Logo animation styles
  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [{ scale: logoScale.value }],
    };
  });

  // Text animation styles
  const welcomeTextStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
      transform: [{ translateY: textTranslateY.value }],
    };
  });

  const titleTextStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
      transform: [
        { translateY: textTranslateY.value },
        {
          scale: interpolate(
            textOpacity.value,
            [0, 1],
            [0.9, 1],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  // Button animation styles
  const buttonContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonOpacity.value,
      transform: [{ translateY: buttonTranslateY.value }],
    };
  });

  // Trigger animations on component mount
  useEffect(() => {
    // Logo animation
    logoOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    logoScale.value = withSequence(
      withTiming(1.1, { duration: 500 }),
      withTiming(1, { duration: 300 })
    );

    // Text animations with staggered delay
    textOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
    textTranslateY.value = withDelay(600, withSpring(0, { damping: 12 }));

    // Button animations with further delay
    buttonOpacity.value = withDelay(1000, withTiming(1, { duration: 800 }));
    buttonTranslateY.value = withDelay(1000, withSpring(0, { damping: 12 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContainer>
      <ThemeToggleIcon style={styles.themeToggle} size={22} />
      <View style={styles.container}>
        <View style={styles.welcomeCotainer}>
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <Image
              source={require("../../assets/images/grad_logo.png")}
              style={styles.logo}
            />
          </Animated.View>
          <Animated.Text
            style={[
              typography.body,
              welcomeTextStyle,
              { color: colors.font_dark },
            ]}
          >
            Welcome To
          </Animated.Text>
          <Animated.Text
            style={[typography.h1, titleTextStyle, { color: colors.font_dark }]}
          >
            Glimpse
          </Animated.Text>
        </View>
        <Animated.View style={[styles.signupContainer, buttonContainerStyle]}>
          <ButtonComponent
            text="Sign up"
            onPress={() => {
              router.push("/(auth)/RegisterPage");
            }}
            bgColor={colors.bg_gray}
            textColor={colors.font_dark}
            vectorIcon={
              <MaterialIcons name="login" size={24} color={colors.font_dark} />
            }
          />
          {/* <ButtonComponent
            text="Sign up with Google"
            onPress={() => {}}
            bgColor={colors.bg_gray}
            textColor={colors.font_dark}
            icon={require("../../assets/images/google.png")}
          /> */}
        </Animated.View>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    padding: 8,
    width: "100%",
    height: "100%",
    gap: 24,
  },
  welcomeCotainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 90,
  },
  logoContainer: {
    position: "absolute",
    top: 0,
  },
  logo: {
    objectFit: "contain",
    width: 135,
    height: 135,
  },
  signupContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 16,
  },
  themeToggle: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 100,
  },
});
