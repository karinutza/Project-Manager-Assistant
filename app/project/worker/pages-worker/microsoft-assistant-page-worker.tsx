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

import Toolbar from "../components-worker/toolbar-worker";

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

  const dayWidth = 10;
  const chartWidth = totalDays * dayWidth + 100;
  const screenWidth = Dimensions.get("window").width;

  return (
    <SafeAreaView style={styles.container}>
      <Toolbar />

      <Text style={styles.pageTitle}>📊 Project Gantt Planner</Text>

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

        {/* RIGHT GANTT CHART */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={[styles.chartArea, { width: Math.max(chartWidth, screenWidth - 320) }]}>
            {/* Month Headers */}
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
              const barColor = ["#4D96FF", "#00C9A7", "#FF6B6B", "#3B82F6", "#FACC15"][index % 5];
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EEF3F9", paddingHorizontal: 12 },
  pageTitle: { fontSize: 20, fontWeight: "700", color: "#0F172A", marginVertical: 12, paddingLeft: 4 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  backButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#1b18b6", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 8 },
  backButtonText: { color: "#fff", marginLeft: 8, fontWeight: "600" },

  leftPanel: {
    width: 320,
    borderRightWidth: 1,
    borderRightColor: "#E2E8F0",
    backgroundColor: "#FAFAFA",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#E9EEF6",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#CBD5E1",
  },
  headerText: { fontWeight: "700", fontSize: 13, color: "#334155" },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    backgroundColor: "#fff",
  },
  cell: { fontSize: 13, color: "#334155" },
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
    boxShadow: "0px 2px 8px rgba(0,0,0,0.10)",
  },
  barLabel: { color: "#fff", fontSize: 11, fontWeight: "600" },
});
