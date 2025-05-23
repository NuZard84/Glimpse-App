import { useAppColors } from "@/constants/Colors";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type HeaderPageContainerProps = {
  children: React.ReactNode;
  customStyle?: StyleProp<ViewStyle>;
  isCenter?: boolean;
  isScrollable?: boolean;
  withPadding?: boolean;
  extraPaddingTop?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
  hasHeader?: boolean; // Add this prop
};

export default function HeaderPageContainer({
  children,
  customStyle,
  isCenter = false,
  isScrollable = true,
  withPadding = true,
  extraPaddingTop = 0,
  contentContainerStyle,
  hasHeader = false, // Default to false
}: HeaderPageContainerProps) {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();
  const statusBarHeight = StatusBar.currentHeight || 0;

  // Calculate header height based on platform and insets
  const headerHeight = hasHeader
    ? Platform.OS === "ios"
      ? insets.top + 70 + extraPaddingTop
      : statusBarHeight + 60 + extraPaddingTop
    : extraPaddingTop; // Only use extraPaddingTop if no header

  return (
    <SafeAreaView
      edges={
        hasHeader
          ? ["right", "bottom", "left"]
          : ["top", "right", "bottom", "left"]
      } // Exclude top edge only when header is present
      style={[
        {
          position: "relative",
          backgroundColor: colors.bg_offwhite,
          flex: 1,
        },
        customStyle,
      ]}
    >
      {isScrollable ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            {
              paddingTop: headerHeight,
              paddingHorizontal: withPadding ? 16 : 0,
              paddingBottom: 40,
            },
            isCenter
              ? {
                  flexGrow: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }
              : {},
            contentContainerStyle,
          ]}
        >
          {children}
        </ScrollView>
      ) : (
        <View
          style={[
            {
              paddingTop: headerHeight,
              paddingHorizontal: withPadding ? 16 : 0,
              flex: 1,
            },
            isCenter
              ? {
                  justifyContent: "center",
                  alignItems: "center",
                }
              : {},
            contentContainerStyle,
          ]}
        >
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}
