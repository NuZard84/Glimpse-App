import { colors } from "@/constants/Colors";
import { StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  return (
    <SafeAreaView
      style={[
        { position: "relative", backgroundColor: colors.bg_offwhite },
        customStyle
          ? customStyle
          : {
              paddingHorizontal: 16,
              paddingVertical: 32,
              flex: 1,
            },
        isCenter ? { alignItems: "center", justifyContent: "center" } : {},
      ]}
    >
      {children}
    </SafeAreaView>
  );
}
