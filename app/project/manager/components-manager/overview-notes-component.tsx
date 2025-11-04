import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { router } from "expo-router";
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Note = {
  id: string;
  text: string;
  date: string;
  checked?: boolean;
};

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

type Project = {
  id: string | number | undefined;
  name: string;
  description: string;
  deadline?: string;
  budget?: number;
};

type Props = {
  project: Project;
  tasks: Task[];
  notes: Note[];
  onAddNote: (note: Note) => void;
  onEditNote: (noteId: string, newText: string) => void;
  onToggleNoteChecked: (noteId: string) => void;
  onAnalyticsPress: () => void;
  onOpenTaskSheet: () => void;
};

export default function OverviewNotesComponent({
  project,
  tasks,
  notes,
  onAddNote,
  onEditNote,
  onToggleNoteChecked,
  onAnalyticsPress,
  onOpenTaskSheet,
}: Props) {
  const [noteModal, setNoteModal] = useState(false);
  const [editNoteModal, setEditNoteModal] = useState(false);
  const [noteBeingEdited, setNoteBeingEdited] = useState<{ id: string; text: string } | null>(null);
  const [newNote, setNewNote] = useState("");

  const overallProgress = tasks.length
    ? Math.round(tasks.reduce((a, t) => a + (t.progress ?? 0), 0) / tasks.length)
    : 0;

  const totalBudget = project?.budget ?? 0;
  const spent = tasks.reduce((a, t) => a + (t.cost ?? 0), 0);
  const remaining = Math.max(0, totalBudget - spent);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* PROJECT STATS */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>📊 Overview</Text>
          <TouchableOpacity
            onPress={() =>
              router.push("/project/manager/pages-manager/detailed-overview-page")
            }
          >
            <Ionicons name="information-circle-outline" size={22} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="calendar-outline" size={22} color="#6366f1" />
            <Text style={styles.statText}>{project.deadline ?? "No deadline"}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="cash-outline" size={22} color="#16a34a" />
            <Text style={styles.statText}>{remaining} € left</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="bar-chart-outline" size={22} color="#0ea5e9" />
            <Text style={styles.statText}>{overallProgress}%</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[styles.progressBarFill, { width: `${overallProgress}%` }]}
            />
          </View>
        </View>
      </View>

      {/* ACTIONS */}
      <View style={styles.card}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#3b82f6" }]}
          onPress={onAnalyticsPress}
        >
          <Ionicons name="stats-chart" size={20} color="#fff" />
          <Text style={styles.actionText}>View Analytics</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#10b981" }]}
          onPress={onOpenTaskSheet}
        >
          <Ionicons name="briefcase-outline" size={20} color="#fff" />
          <Text style={styles.actionText}>Manage Tasks</Text>
        </TouchableOpacity>
      </View>

      {/* TASKS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📝 Tasks</Text>
        {tasks.length === 0 ? (
          <Text style={styles.emptyText}>No tasks yet.</Text>
        ) : (
          tasks.map((t) => (
            <View key={t.id ?? t.name} style={styles.taskItem}>
              <Ionicons
                name={t.done ? "checkmark-circle" : "ellipse-outline"}
                size={22}
                color={t.done ? "#10b981" : "#cbd5e1"}
              />
              <Text style={[styles.taskText, t.done && styles.taskDone]}>
                {t.name}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* NOTES */}
      <View style={[styles.card, { marginBottom: 0 }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>🗒️ Notes</Text>
          <TouchableOpacity onPress={() => setNoteModal(true)}>
            <Ionicons name="add-circle" size={28} color="#6366f1" />
          </TouchableOpacity>
        </View>

        {notes.slice(0, 5).map((n) => (
          <View key={n.id} style={styles.noteItem}>
            <View style={styles.noteRow}>
              <Text style={[styles.noteText, n.checked && styles.noteChecked]}>
                {n.text}
              </Text>
              <View style={styles.noteActions}>
                <TouchableOpacity
                  onPress={() => {
                    setNoteBeingEdited(n);
                    setEditNoteModal(true);
                  }}
                >
                  <Ionicons name="create-outline" size={20} color="#6366f1" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onToggleNoteChecked(n.id)}>
                  <Ionicons
                    name={n.checked ? "checkmark-circle" : "ellipse-outline"}
                    size={22}
                    color={n.checked ? "#10b981" : "#cbd5e1"}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.noteDate}>{n.date}</Text>
          </View>
        ))}
      </View>

      {/* NOTE MODAL */}
      <Modal
        visible={noteModal}
        transparent
        animationType="slide"
        onRequestClose={() => setNoteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Note</Text>
            <TextInput
              placeholder="Write a note..."
              style={styles.modalInput}
              multiline
              value={newNote}
              onChangeText={setNewNote}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => {
                  setNewNote("");
                  setNoteModal(false);
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (!newNote.trim()) return setNoteModal(false);
                  const note = {
                    id: `${Date.now()}`,
                    text: newNote.trim(),
                    date: new Date().toISOString().split("T")[0],
                  };
                  onAddNote(note);
                  setNewNote("");
                  setNoteModal(false);
                }}
              >
                <Text style={styles.saveText}>Save Note</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* EDIT NOTE MODAL */}
      <Modal
        visible={editNoteModal}
        transparent
        animationType="slide"
        onRequestClose={() => setEditNoteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Note</Text>
            <TextInput
              style={styles.modalInput}
              multiline
              value={noteBeingEdited?.text || ""}
              onChangeText={(text) =>
                setNoteBeingEdited((prev) => (prev ? { ...prev, text } : null))
              }
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setEditNoteModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (noteBeingEdited) {
                    onEditNote(noteBeingEdited.id, noteBeingEdited.text);
                    setEditNoteModal(false);
                  }
                }}
              >
                <Text style={styles.saveText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 0 },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 24,
    padding: 20,
    marginBottom: 22,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    alignItems: "center",
  },
  cardTitle: { fontWeight: "700", fontSize: 18, color: "#1e293b" },
  statsRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10 },
  statItem: { alignItems: "center" },
  statText: { fontSize: 14, color: "#334155", marginTop: 4 },
  progressContainer: { marginTop: 10 },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 8,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  actionText: { color: "#fff", fontWeight: "600", marginLeft: 8 },
  emptyText: { color: "#94a3b8", textAlign: "center", marginTop: 10 },
  taskItem: { flexDirection: "row", alignItems: "center", marginVertical: 6 },
  taskText: { marginLeft: 10, color: "#1e293b" },
  taskDone: { textDecorationLine: "line-through", color: "#9ca3af" },
  noteItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 8,
  },
  noteRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  noteText: { color: "#1e293b", flex: 1, marginRight: 10 },
  noteChecked: { textDecorationLine: "line-through", color: "#9ca3af" },
  noteDate: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  noteActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#1e293b", marginBottom: 10 },
  modalInput: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 10,
    minHeight: 80,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 20,
  },
  cancelText: { color: "#ef4444", fontWeight: "600" },
  saveText: { color: "#3b82f6", fontWeight: "600" },
});
