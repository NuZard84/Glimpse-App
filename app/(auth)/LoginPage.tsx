import { screenNames } from "@/constants/screenNames";
import { Link } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";

export default function LoginPage() {
  console.log(
    "login page",
    `/${screenNames.AUTH_STACK}/${screenNames.REGISTER}`
  );
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.bg_offwhite,
        paddingHorizontal: 16,
        paddingVertical: 22,
      }}
    >
      <Text>LoginPage</Text>
      <Link href="/(auth)/RegisterPage">Register</Link>
    </SafeAreaView>
  );
}
