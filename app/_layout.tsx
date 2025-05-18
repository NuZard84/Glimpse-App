import { screenNames } from "@/constants/screenNames";
import useSessionManager from "@/hooks/useSessionManager";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useSelector } from "react-redux";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { store } from "../redux/store";
import { useFontLoader } from "../utils/fonts";
// Keep the splash screen visible while fonts are loading
SplashScreen.preventAutoHideAsync();

function AppLayout() {
  const user = useSelector((state: any) => state.user);
  const { fontsLoaded, error } = useFontLoader();
  const { theme, colors } = useTheme();

  // Use session manager for handling navigation
  useSessionManager();

  useEffect(() => {
    if (fontsLoaded || error) {
      // Hide the splash screen after fonts have loaded or if there's an error
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  console.log("user", user);

  return (
    <SafeAreaProvider>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: true,
          contentStyle: { backgroundColor: colors.bg_offwhite },
          headerStyle: {
            backgroundColor: colors.bg_offwhite,
          },
          headerTintColor: colors.font_dark,
        }}
      >
        <Stack.Screen
          name={screenNames.AUTH_STACK}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={screenNames.TABS_STACK}
          options={{ headerShown: false }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppLayout />
      </ThemeProvider>
    </Provider>
  );
}
