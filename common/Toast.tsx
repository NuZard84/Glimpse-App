import { useAppColors } from "@/constants/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onHide?: () => void;
  isClosable?: boolean;
}

const Toast: React.FC<ToastProps> = ({
  visible = false,
  message = "",
  type = "info",
  duration = 3000,
  onHide,
  isClosable = false,
}) => {
  const colors = useAppColors();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(100)).current;
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, duration]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      if (onHide) onHide();
    });
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return colors.bg_success;
      case "error":
        return colors.bg_error;
      case "warning":
        return colors.bg_warn;
      case "info":
      default:
        return colors.bg_info;
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return colors.font_success;
      case "error":
        return colors.font_error;
      case "warning":
        return colors.font_warn;
      case "info":
      default:
        return colors.font_info;
    }
  };

  const renderIcon = () => {
    const color = getTextColor();

    switch (type) {
      case "success":
        return <MaterialIcons name="download-done" size={18} color={color} />;
      case "error":
        return <Ionicons name="close" size={18} color={color} />;
      case "warning":
        return <Ionicons name="warning-outline" size={18} color={color} />;
      case "info":
      default:
        return (
          <Ionicons name="information-circle-outline" size={18} color={color} />
        );
    }
  };

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
          backgroundColor: getBackgroundColor(),
        },
      ]}
    >
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>{renderIcon()}</View>
        <Text style={[styles.message, { color: getTextColor() }]}>
          {message}
        </Text>
        {isClosable && (
          <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
            <Text style={[styles.closeText, { color: getTextColor() }]}>×</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "auto",
    bottom: 42,
    left: 16,
    right: 16,
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
    zIndex: 9999,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 8,
  },
  message: {
    fontSize: 13,
    flex: 1,
    fontWeight: "500",
  },
  closeButton: {
    marginLeft: 6,
    paddingHorizontal: 2,
  },
  closeText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Toast;

// Usage example:
// const ToastManager = () => {
//   const [toast, setToast] = useState({
//     visible: false,
//     message: '',
//     type: 'info' as ToastType,
//   });
//
//   const showToast = (message: string, type: ToastType = 'info') => {
//     setToast({ visible: true, message, type });
//   };
//
//   const hideToast = () => {
//     setToast(prev => ({ ...prev, visible: false }));
//   };
//
//   return (
//     <Toast
//       visible={toast.visible}
//       message={toast.message}
//       type={toast.type}
//       onHide={hideToast}
//     />
//   );
// };
