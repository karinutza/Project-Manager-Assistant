import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type BurgerMenuProps = {
  closeMenu?: () => void; // <-- adăugăm prop-ul
};

export default function BurgerMenu({ closeMenu }: BurgerMenuProps) {
  const handleNavigation = (path: Parameters<typeof router.push>[0]) => {
    router.push(path);
    if (closeMenu) closeMenu(); // închidem meniul după navigare
  };

  return (
    <View style={styles.menu}>
      <TouchableOpacity onPress={() => handleNavigation("/project/worker/pages-worker/user-profile-worker")}>
        <Text style={styles.menuItem}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleNavigation("./community-hub-worker")}>
        <Text style={styles.menuItem}>Community</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleNavigation("/project/worker/pages-worker/settings-page-worker")}>
        <Text style={styles.menuItem}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleNavigation("/project/worker/pages-worker/assistant-page-worker")}>
        <Text style={styles.menuItem}>Chat-Bot</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleNavigation("/")}>
        <Text style={[styles.menuItem, { color: "red" }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: "absolute",
    left: 18,
    top: 72,
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 6,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    zIndex: 200,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#1E293B",
  },
});