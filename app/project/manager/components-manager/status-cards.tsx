// components-manager/status-cards.tsx
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Task = {
  id?: string;
  name: string;
  departments: string[];
  color: string;
  deadline: string;
  createdAt: string;
  done?: boolean;
  progress?: number;
  startDate?: string;
  cost?: number;
};

type Props = {
  pastDue: Task[];
  inProgress: Task[];
  done: Task[];
  departmentColors: Record<string, string>;
  textColorForBg: (hex: string) => string;
  onMarkDone?: (taskId?: string) => void;
  onEditTask?: (taskId?: string) => void;
};

export default function StatusCards({
  pastDue,
  inProgress,
  done,
  departmentColors,
  textColorForBg,
  onMarkDone,
  onEditTask,
}: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filteredPastDue, setFilteredPastDue] = useState<Task[]>([]);
  const [filteredInProgress, setFilteredInProgress] = useState<Task[]>([]);
  const [filteredDone, setFilteredDone] = useState<Task[]>([]);

  useEffect(() => {
    const today = dayjs();

    setFilteredPastDue(
      pastDue.filter((t) => {
        const deadlineDate = dayjs(t.deadline);
        return deadlineDate.isBefore(today) && !t.done;
      })
    );

    setFilteredInProgress(
      inProgress.filter((t) => {
        const deadlineDate = dayjs(t.deadline);
        return deadlineDate.isAfter(today) && !t.done;
      })
    );

    setFilteredDone(done.filter((t) => t.done === true));
  }, [pastDue, inProgress, done]);

  const openOptions = (task: Task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const closeOptions = () => {
    setModalVisible(false);
    setSelectedTask(null);
  };

  const handleMarkDone = () => {
    if (onMarkDone && selectedTask) onMarkDone(selectedTask.id);
    closeOptions();
  };

  const handleEditTask = () => {
    if (onEditTask && selectedTask) onEditTask(selectedTask.id);
    closeOptions();
  };

  const renderList = (items: Task[]) => {
    if (!items || items.length === 0)
      return <Text style={styles.emptyText}>No tasks</Text>;

    return (
      <ScrollView style={styles.list} nestedScrollEnabled>
        {items.map((task) => {
          const dept = task.departments[0];
          const color = dept ? departmentColors[dept] : "#2962FF";
          const textColor = textColorForBg(color);
          return (
            <TouchableOpacity
              key={task.id ?? task.name}
              onPress={() => openOptions(task)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[`${color}EE`, `${color}AA`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.taskCard}
              >
                <Text
                  style={[styles.taskTitle, { color: textColor }]}
                  numberOfLines={1}
                >
                  {task.name}
                </Text>
                <Text
                  style={[styles.taskDept, { color: textColor }]}
                  numberOfLines={1}
                >
                  {dept}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const getColumnColor = (tasks: Task[]) => {
    if (tasks.length === 0) return "#F1F5F9";
    const dept = tasks[0].departments[0];
    return departmentColors[dept] || "#E2E8F0";
  };

  return (
    <View>
      {/* CARD CU GRADIENT */}
      <LinearGradient
        colors={["#2962FF", "#4FC3F7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>Task Overview</Text>
        <Text style={styles.headerSubtitle}>
          Track deadlines, progress, and completed tasks.
        </Text>
      </LinearGradient>

      <View style={styles.row}>
        {/* PAST DUE */}
        <View
          style={[
            styles.col,
            { backgroundColor: `${getColumnColor(filteredPastDue)}15` },
          ]}
        >
          <Text style={[styles.colTitle, { color: "#E53935" }]}>🔴 Past Due</Text>
          {renderList(filteredPastDue)}
        </View>

        {/* IN PROGRESS */}
        <View
          style={[
            styles.col,
            { backgroundColor: `${getColumnColor(filteredInProgress)}15` },
          ]}
        >
          <Text style={[styles.colTitle, { color: "#2962FF" }]}>
            🔵 In Progress
          </Text>
          {renderList(filteredInProgress)}
        </View>

        {/* DONE */}
        <View
          style={[
            styles.col,
            { backgroundColor: `${getColumnColor(filteredDone)}15` },
          ]}
        >
          <Text style={[styles.colTitle, { color: "#00A86B" }]}>✅ Done</Text>
          {renderList(filteredDone)}
        </View>
      </View>

      {/* MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeOptions}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{selectedTask?.name}</Text>

            <TouchableOpacity
              style={[styles.modalButton, styles.markDone]}
              onPress={handleMarkDone}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.modalButtonText}>Mark as Done</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.editTask]}
              onPress={handleEditTask}
            >
              <Ionicons name="create-outline" size={20} color="#fff" />
              <Text style={styles.modalButtonText}>Edit Task</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancel]}
              onPress={closeOptions}
            >
              <Ionicons name="close-outline" size={20} color="#1E293B" />
              <Text style={[styles.modalButtonText, { color: "#1E293B" }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// STILURI REFINATE
const styles = StyleSheet.create({
  headerGradient: {
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  col: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    minHeight: 250,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  colTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  list: {
    maxHeight: 210,
  },
  taskCard: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  taskTitle: { fontSize: 15, fontWeight: "700" },
  taskDept: { fontSize: 13, opacity: 0.9, marginTop: 3 },

  emptyText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    fontStyle: "italic",
  },

  // Modal UI
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "88%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 18,
    textAlign: "center",
  },
  modalButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  markDone: { backgroundColor: "#00A86B" },
  editTask: { backgroundColor: "#2962FF" },
  cancel: { backgroundColor: "#E2E8F0" },
  modalButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});