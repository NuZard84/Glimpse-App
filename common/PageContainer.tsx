import { useAppColors } from "@/constants/Colors";
import { Platform, StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PageContainerProps = {
  children: React.ReactNode;
  customStyle?: StyleProp<ViewStyle>;
  isCenter?: boolean;
  edges?: ("top" | "right" | "bottom" | "left")[];
  withPadding?: boolean;
};

export default function PageContainer({
  children,
  customStyle,
  isCenter = true,
  edges = ["right", "bottom", "left"],
  withPadding = true,
}: PageContainerProps) {
  const colors = useAppColors();

  return (
    <SafeAreaView
      edges={edges}
      style={[
        {
          position: "relative",
          backgroundColor: colors.bg_offwhite,
          flex: 1,
        },
        withPadding && Platform.OS !== "android"
          ? { paddingHorizontal: 16 }
          : {},
        customStyle ? customStyle : {},
        isCenter ? { alignItems: "center", justifyContent: "center" } : {},
      ]}
    >
      {children}
    </SafeAreaView>
  );
}
