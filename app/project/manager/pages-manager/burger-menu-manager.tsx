import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type BurgerMenuProps = {
  closeMenu?: () => void;
};

export default function BurgerMenu({ closeMenu }: BurgerMenuProps) {
  const handleNavigation = (path: Parameters<typeof router.push>[0]) => {
    router.push(path);
    closeMenu?.();
  };

  return (
    <View style={styles.menuWrapper}>
      <View style={styles.menuCard}>
        <MenuItem
          icon="person-circle-outline"
          label="Profile"
          onPress={() =>
            handleNavigation("/project/manager/pages-manager/user-profile-manager")
          }
        />

        <MenuItem
          icon="people-outline"
          label="Community"
          onPress={() => handleNavigation("./community-hub-manager")}
        />

        <View style={styles.separator} />

        <MenuItem
          icon="log-out-outline"
          label="Logout"
          labelColor="#E53935"
          onPress={() => handleNavigation("/")}
        />
      </View>
    </View>
  );
}

// Componentă mică pentru item, doar ca să fie mai curat
function MenuItem({
  icon,
  label,
  labelColor = "#1E293B",
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  labelColor?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.itemRow} onPress={onPress}>
      <Ionicons name={icon} size={18} color={labelColor} />
      <Text style={[styles.itemText, { color: labelColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menuWrapper: {
    position: "absolute",
    top: 60,         // mai aproape de toolbar
    left: 12,
    zIndex: 999,
  },

  menuCard: {
    width: 160,      // redus de la 220
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 8,
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,     // redus de la 12
    paddingHorizontal: 10,
  },

  itemText: {
    fontSize: 15,     // în loc de 17
    marginLeft: 10,
    fontWeight: "500",
  },

  separator: {
    height: 1,
    backgroundColor: "#E2E8F0",
    width: "90%",
    alignSelf: "center",
    marginVertical: 4,
  },
});