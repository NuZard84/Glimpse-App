import { colors } from "@/constants/Colors";
import { typography } from "@/constants/styles";
import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Common country codes with flags
const countries = [
  { code: "+1", flag: "🇺🇸", name: "United States" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+86", flag: "🇨🇳", name: "China" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "+7", flag: "🇷🇺", name: "Russia" },
  { code: "+55", flag: "🇧🇷", name: "Brazil" },
  { code: "+234", flag: "🇳🇬", name: "Nigeria" },
  { code: "+27", flag: "🇿🇦", name: "South Africa" },
  { code: "+82", flag: "🇰🇷", name: "South Korea" },
  { code: "+39", flag: "🇮🇹", name: "Italy" },
  { code: "+52", flag: "🇲🇽", name: "Mexico" },
];

interface CountryCodeSelectorProps {
  phoneNumber: string;
  setPhoneNumber: (text: string) => void;
  placeholder?: string;
}

export default function CountryCodeSelector({
  phoneNumber,
  setPhoneNumber,
  placeholder = "Phone number",
}: CountryCodeSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCountries = searchQuery
    ? countries.filter(
        (country) =>
          country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          country.code.includes(searchQuery)
      )
    : countries;

  const selectCountry = (country: (typeof countries)[0]) => {
    setSelectedCountry(country);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.codeSelector}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.flagText}>{selectedCountry.flag}</Text>
        <Text style={styles.codeText}>{selectedCountry.code}</Text>
        <Entypo name="chevron-down" size={16} color={colors.font_dark} />
      </TouchableOpacity>

      <TextInput
        style={styles.phoneInput}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder={placeholder}
        placeholderTextColor={colors.font_placeholder}
        keyboardType="phone-pad"
        cursorColor={colors.font_brand}
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={typography.h2}>Select Country</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Entypo name="cross" size={24} color={colors.font_dark} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search country..."
              placeholderTextColor={colors.font_placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
              cursorColor={colors.font_brand}
            />

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => selectCountry(item)}
                >
                  <Text style={styles.flagText}>{item.flag}</Text>
                  <Text style={styles.countryName}>{item.name}</Text>
                  <Text style={styles.countryCode}>{item.code}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: colors.bg_gray,
    borderRadius: 16,
    overflow: "hidden",
  },
  codeSelector: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRightWidth: 1,
    borderRightColor: "#0000001A",
  },
  flagText: {
    fontSize: 14,
    marginRight: 6,
    fontFamily: "CalSans",
  },
  codeText: {
    fontSize: 14,
    color: colors.font_dark,
    marginRight: 4,
    fontFamily: "CalSans",
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    color: colors.font_dark,
    fontFamily: "CalSans",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    height: "70%",
    backgroundColor: colors.bg_offwhite,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: colors.bg_gray,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    color: colors.font_dark,
    fontFamily: "CalSans",
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#0000001A",
  },
  countryName: {
    ...typography.body,
    flex: 1,
    marginLeft: 10,
    color: colors.font_dark,
    fontFamily: "CalSans",
  },
  countryCode: {
    fontSize: 14,
    color: colors.font_dark,
    fontFamily: "CalSans",
  },
});
