import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
    Dimensions,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Toolbar from "../components-worker/toolbar-worker";

const COLORS = ["#1b18b6", "#e63946", "#f1c40f", "#2a9d8f", "#e76f51", "#9d4edd"];

type Task = {
  id: string;
  title: string;
  description: string;
  datetime: string; // "YYYY-MM-DDTHH:MM"
  duration?: string;
  location?: string;
  color: string;
  organizer?: string;
};

export default function CalendarDay() {
  // initial manual tasks (from your meetings list + extras)
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Team Sync",
      description: "Weekly team sync-up meeting",
      datetime: "2025-11-12T10:00",
      duration: "1h",
      location: "Conference Room A",
      color: "#1b18b6",
      organizer: "John Doe",
    },
    {
      id: "2",
      title: "Project Planning",
      description: "Plan next sprint",
      datetime: "2025-11-13T14:00",
      duration: "2h",
      location: "Zoom",
      color: "#e63946",
      organizer: "Jane Smith",
    },
    {
      id: "3",
      title: "Client Call",
      description: "Call with client to discuss feedback",
      datetime: "2025-11-13T16:00",
      duration: "30min",
      location: "Teams",
      color: "#f1c40f",
      organizer: "John Doe",
    },
    {
      id: "4",
      title: "Design Review",
      description: "Review UI/UX designs for project",
      datetime: "2025-11-15T11:00",
      duration: "1h",
      location: "Design Room",
      color: "#2a9d8f",
      organizer: "Alice Johnson",
    },
    // extra example
    {
      id: "5",
      title: "Backend Deploy",
      description: "Deploy v1.2 to staging",
      datetime: "2025-11-15T15:30",
      duration: "30min",
      location: "CI Server",
      color: "#9d4edd",
      organizer: "Ops Team",
    },
  ]);

  // calendar sizing
  const { height } = Dimensions.get("window");
  const calendarHeight = Math.min(700, Math.round(height * 0.8));

  // selected date state for modals
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  ); // default: today
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);

  // form state for new task
  const [form, setForm] = useState({
    title: "",
    description: "",
    time: "",
    duration: "1h",
    location: "",
    color: COLORS[0],
    organizer: "",
  });

  // build markedDates from tasks (recomputed on tasks change)
  const markedDates = useMemo(() => {
    const md: Record<string, any> = {};
    tasks.forEach((t) => {
      const day = t.datetime.split("T")[0];
      if (!md[day]) md[day] = { dots: [] };
      md[day].dots.push({ key: t.id, color: t.color });
    });
    // highlight selectedDate so user sees it clearly
    if (selectedDate) {
      md[selectedDate] = {
        ...(md[selectedDate] || {}),
        selected: true,
        selectedColor: "#1b18b6",
        selectedTextColor: "#fff",
      };
    }
    return md;
  }, [tasks, selectedDate]);

  // tasks for the currently selectedDate (sorted by time)
  const tasksForSelectedDate = useMemo(() => {
    return tasks
      .filter((t) => t.datetime.split("T")[0] === selectedDate)
      .sort((a, b) => (a.datetime > b.datetime ? 1 : -1));
  }, [tasks, selectedDate]);

  // handle pressing a day: open local modal with details (no router navigation)
  function onDayPress(day: any) {
    setSelectedDate(day.dateString);
    setViewModalVisible(true);
  }

  // add a new task using the form; uses selectedDate as date
  function handleAddTask() {
    if (!form.title.trim()) return alert("Please enter a title");
    // time validation simple: ensure HH:MM
    const time = form.time && /^\d{2}:\d{2}$/.test(form.time) ? form.time : "09:00";
    const newTask: Task = {
      id: Date.now().toString(),
      title: form.title.trim(),
      description: form.description.trim(),
      datetime: `${selectedDate}T${time}`,
      duration: form.duration || "1h",
      location: form.location || "TBD",
      color: form.color,
      organizer: form.organizer || "You",
    };
    setTasks((prev) => [...prev, newTask]);
    // clear form and close modal
    setForm({
      title: "",
      description: "",
      time: "",
      duration: "1h",
      location: "",
      color: COLORS[0],
      organizer: "",
    });
    setAddModalVisible(false);
    setViewModalVisible(true); // show day view to see just added task
  }

  // Preselect today on mount (keeps user expectation)
  useEffect(() => {
    setSelectedDate((s) => s || new Date().toISOString().split("T")[0]);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Toolbar />

        <View style={styles.content}>
          {/* header */}
          <View style={{ marginBottom: 8 }}>
            <Text style={styles.pageTitle}>Project Calendar</Text>
            <Text style={styles.subTitle}>
              Tap a day to view details or press + to add a task
            </Text>
          </View>

          {/* calendar */}
          <View style={[styles.calendarCard, { height: calendarHeight }]}>
            <Calendar
              markingType="multi-dot"
              markedDates={markedDates}
              onDayPress={onDayPress}
              dayComponent={(props) => {
                const { date, state, marking, onPress } = props as any;
                const DAY_SIZE = 64;
                const dots = (marking && marking.dots) || [];
                const isToday =
                  date.dateString === new Date().toISOString().split("T")[0];
                return (
                  <TouchableOpacity
                    onPress={() => {
                      onPress && onPress(date);
                    }}
                    activeOpacity={0.85}
                    style={{
                      width: DAY_SIZE,
                      height: DAY_SIZE,
                      marginVertical: 6,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 12,
                      borderWidth: isToday ? 2 : 0,
                      borderColor: isToday ? "#1b18b6" : "transparent",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: isToday ? "700" : "600",
                        color: state === "disabled" ? "#b8bac8" : "#0f1724",
                      }}
                    >
                      {date.day}
                    </Text>

                    <View
                      style={{
                        position: "absolute",
                        bottom: 6,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      {dots.map((dot: any) => (
                        <View
                          key={dot.key}
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: dot.color,
                            marginHorizontal: 2,
                          }}
                        />
                      ))}
                    </View>
                  </TouchableOpacity>
                );
              }}
              theme={{
                todayTextColor: "#1b18b6",
                arrowColor: "#1b18b6",
                monthTextColor: "#0f1724",
              }}
              style={styles.calendar}
            />
          </View>

          {/* quick list for selected date below calendar */}
          <View style={{ marginTop: 12 }}>
            <Text style={styles.sectionTitle}>
              {selectedDate ? `Tasks on ${selectedDate}` : "Select a day"}
            </Text>

            {tasksForSelectedDate.length === 0 ? (
              <Text style={styles.noTaskText}>No tasks for this day.</Text>
            ) : (
              tasksForSelectedDate.map((t) => (
                <View key={t.id} style={[styles.taskCard, { borderLeftColor: t.color }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.taskTitle}>{t.title}</Text>
                    <Text style={styles.taskDetail}>
                      🕒 {t.datetime.split("T")[1]} • 📍 {t.location}
                    </Text>
                    <Text style={styles.taskDescription}>{t.description}</Text>
                    <Text style={styles.taskOrganizer}>👤 {t.organizer}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* floating add button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          // ensure selectedDate exists (if not, use today)
          setSelectedDate((s) => s || new Date().toISOString().split("T")[0]);
          setAddModalVisible(true);
          setViewModalVisible(false);
        }}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* View day modal (when user taps a day) */}
      <Modal visible={viewModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentLarge}>
            <Text style={styles.modalTitle}>Tasks for {selectedDate}</Text>

            <ScrollView style={{ width: "100%", marginTop: 8 }}>
              {tasksForSelectedDate.length === 0 ? (
                <Text style={{ color: "#555", textAlign: "center", marginTop: 20 }}>
                  No tasks for this day.
                </Text>
              ) : (
                tasksForSelectedDate.map((t) => {
                  const time = t.datetime.split("T")[1];
                  return (
                    <View key={t.id} style={[styles.detailTaskCard, { borderLeftColor: t.color }]}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.detailTitle}>{t.title}</Text>
                          <Text style={styles.detailMeta}>
                            {time} • {t.duration || "—"} • {t.location}
                          </Text>
                          <Text style={styles.detailDesc}>{t.description}</Text>
                          <Text style={styles.detailOrganizer}>Organizer: {t.organizer}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>

            <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", marginTop: 12 }}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#aaa" }]}
                onPress={() => setViewModalVisible(false)}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>Close</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#1b18b6" }]}
                onPress={() => {
                  setAddModalVisible(true);
                  setViewModalVisible(false);
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add task modal */}
      <Modal visible={addModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Task for {selectedDate}</Text>

            <TextInput
              placeholder="Title"
              value={form.title}
              onChangeText={(t) => setForm((p) => ({ ...p, title: t }))}
              style={styles.input}
            />
            <TextInput
              placeholder="Description"
              value={form.description}
              onChangeText={(t) => setForm((p) => ({ ...p, description: t }))}
              style={styles.input}
            />
            <TextInput
              placeholder="Time (HH:MM)"
              value={form.time}
              onChangeText={(t) => setForm((p) => ({ ...p, time: t }))}
              style={styles.input}
            />
            <TextInput
              placeholder="Duration (e.g. 1h)"
              value={form.duration}
              onChangeText={(t) => setForm((p) => ({ ...p, duration: t }))}
              style={styles.input}
            />
            <TextInput
              placeholder="Location"
              value={form.location}
              onChangeText={(t) => setForm((p) => ({ ...p, location: t }))}
              style={styles.input}
            />
            <TextInput
              placeholder="Organizer"
              value={form.organizer}
              onChangeText={(t) => setForm((p) => ({ ...p, organizer: t }))}
              style={styles.input}
            />

            <Text style={{ marginTop: 10 }}>Select color</Text>
            <View style={{ flexDirection: "row", marginTop: 8 }}>
              {COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setForm((p) => ({ ...p, color: c }))}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: c, borderWidth: form.color === c ? 2 : 0 },
                  ]}
                />
              ))}
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 16 }}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#aaa" }]} onPress={() => setAddModalVisible(false)}>
                <Text style={{ color: "#fff", fontWeight: "700" }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#1b18b6" }]} onPress={handleAddTask}>
                <Text style={{ color: "#fff", fontWeight: "700" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* styles (kept compact but clear) */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8fc" },
  content: { flex: 1, padding: 20 },
  pageTitle: { fontSize: 28, fontWeight: "700", color: "#1b18b6", textAlign: "center" },
  subTitle: { color: "#555", fontSize: 14, textAlign: "center", marginTop: 6 },
  calendarCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginVertical: 18,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  calendar: { borderRadius: 12, overflow: "hidden" },
  sectionTitle: { fontSize: 18, fontWeight: "700" },
  taskCard: {
    backgroundColor: "#fff",
    borderLeftWidth: 6,
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  taskTitle: { fontSize: 16, fontWeight: "700", color: "#0f1724" },
  taskDetail: { fontSize: 14, color: "#555", marginTop: 4 },
  taskDescription: { color: "#777", marginTop: 6 },
  taskOrganizer: { fontSize: 12, color: "#888", marginTop: 6 },
  noTaskText: { color: "#777", textAlign: "center", marginTop: 8 },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#1b18b6",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
  modalOverlay: { flex: 1, backgroundColor: "#00000066", justifyContent: "center", alignItems: "center" },
  modalContentLarge: {
    width: "92%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
  },
  modalContent: {
    width: "92%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "700" },
  detailTaskCard: {
    borderLeftWidth: 6,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  detailTitle: { fontSize: 16, fontWeight: "800" },
  detailMeta: { color: "#555", marginTop: 6 },
  detailDesc: { color: "#666", marginTop: 6 },
  detailOrganizer: { color: "#777", marginTop: 8, fontSize: 13 },
  input: { width: "100%", borderWidth: 1, borderColor: "#e6e6e6", padding: 10, borderRadius: 8, marginTop: 10 },
  colorCircle: { width: 34, height: 34, borderRadius: 18, marginRight: 10 },
  modalButton: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10 },
});
