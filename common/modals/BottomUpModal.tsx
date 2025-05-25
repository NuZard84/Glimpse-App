import { useAppColors } from "@/constants/Colors";
import { typography } from "@/constants/styles";
import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export type BottomModalType = "avatar" | "input";

interface BottomUpModalProps {
  visible: boolean;
  type: BottomModalType;
  title: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
  onClose: () => void;
  avatars?: any[];
  needPass?: boolean; // New prop
  onPasswordVerify?: (password: string) => Promise<boolean>; // New prop for password verification
}
const BottomUpModal: React.FC<BottomUpModalProps> = ({
  visible,
  type,
  title,
  placeholder,
  value,
  onChangeText,
  primaryButtonText = "continue",
  secondaryButtonText = "cancel",
  onPrimaryPress,
  onSecondaryPress,
  onClose,
  avatars = [],
  needPass = false,
  onPasswordVerify,
}) => {
  const colors = useAppColors();
  const translateY = useSharedValue(screenHeight);
  const opacity = useSharedValue(0);
  const [selectedAvatar, setSelectedAvatar] = React.useState(0);

  // New state for password verification
  const [showPasswordVerification, setShowPasswordVerification] =
    React.useState(false);
  const [password, setPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [isVerifying, setIsVerifying] = React.useState(false);

  React.useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, { damping: 20, stiffness: 150 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withSpring(screenHeight, {
        damping: 20,
        stiffness: 150,
      });
      // Reset password states when modal closes
      setShowPasswordVerification(false);
      setPassword("");
      setPasswordError("");
      setIsVerifying(false);
    }
  }, [visible]);

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleOverlayPress = () => {
    if (!showPasswordVerification) {
      onClose();
    }
  };

  const handlePrimaryPress = async () => {
    if (needPass && !showPasswordVerification) {
      // Show password verification first
      setShowPasswordVerification(true);
      return;
    }

    if (showPasswordVerification) {
      // Verify password
      if (!onPasswordVerify) {
        console.warn("Password verification function not provided");
        return;
      }

      setIsVerifying(true);
      setPasswordError("");

      try {
        const isValid = await onPasswordVerify(password);
        if (isValid) {
          // Password is correct, execute the original function
          onPrimaryPress?.();
          setShowPasswordVerification(false);
          setPassword("");
        } else {
          setPasswordError("Incorrect password. Please try again.");
        }
      } catch (error) {
        setPasswordError("Verification failed. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    } else {
      // Normal flow without password verification
      onPrimaryPress?.();
    }
  };

  const handleSecondaryPress = () => {
    if (showPasswordVerification) {
      // Cancel password verification, go back to main content
      setShowPasswordVerification(false);
      setPassword("");
      setPasswordError("");
    } else {
      onSecondaryPress?.();
    }
  };

  const defaultAvatars = [
    require("@/assets/images/logo.png"),
    require("@/assets/images/logo.png"),
    require("@/assets/images/logo.png"),
    require("@/assets/images/logo.png"),
  ];

  const avatarList = avatars.length > 0 ? avatars : defaultAvatars;

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.overlay, animatedOverlayStyle]}>
        <TouchableOpacity
          style={styles.overlayTouch}
          activeOpacity={1}
          onPress={handleOverlayPress}
        />

        <Animated.View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.bg_gray },
            animatedModalStyle,
          ]}
        >
          {/* Handle bar */}
          <View
            style={[
              styles.handleBar,
              { backgroundColor: colors.font_placeholder },
            ]}
          />

          <Text
            style={[styles.title, typography.h2, { color: colors.font_dark }]}
          >
            {showPasswordVerification ? "Enter Password" : title}
          </Text>

          {showPasswordVerification ? (
            // Password verification UI
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.bg_offwhite,
                    color: colors.font_dark,
                    borderWidth: passwordError ? 1 : 0,
                    borderColor: passwordError
                      ? colors.font_error
                      : "transparent",
                  },
                ]}
                placeholder="enter password"
                placeholderTextColor={colors.font_placeholder}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError("");
                }}
                secureTextEntry
                autoFocus
              />
              {passwordError ? (
                <Text style={[styles.errorText, { color: colors.font_error }]}>
                  {passwordError}
                </Text>
              ) : null}
            </View>
          ) : (
            // Original content
            <>
              {type === "avatar" ? (
                <ScrollView
                  style={styles.avatarContainer}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.avatarGrid}>
                    {avatarList.map((avatar, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.avatarItem,
                          selectedAvatar === index && {
                            borderColor: colors.font_brand,
                            borderWidth: 3,
                          },
                        ]}
                        onPress={() => setSelectedAvatar(index)}
                      >
                        <Image source={avatar} style={styles.avatarImage} />
                        {selectedAvatar === index && (
                          <View
                            style={[
                              styles.checkIcon,
                              { backgroundColor: colors.font_brand },
                            ]}
                          >
                            <FontAwesome5
                              name="check"
                              size={12}
                              color="#FFFFFF"
                            />
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.gallerySection}>
                    <TouchableOpacity
                      style={[
                        styles.galleryIcon,
                        { backgroundColor: colors.bg_offwhite },
                      ]}
                    >
                      <FontAwesome5
                        name="images"
                        size={24}
                        color={colors.font_dark}
                      />
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              ) : (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: colors.bg_offwhite,
                        color: colors.font_dark,
                      },
                    ]}
                    placeholder={placeholder}
                    placeholderTextColor={colors.font_placeholder}
                    value={value}
                    onChangeText={onChangeText}
                  />
                </View>
              )}
            </>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.secondaryButton,
                { backgroundColor: colors.bg_offwhite },
              ]}
              onPress={handleSecondaryPress}
            >
              <Text
                style={[
                  styles.buttonText,
                  typography.body,
                  { color: colors.font_dark },
                ]}
              >
                {showPasswordVerification ? "back" : secondaryButtonText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.primaryButton,
                {
                  backgroundColor: colors.font_brand,
                  opacity: isVerifying ? 0.6 : 1,
                },
              ]}
              onPress={handlePrimaryPress}
              disabled={isVerifying}
            >
              <Text
                style={[
                  styles.buttonText,
                  typography.body,
                  { color: "#FFFFFF" },
                ]}
              >
                {isVerifying
                  ? "verifying..."
                  : showPasswordVerification
                  ? "verify"
                  : primaryButtonText}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  overlayTouch: {
    flex: 1,
  },
  modalContainer: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    maxHeight: screenHeight * 0.8,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "600",
  },
  avatarContainer: {
    flex: 1,
    marginBottom: 24,
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  avatarItem: {
    width: (screenWidth - 80) / 2,
    aspectRatio: 1,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    position: "relative",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  checkIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  gallerySection: {
    alignItems: "flex-start",
    marginTop: 10,
  },
  galleryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    marginBottom: 24,
  },
  textInput: {
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    // Primary button styling handled by backgroundColor prop
  },
  secondaryButton: {
    // Secondary button styling handled by backgroundColor prop
  },
  buttonText: {
    fontWeight: "500",
  },
  passwordContainer: {
    marginBottom: 24,
  },
  errorText: {
    fontSize: 14,
    marginTop: 8,
    marginLeft: 20,
  },
});

export default BottomUpModal;
