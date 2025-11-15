import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BurgerMenu from "./burger-menu-manager";
import NotificationManager from "./notification-manager"; // import notificări

export default function AnnouncementsPage() {
  const [open, setOpen] = useState(false);
  const [project] = useState({
    name: `Announcements 📢`,
    description: "See all news and announcements here.",
  });

  const progressPercent = 72;
  const tasks = ["Task 1", "Task 2", "Task 3", "Task 4"];
  const completedTasks = 2;

  const sampleAnnouncements = [
    { id: "1", title: "New Safety Protocols", description: "Please review the updated safety protocols for the workshop.", date: "2025-11-15", important: true },
    { id: "2", title: "Holiday Schedule", description: "The office will be closed on December 25th and January 1st.", date: "2025-11-10", important: false },
    { id: "3", title: "Team Building Event", description: "Join us for a fun team-building day at the local park.", date: "2025-11-20", important: true },
    { id: "4", title: "System Maintenance", description: "Scheduled maintenance will occur on November 18th.", date: "2025-11-12", important: false },
  ];

  // Notificări sample
  const notifications: { id: string; title: string; message: string; type: "info" | "meeting" | "success"; time: string }[] = [
    { id: "1", title: "New Announcement", message: "New Safety Protocols added", type: "info", time: "1h ago" },
    { id: "2", title: "Holiday Alert", message: "Holiday Schedule updated", type: "info", time: "2h ago" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* HEADER + TOOLBAR */}
      <LinearGradient
        colors={["#2962FF", "#4FC3F7"]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.toolbarContainer}
      >
        {/* Butoanele sus */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setOpen(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/project/manager/pages-manager/community-hub-manager")}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity style={styles.iconButton} onPress={() => { }} activeOpacity={0.8}>
            <Ionicons name="refresh" size={18} color="#fff" />
          </TouchableOpacity>

          {/* Notifications */}
          <NotificationManager notifications={notifications} />
        </View>
      </LinearGradient>

      {/* OVERLAY PENTRU ÎNCHIDERE BURGER */}
      {open && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        />
      )}

      {/* MENIUL BURGER */}
      {open && <BurgerMenu closeMenu={() => setOpen(false)} />}

      {/* HEADER KPI */}
      <LinearGradient
        colors={["#2962FF", "#4FC3F7"]}
        start={[0, 0]}
        end={[1, 0]}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>{project.name}</Text>
        <Text style={styles.headerSubtitle}>{project.description}</Text>

        <View style={styles.topKpiRow}>
          <View style={styles.topKpi}>
            <Text style={styles.topKpiLabel}>Total</Text>
            <Text style={styles.topKpiValue}>{sampleAnnouncements.length}</Text>
          </View>
          <View style={styles.topKpi}>
            <Text style={styles.topKpiLabel}>Important</Text>
            <Text style={styles.topKpiValue}>
              {sampleAnnouncements.filter((a) => a.important).length}
            </Text>
          </View>
          <View style={styles.topKpi}>
            <Text style={styles.topKpiLabel}>Upcoming</Text>
            <Text style={styles.topKpiValue}>
              {sampleAnnouncements.filter(
                (a) => new Date(a.date) > new Date()
              ).length}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* CONȚINUT */}
      <ScrollView contentContainerStyle={styles.container}>
        {sampleAnnouncements.map(a => (
          <View
            key={a.id}
            style={[styles.card, a.important && styles.importantCard]}
          >
            <Text style={styles.cardDate}>{a.date}</Text>
            {a.important && <Text style={styles.badge}>IMPORTANT</Text>}
            <Text style={styles.cardTitle}>{a.title}</Text>
            <Text style={styles.cardDescription}>{a.description}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 0,
    borderBottomColor: "rgba(255,255,255,0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 44 : 20,
    paddingBottom: 18,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 12,
    elevation: 6,
  },
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
    backgroundColor: "transparent",
    zIndex: 9,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },
  topKpiRow: { flexDirection: "row", marginTop: 14, justifyContent: "space-between", width: "100%" },
  topKpi: { flex: 1, alignItems: "center" },
  topKpiLabel: { color: "rgba(255,255,255,0.85)", fontSize: 12 },
  topKpiValue: { color: "#fff", fontSize: 16, fontWeight: "800", marginTop: 6 },
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  importantCard: {
    borderLeftWidth: 5,
    borderLeftColor: "#EF4444",
  },
  cardDate: { fontSize: 12, color: "#555" },
  badge: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
    backgroundColor: "#EF4444",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#111", marginTop: 8 },
  cardDescription: { fontSize: 14, color: "#555", marginTop: 4 },
});
