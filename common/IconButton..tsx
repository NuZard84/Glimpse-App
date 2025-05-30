import { useAppColors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { SFSymbol, SymbolView } from "expo-symbols";
import { ComponentProps } from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";

interface IconButtonProps {
  iosName: SFSymbol;
  androidName: ComponentProps<typeof Ionicons>["name"];
  containerStyle?: StyleProp<ViewStyle>;
  onPress: () => void;
  color?: string;
  width?: number;
  height?: number;
}

const ICON_SIZE = 30;

export default function IconButton({
  iosName,
  androidName,
  containerStyle,
  onPress,
  color,
  width,
  height,
}: IconButtonProps) {
  const colors = useAppColors();

  return (
    <TouchableOpacity
      style={[
        containerStyle,
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
      onPress={onPress}
    >
      <SymbolView
        name={iosName}
        style={width && height ? { width, height } : {}}
        tintColor={"white"}
        fallback={
          <Ionicons
            name={androidName}
            size={ICON_SIZE}
            color={color || colors.font_dark}
          />
        }
      />
    </TouchableOpacity>
  );
}
