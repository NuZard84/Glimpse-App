import CommonHeader from "@/common/layouts/CommonHeader";
import { screenNames } from "@/constants/screenNames";
import { useTheme } from "@/context/ThemeContext";
import { UserState } from "@/redux/reducers/userReducer";
import { Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

export default function TabsLayout() {
  const user = useSelector((state: { user: UserState }) => state?.user);
  const { colors } = useTheme();

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: colors.bg_offwhite }}>
        <Stack
          initialRouteName={screenNames.HOME}
          screenOptions={{
            contentStyle: { backgroundColor: colors.bg_offwhite },
            animation: "fade",
            animationDuration: 300,

            headerShown: false,
          }}
        >
          <Stack.Screen
            name={screenNames.HOME}
            options={{
              header: () => (
                <CommonHeader
                  title={user?.profile?.username || "User"}
                  isBackButton={false}
                  blurred={true}
                />
              ),
              headerShown: true,
            }}
          />

          <Stack.Screen
            name={screenNames.PROFILE}
            options={{
              header: () => (
                <CommonHeader
                  title="Profile"
                  isRightButton={false}
                  blurred={true}
                />
              ),
              headerShown: true,
            }}
          />
        </Stack>
      </View>
    </SafeAreaProvider>
  );
}
