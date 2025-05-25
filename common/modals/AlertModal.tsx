import { useAppColors } from "@/constants/Colors";
import { typography } from "@/constants/styles";
import { AntDesign, Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width: screenWidth } = Dimensions.get("window");

export type AlertType = "error" | "warn" | "info" | "success";

interface AlertModalProps {
  visible: boolean;
  type: AlertType;
  title: string;
  message: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  type,
  title,
  message,
  primaryButtonText = "OK",
  secondaryButtonText,
  onPrimaryPress,
  onSecondaryPress,
  onClose,
}) => {
  const colors = useAppColors();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    } else {
      opacity.value = withTiming(0, { duration: 150 });
      scale.value = withTiming(0, { duration: 150 });
    }
  }, [visible]);

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getButtonColor = () => {
    switch (type) {
      case "error":
        return colors.font_error;
      case "warn":
        return colors.font_warn;
      case "info":
        return colors.font_info;
      case "success":
        return colors.font_success;
      default:
        return colors.font_brand;
    }
  };

  const renderIcon = () => {
    const iconSize = 54;

    switch (type) {
      case "error":
        return (
          <MaterialIcons
            name="dangerous"
            size={iconSize}
            color={colors.font_error}
          />
        );
      case "warn":
        return (
          <Entypo name="warning" size={iconSize} color={colors.font_warn} />
        );
      case "info":
        return (
          <AntDesign
            name="infocirlce"
            size={iconSize}
            color={colors.font_info}
          />
        );
      case "success":
        return (
          <Ionicons
            name="checkmark-circle-sharp"
            size={iconSize}
            color={colors.font_success}
          />
        );
      default:
        return (
          <AntDesign
            name="infocirlce"
            size={iconSize}
            color={colors.font_info}
          />
        );
    }
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.overlay, animatedOverlayStyle]}>
        <TouchableOpacity
          style={styles.overlayTouch}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.bg_gray },
            animatedModalStyle,
          ]}
        >
          <View style={{ alignItems: "center", marginBottom: 16 }}>
            {renderIcon()}
          </View>
          <Text
            style={[styles.title, typography.h2, { color: colors.font_dark }]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.message,
              typography.body,
              { color: colors.font_placeholder },
            ]}
          >
            {message}
          </Text>
          <View style={styles.buttonContainer}>
            {secondaryButtonText && (
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.secondaryButton,
                  { backgroundColor: colors.bg_offwhite },
                ]}
                onPress={onSecondaryPress || onClose}
              >
                <Text
                  style={[
                    styles.buttonText,
                    typography.body,
                    { color: colors.font_dark },
                  ]}
                >
                  {secondaryButtonText}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                styles.primaryButton,
                { backgroundColor: getButtonColor() },
              ]}
              onPress={onPrimaryPress || onClose}
            >
              <Text
                style={[
                  styles.buttonText,
                  typography.body,
                  { color: "#FFFFFF" },
                ]}
              >
                {primaryButtonText}
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  overlayTouch: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: screenWidth - 40,
    maxWidth: 350,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "600",
  },
  message: {
    textAlign: "center",
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
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
});

export default AlertModal;
