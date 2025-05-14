import { screenNames } from "@/constants/screenNames";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack initialRouteName={screenNames.WELCOME}>
      <Stack.Screen
        name={screenNames.WELCOME}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={screenNames.REGISTER}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={screenNames.LOGIN} options={{ headerShown: false }} />
    </Stack>
  );
}
