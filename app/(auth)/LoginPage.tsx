import ButtonComponent from "@/common/ButtonComponent";
import PageContainer from "@/common/PageContainer";
import ThemeToggleIcon from "@/common/ThemeToggleIcon";
import { useAppColors } from "@/constants/Colors";
import { typography } from "@/constants/styles";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
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

export default function LoginPage() {
  const colors = useAppColors();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

    // Terms animation
    termsOpacity.value = withDelay(1200, withTiming(1, { duration: 600 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <PageContainer>
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
              placeholder="Username or Email"
              placeholderTextColor={colors.font_placeholder}
              value={usernameOrEmail}
              onChangeText={setUsernameOrEmail}
            />
          </View>

          <View
            style={[
              styles.passwordContainer,
              { backgroundColor: colors.bg_gray },
            ]}
          >
            <TextInput
              style={[styles.passwordInput, { color: colors.font_dark }]}
              cursorColor={colors.font_brand}
              placeholder="Password"
              placeholderTextColor={colors.font_placeholder}
              value={password}
              onChangeText={setPassword}
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

          <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity
              onPress={() => {
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
            text="Login"
            textColor={colors.font_brand}
            bgColor={colors.bg_light_brand}
            onPress={() => {}}
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
  },
  themeToggle: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 100,
  },
});
