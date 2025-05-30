import { useAppColors } from "@/constants/Colors";
import { typography } from "@/constants/styles";
import { hexToRgba } from "@/utils/hex-to-rgba";
import { Asset } from "expo-media-library";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import IconButton from "./IconButton.";

type BottomRowToolsProps = {
  onImagePress: (image: string) => void;
  onMediaLibraryPress: () => void;
  onCameraCapturePress: () => void;
  onZoomLevelChange: (level: number) => void;
  images: Asset[];
  zoomLevel: number;
};

export default function BottomRowTools({
  onImagePress,
  onMediaLibraryPress,
  onZoomLevelChange,
  zoomLevel,
  onCameraCapturePress,
  images,
}: BottomRowToolsProps) {
  const colors = useAppColors();
  const [imgArr, setImgArr] = useState<Asset[]>(images);
  const [dummyArr, setDummyArr] = useState<string[]>([
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
  ]);

  useEffect(() => {
    if (images && images.length > 0) {
      setImgArr(images);
    } else return;
  }, [images]);

  console.log("imgArr", imgArr);
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
        width: "100%",
        gap: 16,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          width: "auto",
          backgroundColor: hexToRgba(colors.font_dark, 0.5),
          borderRadius: 36,
          paddingHorizontal: 8,
          paddingVertical: 4,
        }}
      >
        {[0.5, 1, 2].map((item, i) => (
          <TouchableOpacity
            onPress={() => onZoomLevelChange(item)}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                zoomLevel === item
                  ? hexToRgba(colors.bg_offwhite, 1)
                  : hexToRgba(colors.bg_offwhite, 0.5),
              borderRadius: 18,
              height: 24,
              width: 24,
              marginRight: item === 2 ? 0 : 6,
            }}
            key={i}
          >
            <Text
              style={[
                typography.bodyXs,
                {
                  color: colors.font_dark,
                },
              ]}
            >
              {item === 0.5 ? ".5" : item}x
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: "42%",
        }}
        style={{
          width: "100%",
        }}
      >
        {dummyArr.map((item, i) => {
          return (
            <TouchableOpacity
              onPress={() => onImagePress(item)}
              key={i}
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: "transparent",
                borderWidth: 2,
                borderColor: colors.font_dark,
                marginRight: 10,
              }}
            >
              <Image
                source={require("../assets/images/logo.png")}
                style={{ width: 55, height: 55 }}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <IconButton
          containerStyle={{
            position: "absolute",
            transform: [{ translateX: -80 }, { translateY: 0 }],
          }}
          androidName="images"
          iosName="photo.stack.fill"
          onPress={() => onMediaLibraryPress()}
        />
        <TouchableOpacity
          onPress={() => onCameraCapturePress()}
          style={{
            width: 70,
            height: 70,
            backgroundColor: colors.font_dark,
            borderRadius: 35,
            display: "flex",
            borderWidth: 4,
            borderColor: colors.icon_brand,
          }}
        />
      </View>
    </View>
  );
}
