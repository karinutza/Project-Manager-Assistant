import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";


import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";



 
export default function AnalyticsPage(): React.ReactElement {
  const { id } = useLocalSearchParams();
   const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [project, setProject] = useState({
    id,
    name: `Project ${id}`,
    description: "Engineering project timeline and milestones.",
  });

  const [tasks, setTasks] = useState<{ name?: string; progress?: number; department?: string; description?: string }[]>([]);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number | null>(null);
  const [taskNote, setTaskNote] = useState<string>("");

  const params = useLocalSearchParams();

  useEffect(() => {
    const tasksParam = params.tasks as string | undefined;
    if (!tasksParam) return;
    try {
      const parsed = JSON.parse(decodeURIComponent(tasksParam));
      if (Array.isArray(parsed)) {
        setTasks(
          parsed.map((t) => ({ name: t.name, progress: Number(t.progress) || 0, department: t.department || "General" }))
        );
      }
    } catch (e) { }
  }, [params.tasks]);

  const progressPercent = tasks.length
    ? Math.round(tasks.reduce((acc, t) => acc + (t.progress ?? 0), 0) / tasks.length)
    : 0;

  // Compute KPIs
  const completedTasks = tasks.filter((t) => t.progress === 100).length;
  const inProgressTasks = tasks.filter((t) => t.progress! > 0 && t.progress! < 100).length;
  const overdueTasks = 0; // Placeholder

  return (
    <View style={styles.container}>
      
      {isMenuOpen && (
              <View style={styles.sideMenu}>
                <TouchableOpacity onPress={() => { router.push("/project/worker/pages-worker/user-profile-worker"); setIsMenuOpen(false); }}>
                  <Text style={styles.menuItem}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { router.push("./project/worker/pages-worker/settings"); setIsMenuOpen(false); }}>
                  <Text style={styles.menuItem}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsMenuOpen(false)}>
                  <Text style={styles.menuItem}>Close Menu</Text>
                </TouchableOpacity>
              </View>
            )}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Project Header */}
        <View style={styles.headerSection}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push("/project/worker/pages-worker/project-page-worker")}>
            <Ionicons name="arrow-back" size={18} color="#fff" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.pageTitle}>{project.name} – Analytics</Text>
          <Text style={styles.projectDescription}>{project.description}</Text>
        </View>

        {/* Overall Progress */}
        <View style={styles.overallProgressCard}>
          <Text style={styles.sectionTitle}>Overall Completion</Text>
          <View style={styles.circularProgressContainer}>
            <View style={[styles.circularProgress, { width: 120, height: 120, borderRadius: 60 }]}>
              <View style={[styles.progressFillCircle, { width: `${progressPercent}%`, height: `${progressPercent}%` }]} />
              <Text style={styles.circularProgressLabel}>{progressPercent}%</Text>
            </View>
          </View>
        </View>

        {/* KPI Cards */}
        <View style={styles.kpiRow}>
          <View style={[styles.kpiCard, styles.kpiPrimary]}>
            <Ionicons name="checkmark-circle" size={28} color="#fff" />
            <Text style={styles.kpiNumber}>{completedTasks}</Text>
            <Text style={styles.kpiLabel}>Completed</Text>
          </View>
          <View style={[styles.kpiCard, styles.kpiAccent]}>
            <Ionicons name="timer" size={28} color="#fff" />
            <Text style={styles.kpiNumber}>{inProgressTasks}</Text>
            <Text style={styles.kpiLabel}>In Progress</Text>
          </View>
          <View style={[styles.kpiCard, styles.kpiWarn]}>
            <Ionicons name="alert-circle" size={28} color="#fff" />
            <Text style={styles.kpiNumber}>{overdueTasks}</Text>
            <Text style={styles.kpiLabel}>Overdue</Text>
          </View>
        </View>

        {/* Tasks */}
        <View style={styles.taskListSection}>
          <Text style={styles.sectionTitle}>Tasks Overview</Text>
          {tasks.map((task, idx) => (
            <View key={idx} style={styles.taskRow}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.taskName}>
                    {task.name} <Text style={styles.taskDept}>-{task.department}</Text>
                  </Text>
                  {task.description && <Text style={styles.taskNote}>{task.description}</Text>}
                </View>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    setSelectedTaskIndex(idx);
                    setTaskNote(task.description ?? "");
                    setEditModalVisible(true);
                  }}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.taskProgressWrapper}>
                <View style={styles.taskProgressBackground}>
                  <View style={[styles.taskProgressFill, { width: `${task.progress ?? 0}%` }]} />
                </View>
                <Text style={styles.taskProgressText}>{task.progress ?? 0}%</Text>
              </View>
            </View>
          ))}
          {tasks.length === 0 && <Text style={styles.placeholderText}>No tasks available</Text>}
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={editModalVisible} transparent animationType="slide" onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Task Note</Text>
            <Text style={{ marginBottom: 8, color: "#444" }}>{selectedTaskIndex !== null ? tasks[selectedTaskIndex].name : ""}</Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={4}
              placeholder="Add important notes or description"
              value={taskNote}
              onChangeText={setTaskNote}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (selectedTaskIndex === null) return setEditModalVisible(false);
                  const updated = [...tasks];
                  updated[selectedTaskIndex] = { ...updated[selectedTaskIndex], description: taskNote };
                  setTasks(updated);
                  setEditModalVisible(false);
                }}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8fc" },
  scrollContainer: { paddingBottom: 120 },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: "#1b18b6",
    position: "relative",
    zIndex: 10,
  },
  appName: { color: "#fff", fontWeight: "600", fontSize: 25 },
  menuContainer: {
    position: "absolute",
    top: 60,
    left: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 20,
  },
  sideMenu: {
    position: "absolute",
    top: 60,
    left: 0,
    width: 220,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 20,
  },
  menuItem: { fontSize: 16, marginVertical: 6, color: "#1b18b6" },
  placeholderText: { color: "#777", fontSize: 15, marginTop: 10, textAlign: "center" },
  headerSection: { padding: 20, alignItems: "center", backgroundColor: "#fff", borderBottomColor: "#ddd", borderBottomWidth: 1, borderRadius: 12, margin: 10, elevation: 2 },
  backButton: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: "#1b18b6", marginBottom: 10 },
  backButtonText: { color: "#fff", marginLeft: 6, fontWeight: "600" },
  pageTitle: { fontSize: 26, fontWeight: "700", color: "#1b18b6", textAlign: "center", marginBottom: 4 },
  projectDescription: { color: "#555", fontSize: 15, textAlign: "center", maxWidth: 320 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#333", marginBottom: 12 },
  overallProgressCard: { padding: 20, backgroundColor: "#fff", marginHorizontal: 10, borderRadius: 12, alignItems: "center", elevation: 2, marginTop: 20 },
  circularProgressContainer: { justifyContent: "center", alignItems: "center", marginTop: 12 },
  circularProgress: { justifyContent: "center", alignItems: "center", backgroundColor: "#eee", borderWidth: 8, borderColor: "#ddd" },
  progressFillCircle: { backgroundColor: "#1b18b6", borderRadius: 60 },
  circularProgressLabel: { position: "absolute", fontSize: 18, fontWeight: "700", color: "#1b18b6" },
  kpiRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20, paddingHorizontal: 10 },
  kpiCard: { flex: 1, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 8, alignItems: "center", marginHorizontal: 4, elevation: 3 },
  kpiPrimary: { backgroundColor: "#1b18b6" },
  kpiAccent: { backgroundColor: "#00C9A7" },
  kpiWarn: { backgroundColor: "#FF6B6B" },
  kpiNumber: { fontSize: 22, fontWeight: "700", color: "#fff", marginTop: 6 },
  kpiLabel: { color: "rgba(255,255,255,0.9)", fontSize: 13, marginTop: 4 },
  taskListSection: { marginTop: 20, marginHorizontal: 10 },
  taskRow: { marginBottom: 12, backgroundColor: "#fff", padding: 12, borderRadius: 10, elevation: 1 },
  taskName: { fontWeight: "600", color: "#333", marginBottom: 6 },
  taskDept: { color: "#1b18b6", fontWeight: "700" },
  taskProgressWrapper: { flexDirection: "row", alignItems: "center" },
  taskProgressBackground: { flex: 1, height: 12, backgroundColor: "#eee", borderRadius: 6, overflow: "hidden", marginRight: 10 },
  taskProgressFill: { height: "100%", backgroundColor: "#1b18b6" },
  taskProgressText: { width: 40, textAlign: "right", fontWeight: "600", color: "#333", padding: 7 },
  taskNote: { color: "#555", fontSize: 13, marginTop: 6 },
  editButton: { marginTop: 6, padding: 7, backgroundColor: "#1b18b6", borderRadius: 8 },
  editButtonText: { color: "#fff", fontWeight: "700" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalBox: { width: "90%", backgroundColor: "#fff", borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  textArea: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, minHeight: 80, textAlignVertical: "top" },
  cancelText: { color: "#888", fontWeight: "600" },
  saveText: { color: "#1b18b6", fontWeight: "700", fontSize: 25 },
});
