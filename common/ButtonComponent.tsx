import { useAppColors } from "@/constants/Colors";
import { typography } from "@/constants/styles";
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

export type ButtonComponentProps = {
  text: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
  bgColor?: string;
  imageIcon?: ImageSourcePropType;
  vectorIcon?: React.ReactNode;
  iconHeight?: number;
  iconWidth?: number;
  disabled?: boolean;
  icon?: () => React.ReactNode;
};

export default function ButtonComponent({
  text,
  onPress,
  style,
  textColor,
  bgColor,
  imageIcon,
  vectorIcon,
  iconHeight = 24,
  iconWidth = 24,
  disabled = false,
  icon,
}: ButtonComponentProps) {
  const themeColors = useAppColors();
  const finalTextColor = textColor || themeColors.font_dark;
  const finalBgColor = bgColor || themeColors.bg_gray;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
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
              flexDirection: "row",
            },
        {
          backgroundColor: finalBgColor,
          gap: 8,
          opacity: disabled ? 0.7 : 1,
        },
      ]}
    >
      {imageIcon && (
        <Image
          source={imageIcon}
          style={{
            width: iconWidth,
            height: iconHeight,
            objectFit: "contain",
          }}
        />
      )}
      {vectorIcon && vectorIcon}
      {icon && icon()}
      <Text style={[typography.button, { color: finalTextColor }]}>{text}</Text>
    </TouchableOpacity>
  );
}
