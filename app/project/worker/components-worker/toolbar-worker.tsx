import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BurgerMenu from "./BurgerMenu"; // importăm componenta globală

export default function Toolbar() {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ zIndex: 100 }}>
      {/* Toolbar */}
      <View style={styles.toolbar}>
        {/* Burger */}
        <TouchableOpacity onPress={() => setOpen(!open)}>
          <Ionicons name="menu-outline" size={32} color="#fff" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.appName}>Department Member Assistant</Text>

      </View>

      {/* Lateral Menu */}
      {open && <BurgerMenu closeMenu={() => setOpen(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: "#1b18b6",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 2 },
  },

  appName: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 20,
  },

  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderColor: "#fff",
    borderWidth: 1.5,
  },
});
