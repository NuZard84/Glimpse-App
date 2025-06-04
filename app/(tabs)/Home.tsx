import BottomRowTools from "@/common/BottomRowTools";
import HeaderContainer from "@/common/layouts/HeaderContainer";
import { useAppColors } from "@/constants/Colors";
import { UserState } from "@/redux/reducers/userReducer";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";

import {
  Asset,
  getAssetsAsync,
  getPermissionsAsync,
  MediaType,
  requestPermissionsAsync,
  usePermissions,
} from "expo-media-library";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
  const [zoom, setZoom] = useState(0);
  const [cameraType, setCameraType] = useState<CameraType>("back");
  const [isTorchOn, setIsTorchOn] = useState(false);
  const cameraRef = React.useRef<CameraView>(null);
  const lastTap = useRef<number | null>(null);
  const isFocused = useIsFocused();

  const colors = useAppColors();
  const user = useSelector((state: { user: UserState }) => state.user);
  const username = user?.profile?.username || "User";

  useEffect(() => {
    handleContinue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleTap = () => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < 300) {
      // Detected double tap
      setCameraType((prev) => (prev === "back" ? "front" : "back"));
    }
    lastTap.current = now;
  };

  const getAlbumsImages = async () => {
    try {
      const currentPermissions = await getPermissionsAsync();

      if (!currentPermissions.granted) {
        Alert.alert(
          "Permission Required",
          "Please grant media library access to view photos"
        );
        return;
      }

      const allAssets = await getAssetsAsync({
        first: 20,
        mediaType: [MediaType.photo],
        sortBy: "creationTime",
      });

      if (allAssets.assets.length > 0) {
        setAssets(allAssets.assets.slice(0, 10));
      }
    } catch (error) {
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
      const mediaLibraryPermissionResult = await requestPermissionsAsync(true);

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
      return false;
    }
  }

  const handleCameraReady = useCallback(() => {
    setIsCameraReady(true);
  }, []);

  const handleCapture = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        // const photo = await cameraRef.current.takePictureAsync();
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  };

  const handleZoomChange = (level: number) => {
    setZoom(level);
  };

  const handleImagePress = (image: Asset) => {
    // Handle image selection
  };

  const renderCamera = () => {
    if (!isFocused || !isVisible) {
      return (
        <View style={[styles.cameraContainer, styles.cameraPlaceholder]} />
      );
    }

    return (
      <View style={styles.cameraContainer}>
        <View style={[styles.cameraWrapper]}>
          <View
            style={{
              position: "relative",
            }}
          >
            <TouchableWithoutFeedback onPress={handleTap}>
              <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing={cameraType}
                zoom={zoom}
                onCameraReady={handleCameraReady}
                enableTorch={isTorchOn}
              />
            </TouchableWithoutFeedback>
            <TouchableOpacity
              onPress={() => {
                setIsTorchOn((prev) => !prev);
              }}
              style={{
                position: "absolute",
                bottom: screenHeight * 0.125,
                right: screenWidth * 0.05,
              }}
            >
              {!isTorchOn ? (
                <MaterialCommunityIcons
                  name="lightning-bolt"
                  size={28}
                  style={{
                    backgroundColor: colors.font_dark,
                    borderRadius: 100,
                    opacity: 0.65,
                    padding: 10,
                    transform: [{ rotate: "30deg" }],
                  }}
                  color={colors.bg_offwhite}
                />
              ) : (
                <MaterialCommunityIcons
                  name="lightning-bolt"
                  size={28}
                  style={{
                    backgroundColor: colors.font_dark,
                    borderRadius: 100,
                    opacity: 1,
                    padding: 10,
                    transform: [{ rotate: "30deg" }],
                  }}
                  color={colors.bg_offwhite}
                />
              )}
            </TouchableOpacity>
          </View>
          <BottomRowTools
            onImagePress={handleImagePress}
            onMediaLibraryPress={getAlbumsImages}
            onCameraCapturePress={handleCapture}
            onZoomLevelChange={handleZoomChange}
            zoomLevel={zoom}
            images={assets}
          />
        </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
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
