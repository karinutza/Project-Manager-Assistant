// analytics-color.tsx
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import Toolbar from "../components-manager/toolbar-manager";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Task = {
  name?: string;
  progress?: number;
  department?: string;
  description?: string;
};

export default function AnalyticsColor(): React.ReactElement {
  const { id, tasks: tasksParam } = useLocalSearchParams();
  const [project, setProject] = useState({
    id,
    name: `Project ${id}`,
    description: "Engineering project timeline and milestones.",
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number | null>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const handleFilterSelect = (filter: string) => {
    setActiveFilter(filter);
    setFilterVisible(false);

    // Aici poți adăuga logica de filtrare efectivă
    if (filter === "All") return;
    if (filter === "Completed") setTasks((prev) => prev.filter((t) => t.progress === 100));
    if (filter === "In Progress") setTasks((prev) => prev.filter((t) => (t.progress ?? 0) > 0 && (t.progress ?? 0) < 100));
    if (filter === "Overdue") setTasks([]); // de exemplu, dacă adaugi un câmp `dueDate`
  };

  const [taskNote, setTaskNote] = useState<string>("");

  useEffect(() => {
    if (!tasksParam) return;
    try {
      const parsed = JSON.parse(decodeURIComponent(tasksParam as string));
      if (Array.isArray(parsed)) {
        setTasks(
          parsed.map((t: any) => ({
            name: t.name,
            progress: Number(t.progress) || 0,
            department: t.department || "General",
            description: t.description || "",
          }))
        );
      }
    } catch (e) {
      // ignore parse errors
    }
  }, [tasksParam]);

  const progressPercent = tasks.length
    ? Math.round(tasks.reduce((acc, t) => acc + (t.progress ?? 0), 0) / tasks.length)
    : 0;

  const completedTasks = tasks.filter((t) => t.progress === 100).length;
  const inProgressTasks = tasks.filter((t) => (t.progress ?? 0) > 0 && (t.progress ?? 0) < 100).length;
  const overdueTasks = 0; // placeholder

  const screenWidth = Dimensions.get("window").width;

  function openEditModal(idx: number) {
    setSelectedTaskIndex(idx);
    setTaskNote(tasks[idx].description ?? "");
    setEditModalVisible(true);
  }

  function saveTaskNote() {
    if (selectedTaskIndex === null) return setEditModalVisible(false);
    const updated = [...tasks];
    updated[selectedTaskIndex] = { ...updated[selectedTaskIndex], description: taskNote };
    setTasks(updated);
    setEditModalVisible(false);
  }

  return (
    <View style={styles.container}>
      <Toolbar />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header - gradient card */}
        <LinearGradient
          colors={["#2962FF", "#4FC3F7"]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.headerGradient}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push("/project/manager/pages-manager/project-page-manager")}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={18} color="#fff" />
            </TouchableOpacity>

            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerTitle}>{project.name}</Text>
              <Text style={styles.headerSubtitle}>{project.description}</Text>
            </View>

            <View style={{ width: 40 }} />
          </View>

          {/* Small metrics row inside header */}
          <View style={styles.topKpiRow}>
            <View style={styles.topKpi}>
              <Text style={styles.topKpiLabel}>Progress</Text>
              <Text style={styles.topKpiValue}>{progressPercent}%</Text>
            </View>
            <View style={styles.topKpi}>
              <Text style={styles.topKpiLabel}>Tasks</Text>
              <Text style={styles.topKpiValue}>{tasks.length}</Text>
            </View>
            <View style={styles.topKpi}>
              <Text style={styles.topKpiLabel}>Completed</Text>
              <Text style={styles.topKpiValue}>{completedTasks}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Main content */}
        <View style={styles.contentWrap}>
          {/* Left: progress + KPI */}
          <View style={styles.row}>
            <View style={styles.progressCard}>
              <Text style={styles.sectionTitle}>Overall Completion</Text>
              <View style={styles.ringWrap}>
                <View style={styles.ringOuter}>
                  <View style={[styles.ringFill, { height: `${progressPercent}%` }]} />
                  <Text style={styles.ringLabel}>{progressPercent}%</Text>
                </View>
              </View>
              <Text style={styles.progressHint}>Average completion across all tasks</Text>
            </View>

            <View style={styles.kpiColumn}>
              <View style={[styles.kpiCard, styles.kpiCardPrimary]}>
                <View style={styles.kpiIconWrap}>
                  <Ionicons name="checkmark-circle" size={22} color="#fff" />
                </View>
                <Text style={styles.kpiNum}>{completedTasks}</Text>
                <Text style={styles.kpiText}>Completed</Text>
              </View>

              <View style={[styles.kpiCard, styles.kpiCardAccent]}>
                <View style={styles.kpiIconWrap}>
                  <Ionicons name="timer" size={22} color="#fff" />
                </View>
                <Text style={styles.kpiNum}>{inProgressTasks}</Text>
                <Text style={styles.kpiText}>In Progress</Text>
              </View>

              <View style={[styles.kpiCard, styles.kpiCardWarn]}>
                <View style={styles.kpiIconWrap}>
                  <Ionicons name="alert-circle" size={22} color="#fff" />
                </View>
                <Text style={styles.kpiNum}>{overdueTasks}</Text>
                <Text style={styles.kpiText}>Overdue</Text>
              </View>
            </View>
          </View>

          {/* Modal pentru filtre */}
          <Modal
            transparent
            visible={filterVisible}
            animationType="fade"
            onRequestClose={() => setFilterVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.filterModal}>
                <Text style={styles.filterTitle}>Filter Tasks</Text>
                {["All", "Completed", "In Progress", "Overdue"].map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    onPress={() => handleFilterSelect(filter)}
                    style={[
                      styles.filterOption,
                      activeFilter === filter && styles.filterOptionActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        activeFilter === filter && styles.filterOptionTextActive,
                      ]}
                    >
                      {filter}
                    </Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setFilterVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Task list */}
          <View style={styles.taskListWrap}>
            <View style={styles.taskListHeader}>
              <Text style={styles.sectionTitle}>Tasks Overview</Text>
              <TouchableOpacity
                style={styles.smallAction}
                onPress={() => setFilterVisible(true)}
              >
                <Ionicons name="filter" size={16} color="#2962FF" />
                <Text style={styles.smallActionText}>Filter</Text>
              </TouchableOpacity>
            </View>

            {tasks.length === 0 ? (
              <View style={styles.emptyRow}>
                <Text style={styles.emptyText}>No tasks available</Text>
              </View>
            ) : (
              tasks.map((task, idx) => (
                <View key={idx} style={styles.taskCard}>
                  <View style={styles.taskTopRow}>
                    <View style={styles.taskTitleWrap}>
                      <Text style={styles.taskTitle}>{task.name}</Text>
                      <Text style={styles.taskDept}>{task.department}</Text>
                    </View>

                    <View style={styles.taskActions}>
                      <TouchableOpacity
                        style={styles.iconAction}
                        onPress={() => openEditModal(idx)}
                      >
                        <Ionicons name="pencil" size={16} color="#374151" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.iconAction, { marginLeft: 8 }]}
                        onPress={() => {
                          // quick mark done toggle example
                          const updated = [...tasks];
                          updated[idx] = { ...updated[idx], progress: 100 };
                          setTasks(updated);
                        }}
                      >
                        <Ionicons name="checkmark" size={16} color="#10B981" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${task.progress ?? 0}%` }]} />
                  </View>

                  <View style={styles.taskBottomRow}>
                    <Text style={styles.taskProgressLabel}>{task.progress ?? 0}%</Text>
                    <Text style={styles.taskNote} numberOfLines={2}>
                      {task.description ?? ""}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Edit modal */}
      <Modal visible={editModalVisible} transparent animationType="slide" onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Task Note</Text>
            <Text style={styles.modalTaskName}>
              {selectedTaskIndex !== null ? tasks[selectedTaskIndex]?.name : ""}
            </Text>

            <TextInput
              style={styles.modalInput}
              value={taskNote}
              onChangeText={setTaskNote}
              multiline
              placeholder="Write important details for this task"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.modalButtonGhost}>
                <Text style={styles.modalButtonGhostText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveTaskNote} style={styles.modalButtonPrimary}>
                <Text style={styles.modalButtonPrimaryText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}




const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FB" },
  scrollContainer: { paddingBottom: 120 },

  /* HEADER */
  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 44 : 20,
    paddingBottom: 18,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 12,
    elevation: 6,
  },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleWrap: { flex: 1, paddingHorizontal: 12, alignItems: "center" },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "800", textAlign: "center" },
  headerSubtitle: { color: "rgba(255,255,255,0.85)", fontSize: 13, marginTop: 4, textAlign: "center" },

  topKpiRow: { flexDirection: "row", marginTop: 14, justifyContent: "space-between", gap: 8 },
  topKpi: { flex: 1, alignItems: "center" },
  topKpiLabel: { color: "rgba(255,255,255,0.85)", fontSize: 12 },
  topKpiValue: { color: "#fff", fontSize: 16, fontWeight: "800", marginTop: 6 },

  /* CONTENT WRAP */
  contentWrap: { paddingHorizontal: 14 },

  /* ROW: left progress + right kpis */
  row: { flexDirection: "row", marginTop: 6, gap: 12 },

  /* Progress card */
  progressCard: {
    flex: 1.1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  ringWrap: { marginTop: 12, alignItems: "center", justifyContent: "center" },
  ringOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#F3F4F6",
    overflow: "hidden",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  ringFill: {
    width: "100%",
    backgroundColor: "#7C3AED",
  },
  ringLabel: {
    position: "absolute",
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  progressHint: { marginTop: 10, fontSize: 13, color: "#6B7280", textAlign: "center" },

  /* KPI column */
  kpiColumn: { flex: 0.9, justifyContent: "space-between", paddingLeft: 4 },
  kpiCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    alignItems: "flex-start",
    elevation: 2,
  },
  kpiCardPrimary: {
    backgroundColor: "#40d58fff",
  },
  kpiCardAccent: {
    backgroundColor: "#5dbcffff",
  },
  kpiCardWarn: {
    backgroundColor: "#26A69A",
  },
  kpiIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  kpiNum: { color: "#fff", fontSize: 20, fontWeight: "800", marginTop: 8 },
  kpiText: { color: "rgba(255,255,255,0.95)", fontSize: 13, marginTop: 2 },

  /* Task list */
  taskListWrap: { marginTop: 18, marginBottom: 60 },
  taskListHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  smallAction: { flexDirection: "row", alignItems: "center", gap: 8 },
  smallActionText: { color: "#2962FF", marginLeft: 6, fontWeight: "700" },

  taskCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  taskTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  taskTitleWrap: { maxWidth: "70%" },
  taskTitle: { fontSize: 15, fontWeight: "800", color: "#0F172A" },
  taskDept: { color: "#6B7280", marginTop: 4, fontSize: 12 },

  taskActions: { flexDirection: "row", alignItems: "center" },
  iconAction: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  progressBar: {
    backgroundColor: "#F3F4F6",
    height: 10,
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 10,
  },
  progressFill: { height: "100%", backgroundColor: "#255393ff" },

  taskBottomRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, alignItems: "center" },
  taskProgressLabel: { color: "#374151", fontWeight: "700" },
  taskNote: { color: "#6B7280", maxWidth: "80%", textAlign: "right", fontSize: 12 },

  emptyRow: { padding: 30, alignItems: "center" },
  emptyText: { color: "#9CA3AF", fontStyle: "italic" },

  /* Modal */
  modalOverlay: { flex: 1, backgroundColor: "rgba(2,6,23,0.5)", justifyContent: "center", alignItems: "center" },
  modalBox: { width: "88%", backgroundColor: "#fff", borderRadius: 14, padding: 16, elevation: 6 },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#0F172A" },
  modalTaskName: { color: "#6B7280", marginTop: 6, marginBottom: 10 },
  modalInput: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EEF2FF",
    minHeight: 90,
    padding: 10,
    textAlignVertical: "top",
    color: "#0F172A",
    backgroundColor: "#FAFBFF",
  },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 12, gap: 12 },
  modalButtonGhost: { paddingHorizontal: 14, paddingVertical: 10 },
  modalButtonGhostText: { color: "#6B7280", fontWeight: "700" },
  modalButtonPrimary: { backgroundColor: "#4FC3F7", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  modalButtonPrimaryText: { color: "#fff", fontWeight: "800" },

  //FILTRARE MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  filterModal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 25,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2962FF",
    marginBottom: 12,
  },
  filterOption: {
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 4,
  },
  filterOptionActive: {
    backgroundColor: "#EEF2FF",
  },
  filterOptionText: {
    fontSize: 16,
    color: "#374151",
  },
  filterOptionTextActive: {
    color: "#2962FF",
    fontWeight: "600",
  },
  closeButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#2962FF",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
