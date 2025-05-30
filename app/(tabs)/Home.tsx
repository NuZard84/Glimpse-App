import BottomRowTools from "@/common/BottomRowTools";
import HeaderContainer from "@/common/layouts/HeaderContainer";
import { useAppColors } from "@/constants/Colors";
import { UserState } from "@/redux/reducers/userReducer";
import { Feather } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
  Asset,
  getAlbumsAsync,
  getAssetsAsync,
  getPermissionsAsync,
  usePermissions,
} from "expo-media-library";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Home() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    usePermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);

  const cameraRef = React.useRef<CameraView>(null);
  const isFocused = useIsFocused();

  const colors = useAppColors();
  const user = useSelector((state: { user: UserState }) => state.user);
  const username = user?.profile?.username || "User";

  useEffect(() => {
    handleContinue();
  }, []);

  useEffect(() => {
    if (isFocused) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      setIsCameraReady(false);
    }
  }, [isFocused]);

  const getAlbumsImages = async () => {
    try {
      const currentPermissions = await getPermissionsAsync();
      console.log("Current media permission status:", currentPermissions);

      if (!currentPermissions.granted) {
        console.log("Media library permission not granted");
        Alert.alert(
          "Permission Required",
          "Please grant media library access to view photos"
        );
        return;
      }

      const allAssets = await getAssetsAsync({
        first: 20,
        mediaType: "photo",
        sortBy: "creationTime",
      });

      console.log(
        `Found ${allAssets.totalCount} total photos, retrieved ${allAssets.assets.length}`
      );

      if (allAssets.assets.length > 0) {
        setAssets(allAssets.assets.slice(0, 4));
        console.log("Assets set:", allAssets.assets.slice(0, 4));
      } else {
        console.log("No photos found on device");

        const albums = await getAlbumsAsync();
        // console.log(
        //   "Available albums:",
        //   albums.map((a) => ({
        //     title: a.title,
        //     count: a.assetCount,
        //   }))
        // );
      }
    } catch (error) {
      console.error("Error getting media:", error);
      Alert.alert("Error", "Failed to load media from device");
    }
  };

  async function handleContinue() {
    const allPermissionsGranted = await requestAllPermissions();
    if (!allPermissionsGranted) {
      return;
    } else {
      getAlbumsImages();
    }
  }

  async function requestAllPermissions() {
    try {
      const cameraPermissionResult = await requestCameraPermission();
      const mediaLibraryPermissionResult =
        await requestMediaLibraryPermission();

      console.log("Camera permission:", cameraPermissionResult);
      console.log("Media library permission:", mediaLibraryPermissionResult);

      if (!cameraPermissionResult.granted) {
        Alert.alert("Error", "Camera permission is required to continue");
        return false;
      }
      if (!mediaLibraryPermissionResult.granted) {
        Alert.alert(
          "Error",
          "Media library permission is required to continue"
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error requesting permissions:", error);
      return false;
    }
  }

  const handleCameraReady = useCallback(() => {
    console.log("Camera is ready");
    setIsCameraReady(true);
  }, []);

  const handleCapture = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        // const photo = await cameraRef.current.takePictureAsync();
        console.log("Photo taken");
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    } else {
      console.log("Camera not ready");
    }
  };

  const handleZoomLevelChaange = () => {};

  const renderCamera = () => {
    if (!isFocused || !isVisible) {
      return (
        <View style={[styles.cameraContainer, styles.cameraPlaceholder]} />
      );
    }

    return (
      <View style={styles.cameraContainer}>
        <View style={styles.cameraWrapper}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            onCameraReady={handleCameraReady}
          />
          <BottomRowTools
            onImagePress={(img) => {
              console.log("Image pressed", img);
            }}
            onMediaLibraryPress={() => {
              console.log("Media library pressed");
            }}
            onCameraCapturePress={handleCapture}
            onZoomLevelChange={handleZoomLevelChaange}
            zoomLevel={1}
            images={assets}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            requestAllPermissions().then((granted) => {
              if (granted) {
                getAlbumsImages();
              }
            });
          }}
        >
          <Text style={{ color: colors.font_dark, marginTop: 10 }}>
            get albums
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <HeaderContainer
      isCenter={true}
      headerProps={{
        title: username,
        titleIcon: (
          <Feather
            name="user"
            size={17}
            style={{ marginBottom: 1.5 }}
            color={colors.font_dark}
          />
        ),
        showBackButton: false,
        showRightButtons: true,
      }}
    >
      <View style={styles.container}>{renderCamera()}</View>
    </HeaderContainer>
  );
}

// ... rest of your styles remain the same

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    // borderWidth: 1,
    // borderColor: "red",
    marginTop: 16,
  },
  cameraContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginTop: 30,
  },
  cameraPlaceholder: {
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 42,
    width: screenWidth * 0.84,
    height: screenHeight * 0.4,
  },
  cameraWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  camera: {
    elevation: 8,
    shadowColor: "rgba(255, 255, 255, 0.5)",
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
  },
});
