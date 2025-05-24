import HeaderContainer from "@/common/layouts/HeaderContainer";
import { useAppColors } from "@/constants/Colors";
import { typography } from "@/constants/styles";
import { UserState } from "@/redux/reducers/userReducer";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";

export default function Home() {
  const colors = useAppColors();
  const user = useSelector((state: { user: UserState }) => state.user);
  const username = user?.profile?.username || "User";

  return (
    <HeaderContainer
      isCenter={true}
      headerProps={{
        title: username,
        showBackButton: false,
        showRightButtons: true,
      }}
    >
      <View>
        <Text
          style={[
            {
              color: colors.font_dark,
            },
            typography.body,
          ]}
        >
          Hello, {username}
        </Text>
      </View>
    </HeaderContainer>
  );
}
