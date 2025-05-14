import PageContainer from "@/common/PageContainer";
import { Text, View } from "react-native";

export default function RegisterPage() {
  return (
    <PageContainer>
      <View
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          borderWidth: 1,
          justifyContent: "center",
        }}
      >
        <Text>hello</Text>
      </View>
    </PageContainer>
  );
}
