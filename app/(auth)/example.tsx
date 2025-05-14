import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useAppColors } from "@/constants/Colors";
import { typography } from "../../constants/styles";

export default function Example() {
  const colors = useAppColors();

  const dynamicStyles = {
    container: {
      backgroundColor: colors.bg_offwhite,
    },
    card: {
      backgroundColor: colors.bg_offwhite,
      shadowColor: colors.font_dark,
    },
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Typography Examples */}
      <View style={styles.section}>
        <Text style={[typography.h1, { color: colors.font_dark }]}>
          Heading 1
        </Text>
        <Text style={[typography.h2, { color: colors.font_brand }]}>
          Heading 2
        </Text>
        <Text style={[typography.h3, { color: colors.font_dark }]}>
          Heading 3
        </Text>
        <Text style={[typography.body, { color: colors.font_dark }]}>
          Body text example
        </Text>
        <Text style={[typography.bodySm, { color: colors.font_dark }]}>
          Small body text
        </Text>
        <Text style={[typography.button, { color: colors.font_brand }]}>
          Button Text
        </Text>
        <Text style={[typography.bodyXs, { color: colors.font_dark }]}>
          Extra small body text
        </Text>
      </View>

      {/* Color Examples */}
      <View style={styles.section}>
        <View style={styles.colorRow}>
          <View
            style={[styles.colorBox, { backgroundColor: colors.bg_offwhite }]}
          />
          <Text style={typography.bodySm}>
            bg_offwhite: {colors.bg_offwhite}
          </Text>
        </View>
        <View style={styles.colorRow}>
          <View
            style={[styles.colorBox, { backgroundColor: colors.bg_gray }]}
          />
          <Text style={typography.bodySm}>bg_gray: {colors.bg_gray}</Text>
        </View>
        <View style={styles.colorRow}>
          <View
            style={[
              styles.colorBox,
              { backgroundColor: colors.bg_light_brand },
            ]}
          />
          <Text style={typography.bodySm}>
            bg_light_brand: {colors.bg_light_brand}
          </Text>
        </View>
        <View style={styles.colorRow}>
          <View
            style={[styles.colorBox, { backgroundColor: colors.font_dark }]}
          />
          <Text style={typography.bodySm}>font_dark: {colors.font_dark}</Text>
        </View>
        <View style={styles.colorRow}>
          <View
            style={[styles.colorBox, { backgroundColor: colors.font_brand }]}
          />
          <Text style={typography.bodySm}>font_brand: {colors.font_brand}</Text>
        </View>
      </View>

      {/* Combined Style Examples */}
      <View
        style={[styles.section, { backgroundColor: colors.bg_light_brand }]}
      >
        <Text style={[typography.h2, { color: colors.font_brand }]}>
          Styled Component Example
        </Text>
        <View style={[styles.card, dynamicStyles.card]}>
          <Text style={[typography.body, { color: colors.font_dark }]}>
            This card combines multiple styles
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
  },
  colorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  colorBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
