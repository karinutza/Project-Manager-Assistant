import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { router } from "expo-router";
import {
  Animated,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
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

  type CardProps = {
    children: React.ReactNode;
    isLast?: boolean;
  };

  const Card: React.FC<CardProps> = ({ children, isLast }) => (
    <View
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: 24,
        padding: 20,
        marginBottom: isLast ? 0 : 22, // ultimul card fără spațiu
        width: "100%", // lățimea uniformă
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 6,
        backdropFilter: "blur(8px)",
      }}
    >
      {children}
    </View>
  );


  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 0,
      }}
      showsVerticalScrollIndicator={false}
    >

      {/* PROJECT STATS */}
      <Card style={{ marginBottom: 22 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 14, alignItems: "center" }}>
          <Text style={{ fontWeight: "700", fontSize: 18, color: "#1e293b" }}>📊 Overview</Text>
          <TouchableOpacity
            onPress={() => router.push("/project/manager/pages-manager/detailed-overview-page")}>
            <Ionicons name="information-circle-outline" size={22} color="#3b82f6" />
          </TouchableOpacity>
        </View>


        <View style={{ flexDirection: "row", justifyContent: "space-around", marginVertical: 10 }}>
          <View style={{ alignItems: "center" }}>
            <Ionicons name="calendar-outline" size={22} color="#6366f1" />
            <Text style={{ fontSize: 14, color: "#334155" }}>{project.deadline ?? "No deadline"}</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Ionicons name="cash-outline" size={22} color="#16a34a" />
            <Text style={{ fontSize: 14, color: "#334155" }}>{remaining} € left</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Ionicons name="bar-chart-outline" size={22} color="#0ea5e9" />
            <Text style={{ fontSize: 14, color: "#334155" }}>{overallProgress}%</Text>
          </View>
        </View>

        <View style={{ marginTop: 14 }}>
          <View
            style={{
              height: 10,
              borderRadius: 8,
              backgroundColor: "#E5E7EB",
              overflow: "hidden",
            }}
          >
            <Animated.View
              style={{
                height: "100%",
                width: `${overallProgress}%`,
                backgroundColor: "#6366f1",
                borderRadius: 8,
              }}
            />
          </View>
        </View>
      </Card>

      {/* ACTIONS */}
      <Card>
        <TouchableOpacity
          onPress={onAnalyticsPress}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#3b82f6",
            paddingVertical: 14,
            borderRadius: 16,
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <Ionicons name="stats-chart" size={20} color="#fff" />
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16, marginLeft: 6 }}>
            View Analytics
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onOpenTaskSheet}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#10b981",
            paddingVertical: 14,
            borderRadius: 16,
            justifyContent: "center",
          }}
        >
          <Ionicons name="briefcase-outline" size={20} color="#fff" />
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16, marginLeft: 6 }}>
            Manage Tasks
          </Text>
        </TouchableOpacity>
      </Card>

      {/* TASKS */}
      <Card>
        <Text style={{ fontSize: 18, fontWeight: "700", color: "#1e293b" }}>📝 Tasks</Text>
        {tasks.length === 0 ? (
          <Text style={{ color: "#94a3b8", fontStyle: "italic" }}>No tasks yet.</Text>
        ) : (
          tasks.map((t) => (
            <View
              key={t.id ?? t.name}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderColor: "#f1f5f9",
              }}
            >
              <Ionicons
                name={t.done ? "checkmark-circle" : "ellipse-outline"}
                size={22}
                color={t.done ? "#10b981" : "#cbd5e1"}
              />
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: 15,
                  color: t.done ? "#94a3b8" : "#1e293b",
                  textDecorationLine: t.done ? "line-through" : "none",
                }}
              >
                {t.name}
              </Text>
            </View>
          ))
        )}
      </Card>

      {/* NOTES */}
      <Card style={{ marginBottom: 0 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#1e293b" }}>🗒️ Notes</Text>
          <TouchableOpacity onPress={() => setNoteModal(true)}>
            <Ionicons name="add-circle" size={28} color="#6366f1" />
          </TouchableOpacity>
        </View>

        {notes.slice(0, 5).map((n) => (
          <View
            key={n.id}
            style={{
              marginTop: 10,
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderColor: "#f1f5f9",
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text
                style={{
                  fontSize: 15,
                  color: n.checked ? "#94a3b8" : "#1e293b",
                  textDecorationLine: n.checked ? "line-through" : "none",
                }}
              >
                {n.text}
              </Text>
              <View style={{ flexDirection: "row", gap: 12 }}>
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
            <Text style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>{n.date}</Text>
          </View>
        ))}
      </Card>

      {/* NOTE MODAL */}
      <Modal visible={noteModal} transparent animationType="slide" onRequestClose={() => setNoteModal(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "90%",
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 20,
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#1e293b", marginBottom: 16 }}>
              Add Note
            </Text>
            <TextInput
              placeholder="Write a note..."
              style={{
                borderWidth: 1,
                borderColor: "#e2e8f0",
                borderRadius: 12,
                padding: 12,
                minHeight: 100,
                textAlignVertical: "top",
                fontSize: 16,
                color: "#1e293b",
              }}
              multiline
              value={newNote}
              onChangeText={setNewNote}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setNewNote("");
                  setNoteModal(false);
                }}
              >
                <Text style={{ color: "#64748b", fontWeight: "600", fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (!newNote || newNote.trim() === "") return setNoteModal(false);
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
                <Text style={{ color: "#6366f1", fontWeight: "700", fontSize: 16 }}>Save Note</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* EDIT NOTE MODAL */}
      <Modal visible={editNoteModal} transparent animationType="slide" onRequestClose={() => setEditNoteModal(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "90%",
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 20,
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#1e293b", marginBottom: 16 }}>
              Edit Note
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#e2e8f0",
                borderRadius: 12,
                padding: 12,
                minHeight: 100,
                textAlignVertical: "top",
                fontSize: 16,
                color: "#1e293b",
              }}
              multiline
              value={noteBeingEdited?.text || ""}
              onChangeText={(text) => setNoteBeingEdited((prev) => (prev ? { ...prev, text } : null))}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <TouchableOpacity onPress={() => setEditNoteModal(false)}>
                <Text style={{ color: "#64748b", fontWeight: "600", fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (noteBeingEdited) {
                    onEditNote(noteBeingEdited.id, noteBeingEdited.text);
                    setEditNoteModal(false);
                  }
                }}
              >
                <Text style={{ color: "#6366f1", fontWeight: "700", fontSize: 16 }}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
