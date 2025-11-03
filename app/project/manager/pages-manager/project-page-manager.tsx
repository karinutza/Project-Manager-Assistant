import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Toolbar from "../components-manager/toolbar-manager";
import OverviewNotesComponent from "../components-manager/overview-notes-component";
import StatusCards from "../components-manager/status-cards";
import CalendarComponent from "../components-manager/calendar-component";

export default function ProjectPage(): React.ReactElement {
  const params = useLocalSearchParams();
  const rawId = params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  type Task = {
    name: string;
    departments: string[];
    color: string;
    deadline: string;
    createdAt: string;
    done?: boolean;
    progress?: number;
    id?: string;
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

  const [project, setProject] = useState<Project>({
    id,
    name: `Project ${id}`,
    description: " ",
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<{ id: string; text: string; date: string; checked?: boolean }[]>([]);

  const today = dayjs();

  const departmentColors: Record<string, string> = {
    "Design Mecanic": "#ff16d4ff",
    "Design Electric": "#33C1FF",
    Purchasing: "#004f2fff",
    "Tooling Shop": "#17e100ff",
    "Assamblare Mecanica": "#ff3333ff",
    "Assamblare Electrica": "#FF8F33",
    "Assamblare Finala": "#8F33FF",
    "Software Offline": "#008c85ff",
    "Software Debug": "#00a643ff",
    Teste: "#3a33ffff",
    Livrare: "#d454ffff",
  };

  function textColorForBg(hex: string) {
    try {
      const h = (hex || "#000").replace("#", "").slice(0, 6);
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.65 ? "#000" : "#fff";
    } catch {
      return "#fff";
    }
  }

  function toggleNoteChecked(noteId: string) {
    setNotes((prev) => {
      const updated = prev.map((n) =>
        n.id === noteId ? { ...n, checked: !n.checked } : n
      );
      return [...updated.filter((n) => !n.checked), ...updated.filter((n) => n.checked)];
    });
  }

  const inProgress = tasks.filter((t) => dayjs(t.deadline).isAfter(today) && !t.done);
  const pastDue = tasks.filter((t) => dayjs(t.deadline).isBefore(today) && !t.done);
  const done = tasks.filter((t) => t.done);

  return (
    <SafeAreaView style={styles.container}>
      <Toolbar />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEADER */}
        <View style={styles.header}>
          {/* HOME BUTTON: plasat sus-stânga, cu card shadow și padding */}
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => router.push("/project/manager/pages-manager/manager-log-page")}
            activeOpacity={0.7}
          >
            <Ionicons name="home-outline" size={22} color="#fff" />
            <Text style={styles.homeButtonText}>Home</Text>
          </TouchableOpacity>

          {/* DESCRIERE PROIECT */}
          <View style={styles.projectHeaderCard}>
            <Text style={styles.projectName}>{project.name}</Text>
            <Text style={styles.projectDescription}>
              {project.description?.trim() || "No description provided for this project."}
            </Text>
          </View>
        </View>

        {/* OVERVIEW + NOTES */}
        <View style={styles.overviewContainer}>
          <OverviewNotesComponent
            project={project}
            tasks={tasks}
            notes={notes}
            onAddNote={(note) => setNotes((prev) => [note, ...prev])}
            onEditNote={(noteId, newText) =>
              setNotes((prev) =>
                prev.map((n) => (n.id === noteId ? { ...n, text: newText } : n))
              )
            }
            onToggleNoteChecked={toggleNoteChecked}
            onAnalyticsPress={() => router.push("/project/manager/pages-manager/analytics-page")}
            onOpenTaskSheet={() => router.push("/project/manager/pages-manager/microsoft-assistant-page")}
          />
        </View>

        {/* SCHEDULE / CALENDAR */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Schedule</Text>
          <CalendarComponent
            tasks={tasks}
            departmentColors={departmentColors}
            textColorForBg={textColorForBg}
            styles={styles}
            onTaskAdded={(newTask) => {
              const mapped = {
                id: `task-${Date.now()}`,
                name: newTask.name,
                departments: newTask.departments ?? [],
                color:
                  newTask.color ??
                  departmentColors[newTask.departments?.[0] ?? "General"] ??
                  "#1b18b6",
                deadline: newTask.deadline ?? today.format("YYYY-MM-DD"),
                createdAt: today.format("YYYY-MM-DD"),
                done: false,
                progress: 0,
                startDate: today.format("YYYY-MM-DD"),
              } as Task;
              setTasks((prev) => [...prev, mapped]);
            }}
          />
        </View>

        {/* STATUS CARDS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Status</Text>
          <StatusCards
            pastDue={pastDue}
            inProgress={inProgress}
            done={done}
            departmentColors={departmentColors}
            textColorForBg={textColorForBg}
            onMarkDone={(taskId) =>
              setTasks((prev) =>
                prev.map((t) => (t.id === taskId ? { ...t, done: true } : t))
              )
            }
            onEditTask={(taskId) => {
              const idx = tasks.findIndex((t) => t.id === taskId);
              if (idx >= 0) {
                // handle edit logic
              }
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f5f7" },
  scrollContent: { paddingBottom: 100, paddingHorizontal: 16 },
  
  projectHeaderCard: {
  backgroundColor: "#ffffff",
  borderRadius: 20,
  paddingVertical: 16,
  paddingHorizontal: 20, // puțin mai lat pentru text
  alignItems: "center",
  alignSelf: "center", // cardul se poziționează centrat, dar nu mai ocupă 92% din lățime
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 4,
  marginTop: 60,
  maxWidth: 500, // limitează lățimea cardului
  minWidth: 200, // să nu fie prea strâmt pe ecrane mari
},
  // HEADER
  header: { marginBottom: 28, alignItems: "center" },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366f1",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  backButtonText: { color: "#fff", fontWeight: "600", marginLeft: 8, fontSize: 16 },
  projectName: {
    fontSize: 30,
    fontWeight: "800",
    color: "#160ca8ff",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  projectDescription: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
  },

  // SECTIONS / CARDS
  section: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#1e293b",
  },

  // BUTTONS
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366f1",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonText: { color: "#fff", fontWeight: "600", marginLeft: 6 },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10b981",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryButtonText: { color: "#fff", fontWeight: "600", marginLeft: 6 },
  homeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4f46e5",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    position: "absolute",
    left: 0,
    top: 0,
    marginLeft: 16,
    marginTop: 10,
  },
  homeButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
  },
  sectionWithoutMargin: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 0, // eliminăm spațiul dintre notes și calendar
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },

  overviewContainer: {
    width: "100%", // lățime full pentru a se alinia cu celelalte secțiuni
    marginBottom: 0, // eliminăm spațiul gol dintre Notes și Calendar
  },

});
