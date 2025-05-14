import { useAppColors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

type ThemeToggleIconProps = {
  size?: number;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

export default function ThemeToggleIcon({
  size = 24,
  style,
  onPress,
}: ThemeToggleIconProps) {
  const { theme, toggleTheme } = useTheme();
  const colors = useAppColors();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      toggleTheme();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        {
          width: size * 1.8,
          height: size * 1.8,
          borderRadius: (size * 1.8) / 2,
          backgroundColor: colors.bg_gray,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <View>
        {theme === "dark" ? (
          <Feather name="sun" size={size} color={colors.font_dark} />
        ) : (
          <Feather name="moon" size={size} color={colors.font_dark} />
        )}
      </View>
    </TouchableOpacity>
  );
}
