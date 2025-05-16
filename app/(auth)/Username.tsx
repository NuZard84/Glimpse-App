import ButtonComponent from "@/common/ButtonComponent";
import PageContainer from "@/common/PageContainer";
import { useAppColors } from "@/constants/Colors";
import { typography } from "@/constants/styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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

export default function UsernamePage() {
  const colors = useAppColors();
  const [username, setUsername] = useState("");

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

  const handleUsernameChange = (text: string) => {
    // Allow only alphanumeric characters and underscore
    const sanitizedText = text.replace(/[^a-zA-Z0-9_]/g, "");
    setUsername(sanitizedText);
  };

  const handleContinue = () => {
    // Only proceed if username has at least 3 characters
    if (username.length < 3) return;

    // Handle username submission
    console.log("Username submitted:", username);
    // Navigate to next screen
    // router.push("/(app)/Home");
  };

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
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.textInput,
                { backgroundColor: colors.bg_gray, color: colors.font_dark },
              ]}
              placeholderTextColor={colors.font_placeholder}
              placeholder="Username"
              value={username}
              onChangeText={handleUsernameChange}
              cursorColor={colors.font_brand}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {username.length > 0 && (
              <Text
                style={[
                  typography.bodySm,
                  { color: colors.font_dark, marginTop: 8 },
                ]}
              >
                This is how other users will identify you
              </Text>
            )}
          </View>
        </Animated.View>

        <Animated.View style={[styles.buttonsContainer, buttonsAnimatedStyle]}>
          <ButtonComponent
            text="Continue"
            textColor={colors.font_brand}
            bgColor={colors.bg_light_brand}
            onPress={handleContinue}
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
