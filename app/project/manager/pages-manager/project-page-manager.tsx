import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CalendarComponent from "../components-manager/calendar-component";
import OverviewNotesComponent from "../components-manager/overview-notes-component";
import StatusCards from "../components-manager/status-cards";

export default function ProjectPageManager(): React.ReactElement {
  const params = useLocalSearchParams();
  const rawId = params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

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

  const [project, setProject] = useState<Project>({
    id,
    name: `Project ${id}`,
    description: "Engineering and manufacturing timeline.",
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<
    { id: string; text: string; date: string; checked?: boolean }[]
  >([]);

  const today = dayjs();

  const departmentColors: Record<string, string> = {
    "Design Mecanic": "#ff16d4ff",
    "Design Electric": "#33C1FF",
    "Purchasing": "#004f2fff",
    "Tooling Shop": "#17e100ff",
    "Assamblare Mecanica": "#ff3333ff",
    "Assamblare Electrica": "#FF8F33",
    "Assamblare Finala": "#8F33FF",
    "Software Offline": "#008c85ff",
    "Software Debug": "#00a643ff",
    "Teste": "#3a33ffff",
    "Livrare": "#d454ffff",
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
      return [
        ...updated.filter((n) => !n.checked),
        ...updated.filter((n) => n.checked),
      ];
    });
  }

  const inProgress = tasks.filter(
    (t) => dayjs(t.deadline).isAfter(today) && !t.done
  );
  const pastDue = tasks.filter(
    (t) => dayjs(t.deadline).isBefore(today) && !t.done
  );
  const done = tasks.filter((t) => t.done);

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔷 UN SINGUR HEADER COMPLET */}
      <LinearGradient
        colors={["#2962FF", "#4FC3F7"]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.headerGradient}
      >
        {/* 🔹 Toolbarul: meniul, back și refresh în linie */}
        <View style={styles.toolbarRow}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Ionicons name="menu" size={20} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() =>
                router.push(
                  "/project/manager/pages-manager/manager-log-page"
                )
              }
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              /* refresh logic if needed */
            }}
          >
            <Ionicons name="refresh" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* 🔹 Titlu + Descriere proiect */}
        <View style={styles.headerRow}>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>{project.name}</Text>
            <Text style={styles.headerSubtitle}>{project.description}</Text>
          </View>
        </View>

        {/* 🔹 KPI-uri */}
        <View style={styles.headerKpiRow}>
          <View style={styles.headerKpi}>
            <Text style={styles.headerKpiLabel}>Total Tasks</Text>
            <Text style={styles.headerKpiValue}>{tasks.length}</Text>
          </View>
          <View style={styles.headerKpi}>
            <Text style={styles.headerKpiLabel}>In Progress</Text>
            <Text style={styles.headerKpiValue}>{inProgress.length}</Text>
          </View>
          <View style={styles.headerKpi}>
            <Text style={styles.headerKpiLabel}>Completed</Text>
            <Text style={styles.headerKpiValue}>{done.length}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* 🔷 CONȚINUTUL PRINCIPAL */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <OverviewNotesComponent
          project={project}
          tasks={tasks}
          notes={notes}
          onAddNote={(note) => setNotes((prev) => [note, ...prev])}
          onEditNote={(noteId, newText) =>
            setNotes((prev) =>
              prev.map((n) =>
                n.id === noteId ? { ...n, text: newText } : n
              )
            )
          }
          onToggleNoteChecked={toggleNoteChecked}
          onAnalyticsPress={() =>
            router.push("/project/manager/pages-manager/analytics-page")
          }
          onOpenTaskSheet={() =>
            router.push(
              "/project/manager/pages-manager/microsoft-assistant-page"
            )
          }
        />

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

        <View style={styles.section}>
          <StatusCards
            pastDue={pastDue}
            inProgress={inProgress}
            done={done}
            departmentColors={departmentColors}
            textColorForBg={textColorForBg}
            onMarkDone={(taskId) =>
              setTasks((prev) =>
                prev.map((t) =>
                  t.id === taskId ? { ...t, done: true } : t
                )
              )
            }
            onEditTask={(taskId) => {
              const idx = tasks.findIndex((t) => t.id === taskId);
              if (idx >= 0) {
                // edit logic here
              }
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 🔷 STYLES
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FB" },
  scrollContainer: { paddingBottom: 120, paddingHorizontal: 14 },

  /* TOOLBAR ROW */
  toolbarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleWrap: { alignItems: "center" },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "800" },
  headerSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },

  headerKpiRow: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "space-between",
    gap: 8,
  },
  headerKpi: { flex: 1, alignItems: "center" },
  headerKpiLabel: { color: "rgba(255,255,255,0.9)", fontSize: 12 },
  headerKpiValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 6,
  },

  /* SECTIONS */
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 10,
  },
});
