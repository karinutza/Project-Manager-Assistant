import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ToolbarWorker from "../components-worker/toolbar-worker";

export default function CommunityHub() {
  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <ToolbarWorker />

      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#3B82F6" }]}
          onPress={() => router.push("./community-page-worker")}
        >
          <Text style={styles.buttonEmoji}>🎯</Text>
          <Text style={styles.buttonText}>Activities</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#10B981" }]}
          onPress={() => router.push("./birthdays-page-worker")}
        >
          <Text style={styles.buttonEmoji}>🎂</Text>
          <Text style={styles.buttonText}>Birthdays</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#F59E0B" }]}
          onPress={() => router.push("./company-awards-page-worker")}
        >
          <Text style={styles.buttonEmoji}>🏆</Text>
          <Text style={styles.buttonText}>Company Awards</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#EF4444" }]}
          onPress={() => router.push("./announcements-page-worker")}
        >
          <Text style={styles.buttonEmoji}>📢</Text>
          <Text style={styles.buttonText}>Announcements</Text>
        </TouchableOpacity>
        <TouchableOpacity
  style={[styles.rectButton, { backgroundColor: "#8B5CF6" }]}
  onPress={() => router.push("./meetings-page-worker")}
>
  <Text style={styles.buttonEmoji}>💻</Text>
  <Text style={styles.buttonText}>Meetings</Text>
</TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 16,
  },
  button: {
    width: "20%",       // mai mic decât înainte
    aspectRatio: 1,     // pătrat
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  rectButton: {
  width: "90%",       // aproape toată lățimea
  height: 300,         // mai înalt decât butoanele pătrate
  borderRadius: 16,
  justifyContent: "center",
  alignItems: "center",
  marginVertical: 10,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 4,
  elevation: 3,
},

  buttonEmoji: {
    fontSize: 32,       // puțin mai mic
    marginBottom: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,       // mai mic
    textAlign: "center",
  },
});
