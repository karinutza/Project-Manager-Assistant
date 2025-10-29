import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import Toolbar from "../components-boss/toolbar-boss";

import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AnalyticsPage(): React.ReactElement {
  const { id } = useLocalSearchParams();

  const [project, setProject] = useState({
    id,
    name: `Project ${id}`,
    description: "Engineering project timeline and milestones.",
  });

  const [tasks, setTasks] = useState<Array<{ name?: string; progress?: number; department?: string; description?: string }>>([]);

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
    } catch (e) {
      // ignore
    }
  }, [params.tasks]);

  const progressPercent = tasks.length
    ? Math.round(tasks.reduce((acc, t) => acc + (t.progress ?? 0), 0) / tasks.length)
    : 0;

  // Compute KPIs
  const completedTasks = tasks.filter((t) => t.progress === 100).length;
  const inProgressTasks = tasks.filter((t) => t.progress! > 0 && t.progress! < 100).length;
  const overdueTasks = 0; // Placeholder: add deadline logic if available

  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={styles.container}>
      {/* Toolbar */}
      <Toolbar />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Project Header */}
        <View style={styles.headerSection}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push("/project/boss/pages-boss/project-page-boss")}>
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

        {/* Task List */}
        <View style={styles.taskListSection}>
          <Text style={styles.sectionTitle}>Tasks Overview</Text>
          {tasks.map((task, idx) => (
            <View key={idx} style={styles.taskRow}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.taskName}>
                    <Text>{task.name}</Text>
                    <Text style={styles.taskDept}>{`-${task.department}`}</Text>
                  </Text>
                  {task.description ? <Text style={styles.taskNote}>{task.description}</Text> : null}
                </View>
                <View style={{ alignItems: "flex-end", marginLeft: 12 }}>
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

      {/* Edit Note Modal */}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8fc" },

  scrollContainer: { paddingBottom: 120 }, // Extra padding to prevent footer overlap
  headerSection: { padding: 20, alignItems: "center", backgroundColor: "#fff", borderBottomColor: "#ddd", borderBottomWidth: 1, borderRadius: 12, margin: 10, elevation: 2 },
  backButton: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: "#1b18b6", marginBottom: 10 },
  backButtonText: { color: "#fff", marginLeft: 6, fontWeight: "600" },
  pageTitle: { fontSize: 26, fontWeight: "700", color: "#1b18b6", textAlign: "center", marginBottom: 4 },
  projectDescription: { color: "#555", fontSize: 15, textAlign: "center", maxWidth: 320 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#333", marginBottom: 12 },
  placeholderText: { color: "#777", fontSize: 15, marginTop: 10, textAlign: "center" },
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
  taskProgressWrapper: { flexDirection: "row", alignItems: "center" },
  taskProgressBackground: { flex: 1, height: 12, backgroundColor: "#eee", borderRadius: 6, overflow: "hidden", marginRight: 10 },
  taskProgressFill: { height: "100%", backgroundColor: "#1b18b6" },
  taskProgressText: { width: 40, textAlign: "right", fontWeight: "600", color: "#333", padding: 7 },

  taskNote: { color: "#555", fontSize: 13, marginTop: 6 },
  editButton: { marginTop: 6, padding: 7, backgroundColor: "#1b18b6", borderRadius: 8 },
  editButtonText: { color: "#fff", fontWeight: "700" },
  taskDept: { color: "#1b18b6", fontWeight: "700" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalBox: { width: "90%", backgroundColor: "#fff", borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  textArea: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, minHeight: 80, textAlignVertical: "top" },
  cancelText: { color: "#888", fontWeight: "600" },
  saveText: { color: "#1b18b6", fontWeight: "700", fontSize: 25 },

});
