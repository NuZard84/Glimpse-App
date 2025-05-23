import { useAppColors } from "@/constants/Colors";
import { StyleProp, View, ViewStyle } from "react-native";

type PageContainerProps = {
  children: React.ReactNode;
  customStyle?: StyleProp<ViewStyle>;
  isCenter?: boolean;
};

export default function PageContainer({
  children,
  customStyle,
  isCenter = true,
}: PageContainerProps) {
  const colors = useAppColors();

  return (
    <View
      style={[
        { position: "relative", backgroundColor: colors.bg_offwhite },
        customStyle
          ? customStyle
          : {
              flex: 1,
              paddingHorizontal: 16,
            },
        isCenter ? { alignItems: "center", justifyContent: "center" } : {},
      ]}
    >
      {children}
    </View>
  );
}
