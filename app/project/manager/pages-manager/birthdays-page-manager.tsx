import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import BurgerMenu from "../pages-manager/burger-menu-manager";
import NotificationManager from "./notification-manager"; // notificări

const sampleBirthdays = [
  { id: "1", name: "John Doe", age: 28, date: "2025-11-12", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: "2", name: "Jane Smith", age: 35, date: "2025-11-15", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  { id: "3", name: "Alice Johnson", age: 30, date: "2025-11-18", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
  { id: "4", name: "Michael Brown", age: 40, date: "2025-11-20", avatar: "https://randomuser.me/api/portraits/men/76.jpg" },
];

export default function BirthdaysPageWorker() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [sentGifts, setSentGifts] = useState<string[]>([]);

  const [project] = useState({
    name: `Birthdays 🎉`,
    description: "See who’s celebrating this month",
  });

  const todayStr = new Date().toISOString().split("T")[0];
  const todayBirthday = sampleBirthdays.find((b) => b.date === todayStr);
  const oldestBirthday = sampleBirthdays.reduce((prev, curr) => (curr.age > prev.age ? curr : prev), sampleBirthdays[0]);

  const markedDates: { [key: string]: any } = {};
  sampleBirthdays.forEach((b) => {
    markedDates[b.date] = {
      marked: true,
      dotColor: "#3B82F6",
      selected: selectedDate === b.date,
      selectedColor: "#10B981",
    };
  });

  const toggleSendGift = (id: string) => {
    setSentGifts((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const birthdaysForSelectedDate = sampleBirthdays.filter((b) => b.date === selectedDate);

  // notificări
  const notifications: { id: string; title: string; message: string; type: "info" | "meeting" | "success"; time: string }[] = [
    { id: "1", title: "New Announcement", message: "New Safety Protocols added", type: "info", time: "1h ago" },
    { id: "2", title: "Holiday Alert", message: "Holiday Schedule updated", type: "info", time: "2h ago" },
  ];

  const renderItem = ({ item }: { item: typeof sampleBirthdays[0] }) => {
    const isSent = sentGifts.includes(item.id);
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.date}>🎉 {item.date} ({item.age} 🎂)</Text>
        </View>
        <TouchableOpacity
          style={[styles.giftButton, isSent && styles.sentButton]}
          onPress={() => toggleSendGift(item.id)}
        >
          <Text style={[styles.giftText, isSent && { color: "#10B981" }]}>
            {isSent ? "✅ Sent" : "🎁 Send"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER + TOOLBAR */}
      <LinearGradient
        colors={["#2962FF", "#4FC3F7"]}
        start={[0, 0]}
        end={[1, 0]}
        style={styles.headerContainer}
      >
        {/* Top buttons */}
        <View style={styles.headerTopRow}>
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
            <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
              <Ionicons name="refresh" size={18} color="#fff" />
            </TouchableOpacity>
            {/* NOTIFICATIONS LÂNGĂ REFRESH */}
            <NotificationManager notifications={notifications} />
          </View>
        </View>

        {/* Header title */}
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>{project.name}</Text>
          <Text style={styles.headerSubtitle}>{project.description}</Text>
        </View>

        {/* Bottom KPI row */}
        <View style={styles.headerBottomRow}>
          <View style={styles.topKpi}>
            <Text style={styles.topKpiLabel}>Today&apos;s Birthday</Text>
            <Text style={styles.topKpiValue}>{todayBirthday ? todayBirthday.name : "-"}</Text>
          </View>
          <View style={styles.topKpi}>
            <Text style={styles.topKpiLabel}>Oldest Person</Text>
            <Text style={styles.topKpiValue}>{oldestBirthday.name} ({oldestBirthday.age})</Text>
          </View>
          <View style={styles.topKpi}>
            <Text style={styles.topKpiLabel}>Total Birthdays</Text>
            <Text style={styles.topKpiValue}>{sampleBirthdays.length}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Overlay + Burger Menu */}
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

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Text style={styles.header}>Upcoming Birthdays</Text>

        {/* Calendar */}
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          style={styles.calendar}
          theme={{
            selectedDayBackgroundColor: "#10B981",
            todayTextColor: "#3B82F6",
            dotColor: "#3B82F6",
            selectedDotColor: "#fff",
          }}
        />

        {/* Birthdays for selected date */}
        {selectedDate && birthdaysForSelectedDate.length > 0 && (
          <View style={styles.selectedDateList}>
            <Text style={styles.selectedDateHeader}>
              Birthdays on {selectedDate}:
            </Text>
            {birthdaysForSelectedDate.map((b) => (
              <Text key={b.id} style={styles.selectedDateText}>
                🎂 {b.name} ({b.age})
              </Text>
            ))}
          </View>
        )}

        {/* All birthdays */}
        <FlatList
          data={sampleBirthdays}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12 }}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// STYLES
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

  headerBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingHorizontal: 12,
    width: "100%",
  },
  topKpi: { flex: 1, alignItems: "center" },
  topKpiLabel: { color: "rgba(255,255,255,0.85)", fontSize: 12 },
  topKpiValue: { color: "#fff", fontSize: 16, fontWeight: "800", marginTop: 4 },

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

  header: { fontSize: 22, fontWeight: "700", color: "#111", marginLeft: 12, marginVertical: 12 },
  calendar: { marginHorizontal: 12, borderRadius: 16, elevation: 2 },

  selectedDateList: { backgroundColor: "#fff", margin: 12, borderRadius: 16, padding: 12, elevation: 3 },
  selectedDateHeader: { fontWeight: "700", fontSize: 16, marginBottom: 6 },
  selectedDateText: { fontSize: 14, color: "#555", marginVertical: 2 },

  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 12, borderRadius: 16, marginBottom: 12, elevation: 3 },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "700", color: "#111" },
  date: { fontSize: 14, color: "#555", marginTop: 2 },
  giftButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  sentButton: {
    backgroundColor: "#E6FFFA",
  },
  giftText: {
    color: "#fff",
    fontWeight: "700",
  },
});
