import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DepartmentsPage() {
  const params = useLocalSearchParams();
  const department = String(params.department || "All Departments");

  const [sortMode, setSortMode] = React.useState<'deptProgress' | 'deadline' | 'overall'>('deptProgress');

  // Mock data (until real backend connects)
  const sampleMembers = [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" },
    { id: "3", name: "Carla" },
  ];

  let incomingProjects: Array<any> = [];
  try {
    if (params.projects) {
      const parsed = JSON.parse(decodeURIComponent(String(params.projects)));
      if (Array.isArray(parsed)) incomingProjects = parsed;
    }
  } catch (e) {
    incomingProjects = [];
  }

  const matchingProjects = incomingProjects.filter((p) => {
    if (!department || department === "All Departments") return true;
    if (Array.isArray(p.departments) && p.departments.includes(department)) return true;
    if (p.department && p.department === department) return true;
    return false;
  });

  const sortedProjects = React.useMemo(() => {
    const copy = [...matchingProjects];
    if (sortMode === "deptProgress") {
      return copy.sort((a, b) => (Number(b.progress) || 0) - (Number(a.progress) || 0));
    }
    if (sortMode === "deadline") {
      return copy.sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
    }
    return copy.sort((a, b) => (Number(b.progress) || 0) - (Number(a.progress) || 0));
  }, [matchingProjects, sortMode]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#1b18b6", "#3c38c0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleBlock}>
          <Ionicons name="business-outline" size={26} color="#fff" />
          <Text style={styles.title}>{department}</Text>
        </View>
        <Text style={styles.memberCount}>{sampleMembers.length} team members</Text>
      </LinearGradient>

      {/* Sort Controls */}
      <View style={styles.sortRow}>
        {[
          { key: "deptProgress", label: "Dept Progress", icon: "trending-up" },
          { key: "deadline", label: "Deadline", icon: "calendar" },
          { key: "overall", label: "Overall", icon: "bar-chart" },
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.sortButton,
              sortMode === item.key ? styles.sortActive : null,
            ]}
            onPress={() => setSortMode(item.key as any)}
          >
            <Ionicons
              name={item.icon as any}
              size={16}
              color={sortMode === item.key ? "#fff" : "#1b18b6"}
            />
            <Text
              style={[
                styles.sortText,
                sortMode === item.key ? styles.sortTextActive : null,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Project List */}
      <FlatList
        data={sortedProjects}
        keyExtractor={(p) => String(p.id)}
        ListEmptyComponent={
          <Text style={styles.empty}>No projects for this department</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.projectCard}
            onPress={() =>
              router.push({
                pathname: `/project/ProjectPage`,
                params: { id: item.id },
              } as any)
            }
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.projectName}>{item.name}</Text>
              <Text style={styles.projectMeta}>
                <Ionicons name="calendar-outline" size={14} color="#666" />{" "}
                {item.deadline ?? "No deadline"}
              </Text>
            </View>
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>{item.progress ?? 0}%</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${item.progress ?? 0}%` },
                  ]}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FB" },
  header: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
  },
  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  backText: { color: "#fff", marginLeft: 6, fontWeight: "600" },
  headerTitleBlock: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 24, fontWeight: "700", color: "#fff" },
  memberCount: { color: "#D0D4FF", marginTop: 6, fontSize: 14 },
  sortRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    elevation: 1,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sortActive: { backgroundColor: "#1b18b6" },
  sortText: { color: "#1b18b6", fontWeight: "600", fontSize: 13 },
  sortTextActive: { color: "#fff" },
  projectCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 3,
    boxShadow: "0px 2px 8px rgba(0,0,0,0.10)",
  },
  projectName: { fontSize: 16, fontWeight: "700", color: "#1b18b6" },
  projectMeta: { fontSize: 13, color: "#666", marginTop: 4 },
  progressContainer: { alignItems: "flex-end", width: 80 },
  progressText: { fontWeight: "700", color: "#1b18b6", marginBottom: 4 },
  progressBar: {
    height: 6,
    width: "100%",
    backgroundColor: "#E6E8FF",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1b18b6",
    borderRadius: 4,
  },
  empty: { color: "#999", textAlign: "center", marginTop: 40 },
});
