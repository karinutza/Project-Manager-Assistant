import dayjs from "dayjs";
import React, { useMemo } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Toolbar from "../components-manager/toolbar-manager";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import BurgerMenu from "./burger-menu-manager";

type Task = {
  id: number;
  name: string;
  duration: number;
  start: string;
  finish: string;
  predecessors: string;
  resources: string;
};

const TASKS: Task[] = [
  { id: 1, name: "1. Analysis", duration: 8, start: "2025-01-13", finish: "2025-01-21", predecessors: "", resources: "Mike Smith (25%)" },
  { id: 2, name: "2. Design", duration: 21, start: "2025-01-22", finish: "2025-02-12", predecessors: "1", resources: "Eric Sullivan (25%)" },
  { id: 3, name: "3. Development", duration: 21, start: "2025-02-13", finish: "2025-03-06", predecessors: "2", resources: "Sam Watson (50%)" },
  { id: 4, name: "4. Testing", duration: 17, start: "2025-03-07", finish: "2025-03-28", predecessors: "3", resources: "Sam Watson (100%)" },
  { id: 5, name: "5. Implementation", duration: 12, start: "2025-03-31", finish: "2025-04-15", predecessors: "4", resources: "John (50%)" },
  { id: 6, name: "6. Training", duration: 13, start: "2025-04-16", finish: "2025-05-02", predecessors: "5", resources: "Sam Watson (100%)" },
  { id: 7, name: "7. Documentation", duration: 12, start: "2025-05-05", finish: "2025-05-21", predecessors: "6", resources: "Mike Smith (50%)" },
];

function daysBetween(a: string, b: string) {
  const da = new Date(a).setHours(0, 0, 0, 0);
  const db = new Date(b).setHours(0, 0, 0, 0);
  return Math.round((db - da) / (1000 * 60 * 60 * 24));
}

