export default {
  expo: {
    name: "Glimpse",
    slug: "Glimpse-App",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "GlimpseApp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.glimpse.app",
      infoPlist: {
        NSPhotoLibraryUsageDescription:
          "Allow Glimpse to access your photo library.",
        NSCameraUsageDescription: "Allow Glimpse to access your camera.",
        NSMicrophoneUsageDescription: "Allow Glimpse to use your microphone.",
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: "com.glimpse.app",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      permissions: [
        "android.permission.CAMERA",
        "android.permission.READ_MEDIA_IMAGES",
        "android.permission.READ_MEDIA_VIDEO",
        "android.permission.RECORD_AUDIO",
        "android.permission.ACCESS_MEDIA_LOCATION",
      ],
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-video",
      "expo-web-browser",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "expo-media-library",
        {
          photosPermission: "Allow $(PRODUCT_NAME) to access your photos.",
          savePhotosPermission: "Allow $(PRODUCT_NAME) to save photos.",
          isAccessMediaLocationEnabled: true,
          // Add this for Android 13+ compatibility
          androidPermissions: ["READ_MEDIA_IMAGES", "READ_MEDIA_VIDEO"],
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      apiUrl: process.env.API_URL,
      eas: {
        projectId: "37d7edcf-4fac-45fc-95ad-23ec6e76c69f",
      },
    },
  },
};
