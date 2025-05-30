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
import BlurHeader, { BlurHeaderProps } from "./BlurHeader";

type HeaderContainerProps = {
  children: React.ReactNode;
  customStyle?: StyleProp<ViewStyle>;
  isCenter?: boolean;
  isScrollable?: boolean;
  withPadding?: boolean;
  extraPaddingTop?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
  headerProps?: BlurHeaderProps;
  hideHeader?: boolean;
};

export default function HeaderContainer({
  children,
  customStyle,
  isCenter = false,
  isScrollable = true,
  withPadding = true,
  extraPaddingTop = 10,
  contentContainerStyle,
  headerProps,
  hideHeader = false,
}: HeaderContainerProps) {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();
  const statusBarHeight = StatusBar.currentHeight || 0;

  // Calculate header height based on platform and insets
  const headerHeight = hideHeader
    ? 0
    : Platform.OS === "ios"
    ? insets.top + 62 + extraPaddingTop
    : statusBarHeight + 60 + extraPaddingTop;

  return (
    <SafeAreaView
      edges={["right", "bottom", "left"]}
      style={[
        {
          position: "relative",
          backgroundColor: colors.bg_offwhite,
          flex: 1,
          height: "100%",
          width: "100%",
        },
        customStyle,
      ]}
    >
      {!hideHeader && headerProps && <BlurHeader {...headerProps} />}

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
