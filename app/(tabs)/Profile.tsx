import HeaderContainer from "@/common/layouts/HeaderContainer";
import { useAppColors } from "@/constants/Colors";
import { typography } from "@/constants/styles";
import { logout } from "@/redux/actions/userActions";
import { UserState } from "@/redux/reducers/userReducer";
import { store } from "@/redux/store";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSelector } from "react-redux";
import AlertModal, { AlertType } from "../../common/modals/AlertModal";
import BottomUpModal, {
  BottomModalType,
} from "../../common/modals/BottomUpModal";

// Define types for menu items
type MenuItem = {
  id: string;
  title: string;
  icon: string;
  onPress?: () => void;
};

// Define types for component props
type MenuItemProps = {
  item: MenuItem;
  index: number;
  colors: any;
};

type MenuSectionProps = {
  title: string;
  items: MenuItem[];
  colors: any;
};

// Menu Item Component
const MenuItem = ({ item, index, colors }: MenuItemProps) => {
  return (
    <TouchableOpacity onPress={item.onPress || (() => {})}>
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
              color={colors.icon_brand}
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
  const user = useSelector((state: { user: UserState }) => state.user);
  const colors = useAppColors();

  // Modal states
  const [alertModal, setAlertModal] = useState({
    visible: false,
    type: "info" as AlertType,
    title: "",
    message: "",
    primaryButtonText: "OK",
    secondaryButtonText: "",
    onPrimaryPress: () => {},
    onSecondaryPress: () => {},
  });

  const [bottomModal, setBottomModal] = useState({
    visible: false,
    type: "input" as BottomModalType,
    title: "",
    placeholder: "",
    value: "",
    primaryButtonText: "continue",
    secondaryButtonText: "cancel",
    onPrimaryPress: () => {},
    needPass: false,
    onPasswordVerify: undefined as
      | ((password: string) => Promise<boolean>)
      | undefined,
  });

  const [inputValue, setInputValue] = useState("");

  // Modal handlers
  const showAlertModal = (config: Partial<typeof alertModal>) => {
    setAlertModal((prev) => ({ ...prev, ...config, visible: true }));
  };

  const hideAlertModal = () => {
    setAlertModal((prev) => ({ ...prev, visible: false }));
  };

  const showBottomModal = (config: Partial<typeof bottomModal>) => {
    setBottomModal((prev) => ({ ...prev, ...config, visible: true }));
  };

  const hideBottomModal = () => {
    setBottomModal((prev) => ({ ...prev, visible: false }));
    setInputValue("");
  };

  const handleSignOut = () => {
    showAlertModal({
      type: "error",
      title: "Sign Out",
      message: "Are you sure you want to sign out?",
      primaryButtonText: "Sign Out",
      secondaryButtonText: "Cancel",
      onPrimaryPress: () => {
        store.dispatch(logout());
        hideAlertModal();
      },
      onSecondaryPress: hideAlertModal,
    });
  };

  // Mock password verification function - replace with actual implementation
  const verifyPassword = async (password: string): Promise<boolean> => {
    // In a real app, you would verify the password against the backend
    // For demo purposes, any password with length >= 4 is "valid"
    return password.length >= 4;
  };

  const handleDeleteAccount = () => {
    showBottomModal({
      type: "input",
      title: "verify it's you",
      placeholder: "enter your password",
      needPass: true,
      primaryButtonText: "verify",
      onPrimaryPress: () => {
        // Password verification successful, now show the confirmation alert
        hideBottomModal();
        showAlertModal({
          type: "error",
          title: "wanna delete your account",
          message: "we wont be able to recovery once account is deleted.",
          primaryButtonText: "delete",
          secondaryButtonText: "cancel",
          onPrimaryPress: () => {
            console.log("Account deleted");
            hideAlertModal();
          },
          onSecondaryPress: hideAlertModal,
        });
      },
      onPasswordVerify: verifyPassword,
    });
  };

  const handleEditAvatar = () => {
    showBottomModal({
      type: "avatar",
      title: "Select Avatar",
      primaryButtonText: "continue",

      onPrimaryPress: () => {
        console.log("Avatar updated");
        hideBottomModal();
      },
    });
  };

  const handleEditUsername = () => {
    showBottomModal({
      type: "input",
      title: "update username",
      placeholder: "username",
      value: inputValue,
      primaryButtonText: "continue",
      onPrimaryPress: () => {
        console.log("Username updated:", inputValue);
        hideBottomModal();
      },
    });
  };

  const handleEditPhone = () => {
    showBottomModal({
      type: "input",
      title: "update phone number",
      placeholder: "phone number",
      value: inputValue,
      primaryButtonText: "continue",
      onPrimaryPress: () => {
        console.log("Phone updated:", inputValue);
        hideBottomModal();
      },
    });
  };

  const handleEditEmail = () => {
    showBottomModal({
      type: "input",
      title: "update email",
      placeholder: "email address",
      value: inputValue,
      primaryButtonText: "continue",
      onPrimaryPress: () => {
        console.log("Email updated:", inputValue);
        hideBottomModal();
      },
    });
  };

  const handleEditDateOfBirth = () => {
    showBottomModal({
      type: "input",
      title: "update date of birth",
      placeholder: "DD/MM/YYYY",
      value: inputValue,
      primaryButtonText: "continue",
      onPrimaryPress: () => {
        console.log("Date of birth updated:", inputValue);
        hideBottomModal();
      },
    });
  };

  const handleResetPassword = () => {
    showBottomModal({
      type: "input",
      title: "reset password",
      placeholder: "new password",
      value: inputValue,
      primaryButtonText: "continue",
      onPrimaryPress: () => {
        console.log("Password reset:", inputValue);
        hideBottomModal();
      },
    });
  };

  // Menu items for the General section
  const generalMenuItems: MenuItem[] = [
    {
      id: "1",
      title: "edit Avatar",
      icon: "user-circle",
      onPress: handleEditAvatar,
    },
    {
      id: "2",
      title: "edit username",
      icon: "user-edit",
      onPress: handleEditUsername,
    },
    {
      id: "3",
      title: "edit phone number",
      icon: "phone",
      onPress: handleEditPhone,
    },
    {
      id: "4",
      title: "edit email",
      icon: "envelope",
      onPress: handleEditEmail,
    },
    {
      id: "5",
      title: "edit date of birth",
      icon: "birthday-cake",
      onPress: handleEditDateOfBirth,
    },
    {
      id: "6",
      title: "reset password",
      icon: "key",
      onPress: handleResetPassword,
    },
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

  // Accounts Menu Items
  const accountsMenuItems: MenuItem[] = [
    {
      id: "1",
      title: "Delete Account",
      icon: "trash",
      onPress: handleDeleteAccount,
    },
    {
      id: "2",
      title: "Sign out",
      icon: "sign-out-alt",
      onPress: handleSignOut,
    },
  ];

  return (
    <>
      <HeaderContainer
        isScrollable={true}
        withPadding={true}
        headerProps={{
          title: "Profile",
          showBackButton: true,
          showRightButtons: false,
          titleIcon: (
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={20}
              color={colors.font_dark}
            />
          ),
        }}
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
            {user?.profile?.username}
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
              color={colors.font_brand}
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

        <View style={{ height: 40 }} />
      </HeaderContainer>

      <AlertModal
        visible={alertModal.visible}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        primaryButtonText={alertModal.primaryButtonText}
        secondaryButtonText={alertModal.secondaryButtonText}
        onPrimaryPress={alertModal.onPrimaryPress}
        onSecondaryPress={alertModal.onSecondaryPress}
        onClose={hideAlertModal}
      />

      <BottomUpModal
        visible={bottomModal.visible}
        type={bottomModal.type}
        title={bottomModal.title}
        placeholder={bottomModal.placeholder}
        value={inputValue}
        onChangeText={setInputValue}
        primaryButtonText={bottomModal.primaryButtonText}
        secondaryButtonText={bottomModal.secondaryButtonText}
        onPrimaryPress={bottomModal.onPrimaryPress}
        onSecondaryPress={hideBottomModal}
        onClose={hideBottomModal}
        needPass={bottomModal.needPass}
        onPasswordVerify={bottomModal.needPass ? verifyPassword : undefined}
      />
    </>
  );
}

const styles = StyleSheet.create({
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