export default function ProjectPlanner() {
  const { minStart, maxFinish, totalDays } = useMemo(() => {
    const starts = TASKS.map((t) => dayjs(t.start).valueOf());
    const finishes = TASKS.map((t) => dayjs(t.finish).valueOf());
    const min = dayjs(Math.min(...starts));
    const max = dayjs(Math.max(...finishes));
    const total = daysBetween(min.format("YYYY-MM-DD"), max.format("YYYY-MM-DD"));
    return { minStart: min, maxFinish: max, totalDays: total };
  }, []);

  const totalDuration = TASKS.reduce((acc, t) => acc + t.duration, 0);
  const screenWidth = Dimensions.get("window").width;
  const dayWidth = 10;
  const chartWidth = totalDays * dayWidth + 100;
  const [open, setOpen] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Wrapper general */}
      <View style={{ position: "relative" }}>

        {/* HEADER TOOLBAR */}
        <LinearGradient
          colors={["#2962FF", "#4FC3F7"]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.toolbarContainer}
        >
          {/* Grup stânga: burger + back */}
          <View style={{ flexDirection: "row" }}>
            {/* BUTON BURGER */}
            <TouchableOpacity
              style={[styles.iconButton, { marginRight: 8 }]} // padding între burger și back
              onPress={() => setOpen(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="menu" size={24} color="#fff" />
            </TouchableOpacity>

            {/* BACK */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push("/project/manager/pages-manager/project-page-manager")}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Grup dreapta: refresh */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => { }}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={18} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        {/* OVERLAY PENTRU ÎNCHIDERE BURGER */}
        {open && (
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "transparent",
              zIndex: 1,
            }}
            activeOpacity={1}
            onPress={() => setOpen(false)}
          />
        )}

        {/* MENIUL BURGER */}
        {open && <BurgerMenu closeMenu={() => setOpen(false)} />}

        {/* HEADER */}
        <LinearGradient
          colors={["#2962FF", "#4FC3F7"]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.headerGradient}
        >
          <View style={styles.headerRow}>
            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerTitle}>Project Gantt Planner</Text>
              <Text style={styles.headerSubtitle}>Visual project timeline overview</Text>
            </View>

            <View style={{ width: 40 }} />
          </View>

          {/* KPI Row */}
          <View style={styles.topKpiRow}>
            <View style={styles.topKpi}>
              <Text style={styles.topKpiLabel}>Total Tasks</Text>
              <Text style={styles.topKpiValue}>{TASKS.length}</Text>
            </View>
            <View style={styles.topKpi}>
              <Text style={styles.topKpiLabel}>Total Duration</Text>
              <Text style={styles.topKpiValue}>{totalDuration} days</Text>
            </View>
            <View style={styles.topKpi}>
              <Text style={styles.topKpiLabel}>Timeline</Text>
              <Text style={styles.topKpiValue}>
                {dayjs(minStart).format("MMM D")} – {dayjs(maxFinish).format("MMM D")}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>


      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* CONTENT CARD */}
        <View style={styles.contentWrap}>
          <View style={styles.card}>
            {/* LEFT TABLE */}
            <View style={styles.leftPanel}>
              <View style={styles.tableHeader}>
                <Text style={[styles.headerText, { flex: 1 }]}>Task</Text>
                <Text style={[styles.headerText, { width: 60 }]}>Dur.</Text>
                <Text style={[styles.headerText, { width: 80 }]}>Start</Text>
                <Text style={[styles.headerText, { width: 80 }]}>Finish</Text>
              </View>

              <ScrollView>
                {TASKS.map((task) => (
                  <View key={task.id} style={styles.tableRow}>
                    <Text style={[styles.cell, { flex: 1 }]} numberOfLines={1}>
                      {task.name}
                    </Text>
                    <Text style={[styles.cell, { width: 60 }]}>{task.duration}d</Text>
                    <Text style={[styles.cell, { width: 80 }]}>{dayjs(task.start).format("MMM D")}</Text>
                    <Text style={[styles.cell, { width: 80 }]}>{dayjs(task.finish).format("MMM D")}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* RIGHT GANTT */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={[styles.chartArea, { width: Math.max(chartWidth, screenWidth - 320) }]}>
                {/* Month Header */}
                <View style={styles.monthHeader}>
                  {Array.from({ length: totalDays / 30 + 1 }).map((_, idx) => {
                    const month = minStart.add(idx, "month").format("MMM YYYY");
                    return (
                      <Text key={idx} style={[styles.monthText, { left: idx * 30 * dayWidth }]}>
                        {month}
                      </Text>
                    );
                  })}
                </View>

                {/* Grid Lines */}
                {Array.from({ length: totalDays }).map((_, i) => (
                  <View
                    key={i}
                    style={{
                      position: "absolute",
                      left: i * dayWidth,
                      top: 30,
                      bottom: 0,
                      width: 1,
                      backgroundColor: i % 7 === 0 ? "#E2E8F0" : "#F1F5F9",
                    }}
                  />
                ))}

                {/* Task Bars */}
                {TASKS.map((task, index) => {
                  const offsetDays = daysBetween(minStart.format("YYYY-MM-DD"), task.start);
                  const duration = daysBetween(task.start, task.finish);
                  const barColor = ["#7C3AED", "#4FC3F7", "#26A69A", "#FACC15", "#FF6B6B"][index % 5];
                  return (
                    <View key={task.id} style={[styles.barRow, { top: index * 50 + 50 }]}>
                      <View
                        style={[
                          styles.bar,
                          { left: offsetDays * dayWidth, width: duration * dayWidth, backgroundColor: barColor },
                        ]}
                      >
                        <Text style={styles.barLabel}>{task.name.replace(/^\d+\.\s*/, "")}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
        {/* SUMMARY SECTION */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Project Summary</Text>

          {/* Progress Bar */}
          <View style={styles.progressWrap}>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: "72%" }]} />
            </View>
            <Text style={styles.progressText}>72% Completed</Text>
          </View>

          {/* Stats Cards */}
          <View style={styles.summaryCards}>
            <View style={[styles.summaryCard, { backgroundColor: "#E3F2FD" }]}>
              <Ionicons name="flag-outline" size={20} color="#2962FF" />
              <Text style={styles.summaryCardLabel}>Milestones</Text>
              <Text style={styles.summaryCardValue}>5 of 7 done</Text>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: "#E8F5E9" }]}>
              <Ionicons name="people-outline" size={20} color="#26A69A" />
              <Text style={styles.summaryCardLabel}>Active Resources</Text>
              <Text style={styles.summaryCardValue}>4 Members</Text>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: "#FFF8E1" }]}>
              <Ionicons name="calendar-outline" size={20} color="#FBC02D" />
              <Text style={styles.summaryCardLabel}>Next Deadline</Text>
              <Text style={styles.summaryCardValue}>Apr 15, 2025</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FB" },
  scrollContainer: { paddingBottom: 120 },

  /*TOOLBAR*/
  toolbarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 0,
    borderBottomColor: "rgba(255,255,255,0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8
  },

  /* Header gradient */
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 12,
    elevation: 6,
  },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  iconButton: {
    width: 44,
    height: 44,
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

  /* CONTENT */
  contentWrap: { paddingHorizontal: 14 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },

  /* LEFT PANEL */
  leftPanel: {
    width: 320,
    borderRightWidth: 1,
    borderRightColor: "#E2E8F0",
    backgroundColor: "#FAFAFA",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#EEF2FF",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#CBD5E1",
  },
  headerText: { fontWeight: "700", fontSize: 13, color: "#374151" },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    backgroundColor: "#fff",
  },
  cell: { fontSize: 13, color: "#334155" },

  /* CHART AREA */
  chartArea: {
    position: "relative",
    backgroundColor: "#FFF",
    minHeight: TASKS.length * 50 + 60,
  },
  monthHeader: {
    position: "absolute",
    top: 0,
    flexDirection: "row",
    height: 30,
  },
  monthText: {
    position: "absolute",
    top: 5,
    fontSize: 11,
    fontWeight: "600",
    color: "#475569",
  },
  barRow: { position: "absolute", left: 0, height: 40, justifyContent: "center" },
  bar: {
    position: "absolute",
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  barLabel: { color: "#fff", fontSize: 11, fontWeight: "600" },
  summarySection: {
    marginTop: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 12,
  },
  progressWrap: {
    marginBottom: 16,
  },
  progressBg: {
    height: 10,
    backgroundColor: "#E2E8F0",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: 10,
    borderRadius: 6,
    backgroundColor: "#2962FF",
  },
  progressText: {
    marginTop: 6,
    fontSize: 13,
    color: "#475569",
    textAlign: "right",
  },
  summaryCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  summaryCardLabel: {
    fontSize: 13,
    color: "#374151",
    marginTop: 4,
  },
  summaryCardValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 2,
  },

});
