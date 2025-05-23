import { useAppColors } from "@/constants/Colors";
import { typography } from "@/constants/styles";
import { hexToRgba } from "@/utils/hex-to-rgba";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur"; // Add this import
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type CommonHeaderProps = {
  title: string;
  isBackButton?: boolean;
  isRightButton?: boolean;
  blurred?: boolean; // Change from transparent to blurred
};

export default function CommonHeader({
  title,
  isBackButton = true,
  isRightButton = true,
  blurred = false,
}: CommonHeaderProps) {
  const colors = useAppColors();

  if (blurred) {
    return (
      <BlurView
        intensity={75}
        tint="dark"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          overflow: "hidden",
          backdropFilter: "blur(100px)",
          backgroundColor: "transparent",
        }}
      >
        <SafeAreaView
          style={{
            padding: 16,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {isBackButton ? (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 30,
                  height: 30,
                  borderRadius: 30 / 2,
                  backgroundColor: hexToRgba(colors.bg_offwhite, 0.8),
                }}
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={20}
                  color={colors.font_dark}
                />
              </TouchableOpacity>
            ) : (
              <View style={{ width: 30 }} />
            )}
            <View
              style={{
                borderRadius: 100,
                paddingHorizontal: 20,
                paddingVertical: 4,
                backgroundColor: hexToRgba(colors.bg_offwhite, 0.8),
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <MaterialCommunityIcons
                name="account-circle-outline"
                size={20}
                color={colors.font_dark}
              />
              <Text
                style={{
                  ...typography.bodySm,
                  color: colors.font_dark,
                }}
              >
                {title}
              </Text>
            </View>
            {isRightButton ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                  gap: 4,
                }}
              >
                <TouchableOpacity
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 30,
                    height: 30,
                    borderRadius: 30 / 2,
                    backgroundColor: hexToRgba(colors.bg_offwhite, 0.3),
                  }}
                >
                  <MaterialIcons
                    name="person-add-alt"
                    size={20}
                    color={colors.font_dark}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/(tabs)/Profile")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 30,
                    height: 30,
                    borderRadius: 30 / 2,
                    backgroundColor: hexToRgba(colors.bg_offwhite, 0.3),
                  }}
                >
                  <MaterialCommunityIcons
                    name="account-circle-outline"
                    size={20}
                    color={colors.font_dark}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ width: 32 }} />
            )}
          </View>
        </SafeAreaView>
      </BlurView>
    );
  }

  // Regular header (non-blurred)
  return (
    <SafeAreaView
      style={{
        backgroundColor: hexToRgba(colors.font_dark, 0.1),
        padding: 16,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {/* Rest of your regular header code */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Same content as above but without BlurView wrapper */}
        {isBackButton ? (
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              height: 30,
              borderRadius: 30 / 2,
              backgroundColor: hexToRgba(colors.bg_offwhite, 0.5),
            }}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={20}
              color={colors.font_dark}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 30 }} />
        )}
        <View
          style={{
            borderRadius: 32,
            paddingHorizontal: 20,
            paddingVertical: 4,
            backgroundColor: hexToRgba(colors.bg_offwhite, 0.5),
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}
        >
          <MaterialCommunityIcons
            name="account-circle-outline"
            size={20}
            color={colors.font_dark}
          />
          <Text
            style={{
              ...typography.bodySm,
              color: colors.font_dark,
            }}
          >
            {title}
          </Text>
        </View>
        {isRightButton ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <TouchableOpacity
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 30,
                height: 30,
                borderRadius: 30 / 2,
                backgroundColor: hexToRgba(colors.bg_offwhite, 0.5),
              }}
            >
              <MaterialIcons
                name="person-add-alt"
                size={20}
                color={colors.font_dark}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/Profile")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 30,
                height: 30,
                borderRadius: 30 / 2,
                backgroundColor: hexToRgba(colors.bg_offwhite, 0.5),
              }}
            >
              <MaterialCommunityIcons
                name="account-circle-outline"
                size={20}
                color={colors.font_dark}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ width: 32 }} />
        )}
      </View>
    </SafeAreaView>
  );
}
