import { colors } from "@/constants/colors";
import { typography } from "@/constants/styles";
import { StyleProp, Text, TouchableOpacity, ViewStyle } from "react-native";

type ButtonComponentProps = {
  text: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
  bgColor?: string;
};

export default function ButtonComponent({
  text,
  onPress,
  style,
  textColor = colors.font_dark,
  bgColor = colors.bg_gray,
}: ButtonComponentProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        style
          ? style
          : {
              width: "100%",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 14,
            },
        { backgroundColor: bgColor },
      ]}
    >
      <Text style={[typography.button, { color: textColor }]}>{text}</Text>
    </TouchableOpacity>
  );
}
