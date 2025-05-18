import { useAppColors } from "@/constants/Colors";
import useSessionManager from "@/hooks/useSessionManager";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Index() {
  const colors = useAppColors();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isNavigating } = useSessionManager();

  // Simple loading screen while navigation is being handled by the session manager
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color={colors.font_brand}
        animating={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});
