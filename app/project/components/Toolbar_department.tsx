import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Toolbar() {
  return (
    <View style={styles.toolbar}>
      <Ionicons name="menu-outline" size={28} color="#fff" />
      <Text style={styles.appName}>Department Boss Assistant</Text>
      <TouchableOpacity onPress={() => router.push({ pathname: "/project/user" } as any)}>
        <Image source={require("../../../assets/user.png")} style={styles.profileImage} />
      </TouchableOpacity>
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
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  appName: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 25,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: "#fff",
    borderWidth: 1.5,
  },
});
