import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BurgerMenu from "./burger-menu-manager";
import { useState } from "react";

export default function DepartmentsPage() {
  const params = useLocalSearchParams();
  const department = String(params.department || "All Departments");
  const [open, setOpen] = useState(false);

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

  const deptProgress = React.useMemo(() => {
    if (!matchingProjects || matchingProjects.length === 0) return 0;
    const total = matchingProjects.reduce((acc, p) => acc + (Number(p.progress) || 0), 0);
    return Math.round(total / matchingProjects.length);
  }, [matchingProjects]);

  const overall = React.useMemo(() => {
    if (!incomingProjects || incomingProjects.length === 0) return 0;
    const total = incomingProjects.reduce((acc, p) => acc + (Number(p.progress) || 0), 0);
    return Math.round(total / incomingProjects.length);
  }, [incomingProjects]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F7FB" }}>
      {/* Toolbar */}
      <LinearGradient
        colors={["#2962FF", "#4FC3F7"]}
        start={[0, 0]}
        end={[1, 1]}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        {/* Stânga: burger + back */}
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{ padding: 6, marginRight: 8 }}
            onPress={() => setOpen(true)}
            activeOpacity={0.6}
          >
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ padding: 6 }}
            onPress={() => router.back()}
            activeOpacity={0.6}
          >
            <Ionicons name="arrow-back" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Dreapta: refresh */}
        <TouchableOpacity style={{ padding: 6 }} onPress={() => { }} activeOpacity={0.6}>
          <Ionicons name="refresh" size={18} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Overlay burger */}
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

      {/* Burger Menu */}
      {open && <BurgerMenu closeMenu={() => setOpen(false)} />}

      {/* Header dedesubt */}
      <LinearGradient
        colors={["#2962FF", "#4FC3F7"]}
        start={[0, 0]}
        end={[1, 0]}
        style={{ paddingHorizontal: 16, paddingVertical: 12 }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Ionicons name="business-outline" size={26} color="#fff" />
          <Text style={{ fontSize: 24, fontWeight: "700", color: "#fff" }}>{department}</Text>
        </View>
        <Text style={{ fontSize: 14, color: "#D0D4FF" }}>{sampleMembers.length} team members</Text>

        {/* Linia separatoare */}
        <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.3)", marginVertical: 8 }} />

        {/* KPI-uri */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {[
            { key: "deptProgress", label: "Dept Progress", value: deptProgress ?? 0 },
            { key: "deadline", label: "Deadline", value: "N/A" },
            { key: "overall", label: "Overall", value: overall ?? 0 },
          ].map((item) => (
            <TouchableOpacity
              key={item.key}
              onPress={() => setSortMode(item.key as any)}
              activeOpacity={0.6}
              style={{ alignItems: "center", paddingVertical: 6 }}
            >
              <Text style={{ fontSize: 12, fontWeight: "500", color: "#fff" }}>{item.label}</Text>
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#fff" }}>{item.value}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {/* Restul listei de proiecte */}
      <FlatList
        data={sortedProjects}
        keyExtractor={(p) => String(p.id)}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 40, color: "#999" }}>No projects for this department</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              borderRadius: 14,
              padding: 14,
              marginBottom: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              elevation: 3,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
            }}
            onPress={() => router.push({ pathname: `/project/manager/pages-manager/project-page-manager`, params: { id: item.id } } as any)}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#1b18b6" }}>{item.name}</Text>
              <Text style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
                <Ionicons name="calendar-outline" size={14} color="#666" /> {item.deadline ?? "No deadline"}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end", width: 80 }}>
              <Text style={{ fontWeight: "700", color: "#1b18b6", marginBottom: 4 }}>{item.progress ?? 0}%</Text>
              <View style={{ height: 6, width: "100%", backgroundColor: "#E6E8FF", borderRadius: 4, overflow: "hidden" }}>
                <View style={{ height: "100%", backgroundColor: "#1b18b6", width: `${item.progress ?? 0}%`, borderRadius: 4 }} />
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
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  // Toolbar gradient
  toolbarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 2,
  },

  iconButton: {
    padding: 6,
    borderRadius: 4,
  },

  // Header gradient dedesubt toolbar
  headerGradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  // Header title block
  headerTitleBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },

  memberCount: {
    fontSize: 14,
    color: "#D0D4FF",
  },

  // Sort row
  sortRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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

  sortActive: {
    backgroundColor: "#1b18b6",
  },

  sortText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1b18b6",
  },

  sortTextActive: {
    color: "#fff",
  },

  // Project cards
  projectCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  projectName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1b18b6",
  },

  projectMeta: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },

  progressContainer: {
    alignItems: "flex-end",
    width: 80,
  },

  progressText: {
    fontWeight: "700",
    color: "#1b18b6",
    marginBottom: 4,
  },

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

  // Empty list text
  empty: {
    color: "#999",
    textAlign: "center",
    marginTop: 40,
  },

  // Back button
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  backText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600",
  },
});
