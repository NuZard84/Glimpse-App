import ButtonComponent from "@/common/ButtonComponent";
import { useAppColors } from "@/constants/Colors";
import { logout } from "@/redux/actions/userActions";
import { UserState } from "@/redux/reducers/userReducer";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const dispatch = useDispatch();
  const colors = useAppColors();
  const user = useSelector((state: { user: UserState }) => state.user);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.bg_offwhite }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.font_dark }]}>Home</Text>
        <Text
          style={[
            styles.subtitle,
            { color: colors.font_dark, marginBottom: 20 },
          ]}
        >
          Welcome to Glimpse! {user.profile.username}
        </Text>
        <ButtonComponent
          text="Logout"
          onPress={() => {
            dispatch(logout());
          }}
          textColor={colors.font_error}
          bgColor={colors.bg_error}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
});
