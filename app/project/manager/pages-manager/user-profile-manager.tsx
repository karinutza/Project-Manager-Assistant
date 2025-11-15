import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import BurgerMenu from "../pages-manager/burger-menu-manager";
import NotificationManager from "./notification-manager";

const STORAGE_KEY = "@pma_user_v1";

/* ----------------------------------------
        NOTIFICATION TYPE 
---------------------------------------- */
type Notification = {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
};

export default function ProjectUserPage() {

  const [open, setOpen] = useState(false);

  /* ----------------------------------------
          NOTIFICATIONS
  ---------------------------------------- */
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", title: "Community Hub", message: "New post in Community Hub!", type: "info" },
    { id: "2", title: "Weekly Summary", message: "Your weekly summary is ready", type: "success" },
  ]);

  const [user, setUser] = useState<{ name?: string; email?: string; password?: string; rank?: string } | null>(null);
  const [editing, setEditing] = useState(false);

  const [project] = useState({
    name: `Profile User`,
    description: "Manage your personal profile settings",
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* LOAD USER */
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setUser(JSON.parse(raw));
        else {
          const seed = { name: "Karina Barbul", email: "karina@example.com", rank: "Manager" };
          setUser(seed);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
        }
      } catch {}
    })();
  }, []);

  /* SYNC STATE */
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  /* SAVE */
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

      {/* HEADER */}
      <LinearGradient
        colors={["#2962FF", "#4FC3F7"]}
        start={[0, 0]}
        end={[1, 0]}
        style={styles.headerContainer}
      >

        {/* HEADER TOP ROW */}
        <View style={styles.headerTopRow}>

          {/* LEFT SIDE (menu + back) */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity style={styles.iconButton} onPress={() => setOpen(true)}>
              <Ionicons name="menu" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push("/project/manager/pages-manager/community-hub-manager")}
            >
              <Ionicons name="arrow-back" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* RIGHT SIDE (refresh + notifications) */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="refresh" size={18} color="#fff" />
            </TouchableOpacity>

            <NotificationManager notifications={notifications} />
          </View>
        </View>

        {/* TITLE */}
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>{project.name}</Text>
          <Text style={styles.headerSubtitle}>{project.description}</Text>
        </View>
      </LinearGradient>

      {/* MENU OVERLAY */}
      {open && (
        <>
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={() => setOpen(false)}
          />
          <BurgerMenu closeMenu={() => setOpen(false)} />
        </>
      )}

      {/* CONTENT */}
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

      {/* EDIT MODAL */}
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

/* ----------------------------------------
              STYLES
---------------------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  headerContainer: {
    paddingTop: Platform.OS === "ios" ? 44 : 20,
    paddingBottom: 20,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 6,
  },

  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitleWrap: { marginTop: 12 },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "800", textAlign: "center" },
  headerSubtitle: { color: "rgba(255,255,255,0.85)", fontSize: 14, marginTop: 4, textAlign: "center" },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1,
  },

  profileCard: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },

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
