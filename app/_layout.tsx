import { screenNames } from "@/constants/screenNames";
import useSessionManager from "@/hooks/useSessionManager";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
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
  const { isInitialized, isNavigating } = useSessionManager();
  const [appReady, setAppReady] = useState(false);

  // Memoize auth state to avoid recalculations
  const authState = useMemo(
    () => ({
      isAuthenticated: !!user?.accessToken,
      isVerified: !!user?.isVarified,
      hasUsername: !!user?.profile?.username,
    }),
    [user?.accessToken, user?.isVarified, user?.profile?.username]
  );

  // Log only when auth state changes
  useEffect(() => {
    if (user) {
      console.log("Auth state updated:", authState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState]);

  useEffect(() => {
    async function prepare() {
      try {
        // Only hide splash screen and mark app as ready when both fonts are loaded
        // AND user state is initialized (which includes navigation setup)
        if ((fontsLoaded || error) && isInitialized) {
          console.log("Hiding splash screen");
          // Use a longer delay to ensure navigation is fully complete
          // This helps prevent the flickering issue during auth transitions
          await new Promise((resolve) => setTimeout(resolve, 800));
          await SplashScreen.hideAsync();
          setAppReady(true);
        }
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, [fontsLoaded, error, isInitialized]);

  // Show Slot during initial load with an activity indicator
  if (!appReady) {
    return (
      <>
        <Slot />
        {/* Only show loading indicator when navigating and fonts are loaded */}
        {isNavigating && fontsLoaded && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color={colors.font_brand} />
          </View>
        )}
      </>
    );
  }

  return (
    <SafeAreaProvider style={{ backgroundColor: colors.bg_offwhite }}>
      <View style={{ flex: 1, backgroundColor: colors.bg_offwhite }}>
        <StatusBar style={theme === "dark" ? "light" : "dark"} />
        <Stack
          screenOptions={{
            headerShown: true,
            contentStyle: { backgroundColor: colors.bg_offwhite },
            headerStyle: { backgroundColor: colors.bg_offwhite },
            animation: "fade",
            animationDuration: 300,
            presentation: "card",
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
      </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
});
