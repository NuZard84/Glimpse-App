import PageContainer from "@/common/PageContainer";
import { useAppColors } from "@/constants/Colors";
import { typography } from "@/constants/styles";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Animated, { FadeInDown } from "react-native-reanimated";

// Define types for menu items
type MenuItem = {
  id: string;
  title: string;
  icon: string;
};

// Menu items for the General section
const generalMenuItems: MenuItem[] = [
  { id: "1", title: "edit Avatar", icon: "user-circle" },
  { id: "2", title: "edit username", icon: "user-edit" },
  { id: "3", title: "edit phone number", icon: "phone" },
  { id: "4", title: "edit email", icon: "envelope" },
  { id: "5", title: "edit date of birth", icon: "birthday-cake" },
  { id: "6", title: "reset password", icon: "key" },
  { id: "7", title: "set up widget", icon: "th" },
];

// Menu items for the About us section
const aboutMenuItems: MenuItem[] = [
  { id: "1", title: "Instagram", icon: "instagram" },
  { id: "2", title: "Twitter", icon: "twitter" },
  { id: "3", title: "TikTok", icon: "tiktok" },
  { id: "4", title: "Share app", icon: "share-alt" },
  { id: "5", title: "Rate app", icon: "star" },
  { id: "6", title: "Terms of Services", icon: "file-alt" },
  { id: "7", title: "Privacy policy", icon: "shield-alt" },
];

//Accounts Menu Items
const accountsMenuItems: MenuItem[] = [
  { id: "1", title: "Delete Account", icon: "trash" }, // Changed from "delete-empty"
  { id: "2", title: "Sign out", icon: "sign-out-alt" }, // Changed from "logout"
];
// Define types for component props
type MenuItemProps = {
  item: MenuItem;
  index: number;
  colors: any;
};

// Menu Item Component
const MenuItem = ({ item, index, colors }: MenuItemProps) => {
  return (
    <TouchableOpacity onPress={() => {}}>
      <Animated.View
        entering={FadeInDown.delay(100 * index).springify()}
        style={styles.menuItem}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor:
                item.icon === "trash" ? colors.bg_error : colors.bg_light_brand,
            },
          ]}
        >
          {item.icon === "trash" ? (
            <FontAwesome5
              name={item.icon}
              size={18}
              color={colors.font_error}
            />
          ) : (
            <FontAwesome5
              name={item.icon}
              size={18}
              color={colors.font_brand}
            />
          )}
        </View>
        <Text style={[typography.body, { color: colors.font_dark, flex: 1 }]}>
          {item.title}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

type MenuSectionProps = {
  title: string;
  items: MenuItem[];
  colors: any;
};

// Menu Section Component
const MenuSection = ({ title, items, colors }: MenuSectionProps) => {
  return (
    <View style={styles.sectionContainer}>
      <Animated.Text
        entering={FadeInDown.springify()}
        style={[
          typography.h2,
          styles.sectionTitle,
          { color: colors.font_dark },
        ]}
      >
        {title}
      </Animated.Text>
      <View
        style={[
          styles.menuContainer,
          { backgroundColor: colors.bg_gray, elevation: 4 },
        ]}
      >
        {items.map((item, index) => (
          <MenuItem key={item.id} item={item} index={index} colors={colors} />
        ))}
      </View>
    </View>
  );
};

export default function Profile() {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const statusBarHeight = StatusBar.currentHeight || 0;

  // Calculate header height based on platform and insets
  const headerHeight =
    Platform.OS === "ios"
      ? insets.top + 70 // Increased for iOS to account for the header
      : statusBarHeight + 60;

  return (
    <PageContainer
      isCenter={false}
      edges={["right", "bottom", "left"]} // Exclude top edge as it's handled by the header
      withPadding={false}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: headerHeight,
          paddingHorizontal: 16,
          paddingBottom: 40, // Add bottom padding for better scrolling experience
        }}
        style={styles.container}
      >
        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <Animated.View
            entering={FadeInDown.springify()}
            style={styles.avatarContainer}
          >
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.avatar}
            />
          </Animated.View>
          <Animated.Text
            entering={FadeInDown.delay(100).springify()}
            style={[typography.h1, { color: colors.font_dark, marginTop: 12 }]}
          >
            Nishchit Malasana
          </Animated.Text>
          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            style={[
              styles.friendsContainer,
              { backgroundColor: colors.bg_gray },
            ]}
          >
            <FontAwesome5
              name="user-friends"
              size={16}
              color={colors.font_dark}
            />
            <Text style={[typography.bodySm, { color: colors.font_dark }]}>
              friends 18
            </Text>
          </Animated.View>
        </View>

        {/* General Menu */}
        <MenuSection title="General" items={generalMenuItems} colors={colors} />

        {/* About us Menu */}
        <MenuSection title="About us" items={aboutMenuItems} colors={colors} />

        {/* Accounts Menu */}
        <MenuSection
          title="Accounts"
          items={accountsMenuItems}
          colors={colors}
        />

        {/* Spacing at the bottom */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    position: "relative",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  placeholder: {
    width: 40,
  },
  profileInfo: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  friendsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  menuContainer: {
    borderRadius: 24,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
});
