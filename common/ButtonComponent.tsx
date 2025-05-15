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

type ButtonComponentProps = {
  text: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
  bgColor?: string;
  imageIcon?: ImageSourcePropType;
  vectorIcon?: React.ReactNode;
  iconHeight?: number;
  iconWidth?: number;
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
}: ButtonComponentProps) {
  const themeColors = useAppColors();
  const finalTextColor = textColor || themeColors.font_dark;
  const finalBgColor = bgColor || themeColors.bg_gray;

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
              flexDirection: "row",
            },
        { backgroundColor: finalBgColor, gap: 8 },
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
      <Text style={[typography.button, { color: finalTextColor }]}>{text}</Text>
    </TouchableOpacity>
  );
}
