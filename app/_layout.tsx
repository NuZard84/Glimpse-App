import { screenNames } from "@/constants/screenNames";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFontLoader } from "../utils/fonts";

// Keep the splash screen visible while fonts are loading
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { fontsLoaded, error } = useFontLoader();

  useEffect(() => {
    if (fontsLoaded || error) {
      // Hide the splash screen after fonts have loaded or if there's an error
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  // Don't render the app until fonts are loaded
  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: true,
          contentStyle: { backgroundColor: "white" },
          headerStyle: {
            backgroundColor: "white",
          },
        }}
      >
        <Stack.Screen
          name={screenNames.AUTH_STACK}
          options={{ headerShown: false }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
