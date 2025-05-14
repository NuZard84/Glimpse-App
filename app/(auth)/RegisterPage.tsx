import ButtonComponent from "@/common/ButtonComponent";
import CountryCodeSelector from "@/common/CountryCodeSelector";
import PageContainer from "@/common/PageContainer";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/styles";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
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

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
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

  // Terms animation styles
  const termsAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: termsOpacity.value,
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
      <View style={styles.container}>
        <Animated.View style={[styles.headerContainer, logoAnimatedStyle]}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
          />
          <Animated.Text style={[typography.h1, headerTextStyle]}>
            Sign up
          </Animated.Text>
          <Animated.Text
            style={[typography.body, styles.subheaderText, headerTextStyle]}
          >
            Join us and enjoy exclusive features tailored just for you.
          </Animated.Text>
        </Animated.View>

        <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              cursorColor={colors.font_brand}
              placeholder="Username"
              placeholderTextColor={colors.font_placeholder}
              value={username}
              onChangeText={setUsername}
            />
            <AntDesign
              name="user"
              size={20}
              color={colors.font_placeholder}
              style={styles.inputIcon}
            />
          </View>

          <View style={styles.inputContainer}>
            <CountryCodeSelector
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              placeholder="Phone number"
            />
            <AntDesign
              name="phone"
              size={20}
              color={colors.font_placeholder}
              style={styles.inputIcon}
            />
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
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
        </Animated.View>

        <Animated.View style={[styles.buttonsContainer, buttonsAnimatedStyle]}>
          <ButtonComponent
            text="Signup"
            textColor={colors.font_brand}
            bgColor={colors.bg_light_brand}
            onPress={() => {}}
          />
          <Text style={[typography.bodySm, { textAlign: "center" }]}>
            Already have an account?{" "}
            <Text
              onPress={() => {
                router.push("/(auth)/LoginPage");
              }}
              style={[typography.bodySm, { color: colors.font_brand }]}
            >
              Login
            </Text>
          </Text>
        </Animated.View>

        <Animated.View style={[styles.dividerContainer, buttonsAnimatedStyle]}>
          <View style={styles.dividerLine} />
          <Text style={[typography.bodySm, styles.dividerText]}>or</Text>
          <View style={styles.dividerLine} />
        </Animated.View>

        <Animated.View
          style={[styles.googleButtonContainer, buttonsAnimatedStyle]}
        >
          <ButtonComponent text="Signup with Google" onPress={() => {}} />
        </Animated.View>

        <Animated.View style={[styles.termsContainer, termsAnimatedStyle]}>
          <Text style={[typography.bodySm, { textAlign: "center" }]}>
            By signing to create an account I accept Company&apos;s{" "}
            <Text
              onPress={() => {}}
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
    backgroundColor: colors.bg_gray,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: colors.font_dark,
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bg_gray,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
    color: colors.font_dark,
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
    backgroundColor: colors.bg_gray,
  },
  dividerText: {
    marginHorizontal: 10,
    color: colors.font_dark,
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
  },
  inputIcon: {
    position: "absolute",
    right: 16,
    top: 14,
    zIndex: 1,
  },
});
