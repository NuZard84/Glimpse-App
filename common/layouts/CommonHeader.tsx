import { useAppColors } from "@/constants/Colors";
import { typography } from "@/constants/styles";
import { hexToRgba } from "@/utils/hex-to-rgba";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type CommonHeaderProps = {
  title: string;
  isBackButton?: boolean;
  isRightButton?: boolean;
};

export default function CommonHeader({
  title,
  isBackButton = true,
  isRightButton = true,
}: CommonHeaderProps) {
  const colors = useAppColors();

  return (
    <SafeAreaView
      style={{
        backgroundColor: hexToRgba(colors.font_dark, 0.1),
        marginBottom: 16,
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
            <Entypo
              name="chevron-small-left"
              size={24}
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
          }}
        >
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
              <Ionicons
                name="person-add-outline"
                size={14}
                color={colors.font_dark}
              />
            </TouchableOpacity>
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
              <MaterialCommunityIcons
                name="face-man-profile"
                size={20}
                color={colors.font_dark}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ width: 64 }} />
        )}
      </View>
    </SafeAreaView>
  );
}
