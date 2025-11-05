import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Toolbar from "../components-boss/toolbar-boss";

import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const STORAGE_KEY = "@pma_user_v1";
const { width } = Dimensions.get("window");

export default function ProjectUserPage() {
  const [user, setUser] = useState<{ name?: string; email?: string; password?: string; rank?: string } | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setUser(JSON.parse(raw));
        else {
          const seed = { name: "Karina Barbul", email: "karina@example.com", rank: "Boss" };
          setUser(seed);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
        }
      } catch { }
    })();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const save = async () => {
    if (!name || !email) return Alert.alert("Name and email required");
    const updated = { ...(user || {}), name, email, ...(password ? { password } : {}) };
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setUser(updated as any);
      Alert.alert("Saved");
    } catch {
      Alert.alert("Save failed");
    }
    setEditing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Toolbar (matched from HomeScreen but keeps home icon) */}
      <Toolbar />

      {/* Content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
        <View style={styles.profileCard}>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userRank}>{user?.rank}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Projects</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>34</Text>
              <Text style={styles.statLabel}>Tasks</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>92%</Text>
              <Text style={styles.statLabel}>Completion</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>

            <Text style={styles.infoLabel}>Password</Text>
            <Text style={styles.infoValue}>{user?.password ? "••••••••" : "Not set"}</Text>

            <Text style={styles.infoLabel}>Rank</Text>
            <Text style={styles.infoValue}>{user?.rank}</Text>
          </View>

          <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
            <Ionicons name="create-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={editing} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setEditing(false)} style={{ padding: 6 }}>
                <Ionicons name="close" size={22} color="#6b7280" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Edit Profile</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
              <Text style={styles.modalLabel}>Name</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} />

              <Text style={styles.modalLabel}>Email</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

              <Text style={styles.modalLabel}>Password</Text>
              <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

              <View style={styles.modalActions}>
                <TouchableOpacity onPress={() => setEditing(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={save}>
                  <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EEF3F9" },
  profileCard: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0px 2px 8px rgba(0,0,0,0.10)",
    alignItems: "center",
  },
  avatar: { width: 110, height: 110, borderRadius: 55, marginBottom: 10 },
  userName: { fontSize: 20, fontWeight: "700", color: "#0f1724" },
  userRank: { fontSize: 14, color: "#6b7280", marginBottom: 12 },
  statsRow: { flexDirection: "row", justifyContent: "space-around", width: "100%", marginBottom: 18 },
  statBox: { alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "700", color: "#1b18b6" },
  statLabel: { fontSize: 13, color: "#6b7280" },
  infoCard: { alignSelf: "stretch", marginTop: 10 },
  infoLabel: { fontSize: 12, color: "#6b7280", marginTop: 12 },
  infoValue: { fontSize: 15, fontWeight: "600", color: "#0f1724" },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1b18b6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 24,
  },
  editButtonText: { color: "#fff", fontWeight: "700" },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)", justifyContent: "flex-end" },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    maxHeight: "80%",
  },
  modalHeader: { flexDirection: "row", alignItems: "center", padding: 14 },
  modalTitle: { fontSize: 18, fontWeight: "700", marginLeft: 8 },
  modalLabel: { fontSize: 13, color: "#6b7280", marginTop: 14 },
  input: {
    backgroundColor: "#f1f3fa",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginTop: 6,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 30,
  },
  cancelText: { color: "#6b7280", fontWeight: "600" },
  saveButton: {
    backgroundColor: "#1b18b6",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  saveText: { color: "#fff", fontWeight: "700" },
});
