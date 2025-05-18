import { screenNames } from "@/constants/screenNames";
import { Stack } from "expo-router";

export default function TabsLayout() {
  return (
    <Stack initialRouteName={screenNames.HOME}>
      <Stack.Screen name={screenNames.HOME} options={{ headerShown: false }} />
    </Stack>
  );
}
