import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Toolbar() {
  return (
    <View style={styles.toolbarContainer}>
      <View style={styles.toolbar}>
        <TouchableOpacity>
          <Ionicons name="menu-outline" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.appName}>Project Manager</Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/project/manager/pages-manager/user-profile-manager",
            } as any)
          }
        >
          <Image
            source={require("../../../../assets/user.png")}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbarContainer: {
    backgroundColor: "#1a1f71",
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255,255,255,0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  appName: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
    letterSpacing: 0.5,
  },
  profileImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
  },
});
