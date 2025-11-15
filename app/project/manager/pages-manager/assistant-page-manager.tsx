import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import BurgerMenu from "./burger-menu-manager";
import { askAI } from "./local-ai-manager";
import NotificationManager from "./notification-manager"; // import notificări

export default function AssistantPageWorker() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [open, setOpen] = useState(false);

  const [project] = useState({
    name: `AI ChatBot 🤖`,
    description: "Ask whatever you want.",
  });

  // Exemple de anunțuri / notificări
  const sampleAnnouncements = [
    {
      id: "1",
      title: "Team Meeting",
      message: "Project kickoff meeting at 10:00",
      date: "2025-11-16",
      important: true,
      type: "meeting",
    },
    {
      id: "2",
      title: "Birthday",
      message: "Today is Alex's birthday!",
      date: "2025-11-17",
      important: false,
      type: "birthday",
    },
    {
      id: "3",
      title: "System Update",
      message: "Maintenance scheduled at 18:00",
      date: "2025-11-18",
      important: true,
      type: "info",
    },
  ];

  const notifications = sampleAnnouncements.map((a) => ({
    id: a.id,
    title: a.title,
    message: a.message,
    type: (a.type === "birthday" ? "info" : a.type) as "meeting" | "info" | "success" | undefined,
    time: a.date,
  }));

  const submit = () => {
    if (input.trim() === "") return;
    const r = askAI(input.trim());
    setResponse(r);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
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

        {/* Refresh + Notifications */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity style={styles.iconButton} onPress={() => { }}>
            <Ionicons name="refresh" size={18} color="#fff" />
          </TouchableOpacity>

          {/* Notification button */}
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
              {sampleAnnouncements.filter((a) => new Date(a.date) > new Date()).length}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.title}>🤖 Workplace Assistant</Text>
        <Text style={styles.subtitle}>
          Întreabă-mă despre zile de naștere, întâlniri și alte lucruri legate de muncă.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ex: Când e ziua lui Alex?"
          value={input}
          onChangeText={setInput}
        />

        <TouchableOpacity style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>Răspunde</Text>
        </TouchableOpacity>

        {response !== "" && (
          <View style={styles.responseBox}>
            <Text style={styles.responseText}>{response}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// STYLES
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
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 9,
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
  title: { fontSize: 26, fontWeight: "800", marginBottom: 4 },
  subtitle: { fontSize: 15, color: "#555", marginBottom: 20 },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#3B82F6",
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 17 },
  responseBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  responseText: { fontSize: 16, lineHeight: 22 },
});
