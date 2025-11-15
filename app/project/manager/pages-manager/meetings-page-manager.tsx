import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import BurgerMenu from "../pages-manager/burger-menu-manager";
import NotificationManager from "../pages-manager/notification-manager"; // import notificări

const sampleMeetings = [
  { id: "1", title: "Team Sync", description: "Weekly team sync-up meeting", datetime: "2025-11-12T10:00", duration: "1h", location: "Conference Room A", organizer: "John Doe" },
  { id: "2", title: "Project Planning", description: "Plan next sprint", datetime: "2025-11-13T14:00", duration: "2h", location: "Zoom", organizer: "Jane Smith" },
  { id: "3", title: "Client Call", description: "Call with client to discuss feedback", datetime: "2025-11-13T16:00", duration: "30min", location: "Teams", organizer: "John Doe" },
  { id: "4", title: "Design Review", description: "Review UI/UX designs for project", datetime: "2025-11-15T11:00", duration: "1h", location: "Design Room", organizer: "Alice Johnson" },
];

const notifications: { id: string; title: string; message: string; type: "info" | "meeting" | "success"; time: string }[] = [
  { id: "1", title: "Team Sync Reminder", message: "Team Sync starts at 10:00", type: "info", time: "1h ago" },
  { id: "2", title: "Project Planning", message: "Project Planning at 14:00 on Zoom", type: "meeting", time: "2h ago" },
  { id: "3", title: "Client Call Done", message: "John marked 'Client Call' as done", type: "success", time: "Yesterday" },
];

export default function MeetingsPageWorker() {
  const [selectedDate, setSelectedDate] = useState<string>("2025-11-12");
  const [open, setOpen] = useState(false);

  const project = { name: "Meetings💻", description: "Welcome to the meetings section" };

  // KPI relevante
  const todaysMeetings = sampleMeetings.filter(
    (m) => m.datetime.split("T")[0] === selectedDate
  ).length;

  const nextMeeting = sampleMeetings
    .filter((m) => m.datetime >= new Date().toISOString())
    .sort((a, b) => a.datetime.localeCompare(b.datetime))[0]?.datetime.split("T")[1] || "None";

  const totalMeetings = sampleMeetings.length;

  const marked: Record<string, any> = {};
  sampleMeetings.forEach((m) => {
    const dateStr = m.datetime.split("T")[0];
    marked[dateStr] = { marked: true, dotColor: "#fff", selected: true, selectedColor: "#3B82F6" };
  });

  return (
    <View style={styles.container}>
      {/* HEADER TOOLBAR */}
      <LinearGradient
        colors={["#2962FF", "#4FC3F7"]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.toolbarContainer}
      >
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

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity style={styles.iconButton} onPress={() => { }}>
            <Ionicons name="refresh" size={18} color="#fff" />
          </TouchableOpacity>

          {/* Notifications */}
          <NotificationManager notifications={notifications} />
        </View>
      </LinearGradient>

      {/* OVERLAY + BURGER MENU */}
      {open && (
        <>
          <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpen(false)} />
          <BurgerMenu closeMenu={() => setOpen(false)} />
        </>
      )}

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
            <Text style={styles.topKpiLabel}>Today&apos;s Meetings</Text>
            <Text style={styles.topKpiValue}>{todaysMeetings}</Text>
          </View>
          <View style={styles.topKpi}>
            <Text style={styles.topKpiLabel}>Next Meeting</Text>
            <Text style={styles.topKpiValue}>{nextMeeting}</Text>
          </View>
          <View style={styles.topKpi}>
            <Text style={styles.topKpiLabel}>Total Meetings</Text>
            <Text style={styles.topKpiValue}>{totalMeetings}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* CONTENT */}
      <View style={styles.content}>
        {/* Left column: Meetings */}
        <ScrollView style={styles.leftColumn}>
          {sampleMeetings.map((m) => (
            <View key={m.id} style={styles.meetingCard}>
              <Text style={styles.title}>{m.title}</Text>
              <Text style={styles.description}>{m.description}</Text>

              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={14} style={styles.infoIcon} />
                <Text style={styles.infoText}>{m.datetime.split("T")[0]}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={14} style={styles.infoIcon} />
                <Text style={styles.infoText}>{m.duration}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={14} style={styles.infoIcon} />
                <Text style={styles.infoText}>{m.location}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={14} style={styles.infoIcon} />
                <Text style={styles.infoText}>{m.organizer}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Right column: Calendar */}
        <View style={styles.rightColumn}>
          <Calendar
            onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
            markedDates={marked}
            theme={{
              selectedDayBackgroundColor: "#3B82F6",
              selectedDayTextColor: "#fff",
              todayTextColor: "#3B82F6",
              dotColor: "#3B82F6",
              arrowColor: "#3B82F6",
              monthTextColor: "#1b18b6",
              textDayFontWeight: "700",
              textMonthFontWeight: "700",
            }}
            style={styles.calendar}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
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
  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 44 : 20,
    paddingBottom: 18,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 12,
    elevation: 6,
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "800", textAlign: "center" },
  headerSubtitle: { color: "rgba(255,255,255,0.85)", fontSize: 14, marginTop: 6, textAlign: "center" },
  topKpiRow: { flexDirection: "row", marginTop: 14, justifyContent: "space-between" },
  topKpi: { flex: 1, alignItems: "center" },
  topKpiLabel: { color: "rgba(255,255,255,0.85)", fontSize: 12 },
  topKpiValue: { color: "#fff", fontSize: 16, fontWeight: "800", marginTop: 6 },

  content: { flex: 1, flexDirection: "row", padding: 12 },
  leftColumn: { flex: 2, marginRight: 12 },
  rightColumn: { flex: 1, justifyContent: "flex-start" },

  meetingCard: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  title: { fontSize: 18, fontWeight: "800", marginBottom: 6, color: "#1E40AF" },
  description: { fontSize: 14, color: "#374151", marginBottom: 6 },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  infoIcon: { marginRight: 6, color: "#3B82F6" },
  infoText: { fontSize: 13, color: "#4B5563" },

  calendar: { flex: 1, borderRadius: 12 },
});
