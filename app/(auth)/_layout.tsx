import { screenNames } from "@/constants/screenNames";
import { useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function AuthLayout() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg_offwhite }}>
      <Stack
        initialRouteName={screenNames.WELCOME}
        screenOptions={{
          contentStyle: { backgroundColor: colors.bg_offwhite },
          headerStyle: { backgroundColor: colors.bg_offwhite },
          animation: "fade_from_bottom",
          animationDuration: 300,
          presentation: "transparentModal",
          headerShown: false,
        }}
      >
        <Stack.Screen name={screenNames.WELCOME} />
        <Stack.Screen name={screenNames.REGISTER} />
        <Stack.Screen name={screenNames.LOGIN} />
        <Stack.Screen name={screenNames.VERIFY} />
        <Stack.Screen name={screenNames.FORGOT_PASSWORD} />
        <Stack.Screen name={screenNames.GET_USERNAME} />
      </Stack>
    </View>
  );
}
