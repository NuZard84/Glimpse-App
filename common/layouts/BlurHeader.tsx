import { useAppColors } from "@/constants/Colors";
import { typography } from "@/constants/styles";
import { hexToRgba } from "@/utils/hex-to-rgba";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export type BlurHeaderProps = {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  showRightButtons?: boolean;
  customLeftComponent?: React.ReactNode;
  customRightComponent?: React.ReactNode;
  customCenterComponent?: React.ReactNode;
  onBackPress?: () => void;
  blurIntensity?: number;
  leftIcon?: {
    name: string;
    type?: "material" | "materialCommunity";
    onPress?: () => void;
  };
  rightIcons?: {
    name: string;
    type?: "material" | "materialCommunity";
    onPress?: () => void;
  }[];
};

export default function BlurHeader({
  title,
  subtitle,
  showBackButton = true,
  showRightButtons = true,
  customLeftComponent,
  customRightComponent,
  customCenterComponent,
  onBackPress,
  blurIntensity = 75,
  leftIcon,
  rightIcons,
}: BlurHeaderProps) {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();

  // Get the appropriate icon component based on type
  const getIconComponent = (
    name: string,
    type: "material" | "materialCommunity" = "materialCommunity"
  ) => {
    if (type === "material") {
      return (
        <MaterialIcons name={name as any} size={20} color={colors.font_dark} />
      );
    }
    return (
      <MaterialCommunityIcons
        name={name as any}
        size={20}
        color={colors.font_dark}
      />
    );
  };

  // Render left component (back button or custom)
  const renderLeftComponent = () => {
    if (customLeftComponent) {
      return customLeftComponent;
    }

    if (showBackButton) {
      return (
        <TouchableOpacity
          onPress={onBackPress || (() => router.back())}
          style={[
            styles.iconButton,
            { backgroundColor: hexToRgba(colors.bg_offwhite, 1) },
          ]}
        >
          {leftIcon ? (
            getIconComponent(leftIcon.name, leftIcon.type)
          ) : (
            <MaterialCommunityIcons
              name="chevron-left"
              size={20}
              color={colors.font_dark}
            />
          )}
        </TouchableOpacity>
      );
    }

    return <View style={{ width: 30 }} />;
  };

  // Render center component (title or custom)
  const renderCenterComponent = () => {
    if (customCenterComponent) {
      return customCenterComponent;
    }

    return (
      <View
        style={[
          styles.titleContainer,
          { backgroundColor: hexToRgba(colors.bg_offwhite, 1) },
        ]}
      >
        <MaterialCommunityIcons
          name="account-circle-outline"
          size={20}
          color={colors.font_dark}
        />
        <View>
          <Text
            style={{
              ...typography.bodySm,
              color: colors.font_dark,
            }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={{
                ...typography.bodyXs,
                color: colors.font_placeholder,
              }}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    );
  };

  // Render right component (buttons or custom)
  const renderRightComponent = () => {
    if (customRightComponent) {
      return customRightComponent;
    }

    if (showRightButtons) {
      if (rightIcons && rightIcons.length > 0) {
        return (
          <View style={styles.rightButtonsContainer}>
            {rightIcons.map((icon, index) => (
              <TouchableOpacity
                key={index}
                onPress={icon.onPress}
                style={[
                  styles.iconButton,
                  { backgroundColor: hexToRgba(colors.bg_offwhite, 0.3) },
                ]}
              >
                {getIconComponent(icon.name, icon.type)}
              </TouchableOpacity>
            ))}
          </View>
        );
      }

      return (
        <View style={styles.rightButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.iconButton,
              { backgroundColor: hexToRgba(colors.bg_offwhite, 0.3) },
            ]}
          >
            <MaterialIcons
              name="person-add-alt"
              size={20}
              color={colors.font_dark}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/Profile")}
            style={[
              styles.iconButton,
              { backgroundColor: hexToRgba(colors.bg_offwhite, 0.3) },
            ]}
          >
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={20}
              color={colors.font_dark}
            />
          </TouchableOpacity>
        </View>
      );
    }

    return <View style={{ width: 32 }} />;
  };

  // iOS implementation with BlurView
  if (Platform.OS === "ios") {
    return (
      <View style={[styles.headerContainer, { height: insets.top + 60 }]}>
        <BlurView
          intensity={blurIntensity}
          tint="light"
          style={StyleSheet.absoluteFillObject}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.headerContent}>
              {renderLeftComponent()}
              {renderCenterComponent()}
              {renderRightComponent()}
            </View>
          </SafeAreaView>
        </BlurView>
      </View>
    );
  }

  // Android implementation
  return (
    <SafeAreaView
      style={[
        styles.headerContainer,
        { backgroundColor: hexToRgba(colors.bg_offwhite, 0.85) },
      ]}
    >
      <View style={styles.headerContent}>
        {renderLeftComponent()}
        {renderCenterComponent()}
        {renderRightComponent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 60,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 55,
    paddingHorizontal: 7,
    paddingVertical: 4,
    gap: 5,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  rightButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
