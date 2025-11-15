import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toolbar from "../components-manager/toolbar-manager";

const STORAGE_KEY = "@pma_user_v1";

export default function SettingsPage() {
  const [user, setUser] = useState<{ name?: string; email?: string; password?: string; rank?: string } | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
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
      setUser(updated);
      Alert.alert("Settings saved");
      setEditing(false);
    } catch {
      Alert.alert("Save failed");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Toolbar />

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.title}>Account Settings</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

        <Text style={styles.title}>Notifications</Text>
        <View style={styles.notificationRow}>
          <Text>Email Notifications</Text>
          <TouchableOpacity onPress={() => Alert.alert("Toggle email notifications")}>
            <Text style={styles.toggleButton}>Toggle</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.notificationRow}>
          <Text>Push Notifications</Text>
          <TouchableOpacity onPress={() => Alert.alert("Toggle push notifications")}>
            <Text style={styles.toggleButton}>Toggle</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={save}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EEF3F9" },
  title: { fontSize: 20, fontWeight: "700", marginVertical: 16 },
  label: { fontSize: 14, color: "#6b7280", marginTop: 12 },
  input: {
    backgroundColor: "#f1f3fa",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginTop: 6,
  },
  notificationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
    paddingHorizontal: 6,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#1b18b6",
    color: "#fff",
    borderRadius: 8,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#1b18b6",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  saveText: { color: "#fff", fontWeight: "700" },
});