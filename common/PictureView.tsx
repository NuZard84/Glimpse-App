import { Dimensions, Image, View } from "react-native";

interface PictureViewProps {
  picture: string | null;
  setPicture: React.Dispatch<React.SetStateAction<string | null>>;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
export default function PictureView({ picture, setPicture }: PictureViewProps) {
  return (
    <View
      style={{
        elevation: 8,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        width: screenWidth * 0.84,
        height: screenHeight * 0.4,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 42,
        marginBottom: 84,
      }}
    >
      <Image
        source={{ uri: picture }}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: 42,
        }}
      />
    </View>
  );
}
