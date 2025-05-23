import HeaderPageContainer from "@/common/HeaderPageContainer";
import { useAppColors } from "@/constants/Colors";
import { typography } from "@/constants/styles";
import { UserState } from "@/redux/reducers/userReducer";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";

export default function Home() {
  const colors = useAppColors();
  const user = useSelector((state: { user: UserState }) => state.user);

  return (
    <HeaderPageContainer
      isCenter={true}
      hasHeader={true}
      isScrollable={false}
      withPadding={false}
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
          Hello, {user?.profile.username}
        </Text>
      </View>
    </HeaderPageContainer>
  );
}
