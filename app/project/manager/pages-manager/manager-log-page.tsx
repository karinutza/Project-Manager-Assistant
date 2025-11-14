// manager-log-page.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import BurgerMenu from "./burger-menu-manager";





const { width } = Dimensions.get("window");
const CARD_MARGIN = 12;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;
const calendarScale = Math.min(width / 430, 1.0);


/* Departments Section */
const departmentColors: Record<string, string> = {
  "Design Mecanic": "#40d58fff",
  "Design Electric": "#33C1FF",
  "Purchasing": "#004f2fff",
  "Tooling Shop": "#177cc4ff",
  "Assamblare Mecanica": "#26A69A",
  "Assamblare Electrica": "#5dbcffff",
  "Assamblare Finala": "#10cb80ff",
  "Software Offline": "#6292f8ff",
  "Software Debug": "#00a643ff",
  "Teste": "#308dffff",
  "Livrare": "#7def90ff",
};

const departmentIcons: Record<string, { name: string; library?: "ion" | "mci" }> = {
  "Design Mecanic": { name: "hammer-outline", library: "ion" },
  "Design Electric": { name: "flash-outline", library: "ion" },
  "Purchasing": { name: "cart-outline", library: "ion" },
  "Tooling Shop": { name: "cog-outline", library: "ion" },
  "Assamblare Mecanica": { name: "construct-outline", library: "ion" },
  "Assamblare Electrica": { name: "flashlight-outline", library: "ion" },
  "Assamblare Finala": { name: "cube-outline", library: "ion" },
  "Software Offline": { name: "code-outline", library: "ion" },
  "Software Debug": { name: "bug-outline", library: "ion" },
  "Teste": { name: "flask-outline", library: "ion" },
  "Livrare": { name: "truck-outline", library: "mci" },
};


type Project = {
  id: string;
  name: string;
  description?: string;
  image?: string;
  progress?: number;
  deadline?: string;
  color?: string;
  departments?: string[];
  department?: string;
};

const sampleProjects: Project[] = [
  {
    id: "1",
    name: "Bridge Structural Analysis",
    description: "Finite element modeling of a suspension bridge.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60",
    progress: 46,
    deadline: "2025-12-01",
    color: "#4FC3F7",
    departments: ["Design Mecanic"],
  },
  {
    id: "2",
    name: "Robotics Automation System",
    description: "Real-time robotic motion planning and AI vision.",
    image:
      "https://images.unsplash.com/photo-1581091012184-5c1b9d8f6d6e?auto=format&fit=crop&w=800&q=60",
    progress: 72,
    deadline: "2025-11-15",
    color: "#2962FF",
    departments: ["Software Debug"],
  },
  {
    id: "3",
    name: "Renewable Energy Grid",
    description: "AI-driven optimization for wind–solar balance.",
    image:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=800&q=60",
    progress: 0,
    deadline: undefined,
    color: "#A78BFA",
    departments: ["Design Electric"],
  },
  {
    id: "4",
    name: "Autonomous Vehicle Platform",
    description: "Control algorithms for self-driving systems.",
    image:
      "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?auto=format&fit=crop&w=800&q=60",
    progress: 0,
    color: "#60A5FA",
    departments: ["Software Offline"],
  },
  {
    id: "5",
    name: "Smart Building Sensors",
    description: "IoT network for energy-efficient architecture.",
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=60",
    progress: 0,
    color: "#34D399",
    departments: ["Purchasing"],
  },
  {
    id: "6",
    name: "Aerospace Simulation",
    description: "Thermal and aerodynamic testing for UAV design.",
    image:
      "https://images.unsplash.com/photo-1598300051280-4e01d97cf0d1?auto=format&fit=crop&w=800&q=60",
    progress: 12,
    deadline: "2026-01-10",
    color: "#00C9A7",
    departments: ["Teste"],
  },
];

export default function ManagerLogPage(): React.ReactElement {
  const params = useLocalSearchParams();
  const [projects, setProjects] = useState<Project[]>(sampleProjects);

  // keep compatibility with previous update flow
  useEffect(() => {
    if (params.updatedProject) {
      try {
        const upd = JSON.parse(decodeURIComponent(String(params.updatedProject)));
        setProjects((prev) =>
          prev.map((p) => (String(p.id) === String(upd.id) ? { ...p, ...upd } : p))
        );
        router.replace({ pathname: "/" } as any);
      } catch {
        // ignore
      }
    }
  }, [params.updatedProject]);

  // Derived departments (fallback list included)
  const derivedDepartments = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (Array.isArray(p.departments)) p.departments.forEach((d) => set.add(d));
      if (p.department) set.add(p.department);
    });
    return set.size > 0
      ? Array.from(set)
      : [
        "Design Mecanic",
        "Design Electric",
        "Purchasing",
        "Tooling Shop",
        "Assamblare Mecanica",
        "Assamblare Electrica",
        "Assamblare Finala",
        "Software Offline",
        "Software Debug",
        "Teste",
        "Livrare",
      ];
  }, [projects]);

  const [open, setOpen] = useState(false);


  // KPIs
  const progressPercent = projects.length
    ? Math.round(projects.reduce((acc, t) => acc + (t.progress ?? 0), 0) / projects.length)
    : 0;
  const completedTasks = projects.filter((p) => (p.progress ?? 0) === 100).length;
  const inProgress = projects.filter((p) => (p.progress ?? 0) > 0 && (p.progress ?? 0) < 100).length;

  // calendar marked dates (dots)
  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};
    projects.forEach((p) => {
      if (!p.deadline) return;
      if (!marks[p.deadline]) marks[p.deadline] = { dots: [] };
      marks[p.deadline].dots.push({ key: p.id, color: p.color || "#2962FF" });
    });
    // highlight today
    const today = dayjs().format("YYYY-MM-DD");
    marks[today] = { ...(marks[today] || {}), selected: true, selectedColor: "#E8F6FF" };
    return marks;
  }, [projects]);

  // Render single project card (uniform: always show progress bar)
  const renderProject = ({ item }: { item: Project }) => {
    const safePercent = Math.max(0, Math.min(100, Number(item.progress ?? 0)));
    return (
      <Link href={`/project/manager/pages-manager/project-page-manager?id=${item.id}`} asChild>
        <TouchableOpacity style={styles.card} activeOpacity={0.9}>
          <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.cardDescription} numberOfLines={2}>
              {item.description}
            </Text>

            <View style={styles.cardMetaRow}>
              <Text style={styles.deadlineSmall}>{item.deadline ? `Deadline: ${item.deadline}` : "No deadline"}</Text>
              <Text style={styles.percentSmall}>{safePercent}%</Text>
            </View>

            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${safePercent}%`, backgroundColor: item.color || "#4FC3F7" }]} />
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

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
          {/* BUTON BURGER */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setOpen(true)}
          >
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>

          {/* REFRESH */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => { }}
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

        {/* MENIUL, SCOAS DIN TOOLBAR */}
        {open && (
          <BurgerMenu closeMenu={() => setOpen(false)} />
        )}

        {/* HEADER GRADIENT DE DEDESUBT */}
        <LinearGradient
          colors={["#2962FF", "#4FC3F7"]}
          start={[0, 0]}
          end={[1, 0]}
          style={styles.headerGradient}
        >
          <View style={styles.headerRow}>
            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerTitle}>Manager Log</Text>
              <Text style={styles.headerSubtitle}>Overview & deadlines</Text>
            </View>
          </View>

          <View style={styles.headerKpiRow}>
            <View style={styles.headerKpi}>
              <Text style={styles.headerKpiLabel}>Overall</Text>
              <Text style={styles.headerKpiValue}>{progressPercent}%</Text>
            </View>
            <View style={styles.headerKpi}>
              <Text style={styles.headerKpiLabel}>Projects</Text>
              <Text style={styles.headerKpiValue}>{projects.length}</Text>
            </View>
            <View style={styles.headerKpi}>
              <Text style={styles.headerKpiLabel}>In Progress</Text>
              <Text style={styles.headerKpiValue}>{inProgress}</Text>
            </View>
          </View>
        </LinearGradient>

      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Overview */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Project Overview</Text>
          <Text style={styles.sectionSubtitle}>Global progress snapshot</Text>
          <FlatList
            data={projects}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(p) => p.id}
            contentContainerStyle={{ paddingVertical: 6 }}
            renderItem={({ item }) => {
              const safePercent = Math.max(0, Math.min(100, Number(item.progress ?? 0)));
              return (
                <Link href={`/project/manager/pages-manager/analytics-page?projectId=${item.id}`} asChild>
                  <TouchableOpacity style={styles.summaryCard} activeOpacity={0.9}>
                    <Text style={styles.summaryName}>{item.name}</Text>
                    <View style={styles.summaryRow}>
                      <View style={styles.smallProgressBackground}>
                        <View style={[styles.smallProgressFill, { width: `${safePercent}%`, backgroundColor: item.color || "#4FC3F7" }]} />
                      </View>
                      <Text style={styles.summaryPercent}>{safePercent}%</Text>
                    </View>
                    <Text style={styles.deadlineText}>{item.deadline ? `Deadline: ${item.deadline}` : "No deadline"}</Text>
                  </TouchableOpacity>
                </Link>
              );
            }}
          />
        </View>

        {/* Projects Grid */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>All Projects</Text>
          <Text style={styles.sectionSubtitle}>{projects.length} active</Text>
          <FlatList
            data={projects}
            keyExtractor={(item) => item.id}
            renderItem={renderProject}
            numColumns={2}
            columnWrapperStyle={styles.row}
            scrollEnabled={false}
            contentContainerStyle={{ paddingVertical: 6 }}
          />
        </View>

        {/* Departments */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Departments</Text>
          <Text style={styles.sectionSubtitle}>Explore project categories</Text>

          <View style={styles.departmentsGrid}>
            {Object.entries(departmentColors).map(([dep, color]) => {
              const icon = departmentIcons[dep];
              return (
                <TouchableOpacity
                  key={dep}
                  style={[styles.departmentCard, { backgroundColor: color }]}
                  activeOpacity={0.85}
                  onPress={() => {
                    const payload = encodeURIComponent(
                      JSON.stringify(
                        projects.map((p) => ({
                          id: p.id,
                          name: p.name,
                          color: p.color,
                          deadline: p.deadline,
                          progress: p.progress,
                          departments: p.departments,
                        }))
                      )
                    );
                    router.push({
                      pathname: "/project/manager/pages-manager/departments-page",
                      params: { department: dep, projects: payload },
                    } as any);
                  }}
                >
                  {icon?.library === "mci" ? (
                    <MaterialCommunityIcons name={icon.name as any} size={22} color="#fff" />
                  ) : (
                    <Ionicons name={icon.name as any} size={22} color="#fff" />
                  )}
                  <Text style={styles.departmentCardText}>{dep}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

        </View>

        {/* Calendar */}
        <View style={[styles.sectionCard, { padding: 0 }]}>
          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <Text style={styles.sectionTitle}>Project Deadlines</Text>
            <Text style={styles.sectionSubtitle}>Upcoming tasks and milestones</Text>
          </View>

          {/* Touchable pentru calendar */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              router.push("/project/manager/pages-manager/calendar-deadlines-page")
            }
            style={styles.calendarWrapper} // păstrăm stilul calendarWrapper
          >
            <Calendar
              markingType="multi-dot"
              markedDates={markedDates}
              theme={{
                textSectionTitleColor: "#444",
                monthTextColor: "#1b18b6",
                textMonthFontSize: 20,
                textMonthFontWeight: "700",
                arrowColor: "#1b18b6",
                textDayFontSize: 18,
                textDayHeaderFontSize: 15,
                todayTextColor: "#1b18b6",
                todayBackgroundColor: "#E8F0FE",
              }}
              style={{ borderRadius: 12 }}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating Add Project button */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push("/project/manager/pages-manager/add-project")}>
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView >
  );
}



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FB" },
  scrollContainer: { paddingBottom: 100, paddingTop: 6 },

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

  headerTitleWrap: { flex: 1, paddingHorizontal: 12, alignItems: "center" },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "800", textAlign: "center" },
  headerSubtitle: { color: "rgba(255,255,255,0.9)", fontSize: 12, marginTop: 4, textAlign: "center" },

  headerKpiRow: { flexDirection: "row", marginTop: 12, justifyContent: "space-between", gap: 8 },
  headerKpi: { flex: 1, alignItems: "center" },
  headerKpiLabel: { color: "rgba(255,255,255,0.9)", fontSize: 12 },
  headerKpiValue: { color: "#fff", fontSize: 16, fontWeight: "800", marginTop: 6 },

  /* Summary carousel */
  summarySection: { paddingVertical: 12 },
  summaryCard: {
    width: 220,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginRight: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  summaryName: { fontSize: 14, fontWeight: "700", color: "#0F172A", marginBottom: 8 },
  summaryRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  smallProgressBackground: { flex: 1, height: 8, backgroundColor: "#F3F4F6", borderRadius: 6, marginRight: 8, overflow: "hidden" },
  smallProgressFill: { height: "100%", borderRadius: 6 },
  summaryPercent: { width: 44, fontWeight: "700", color: "#0F172A" },
  deadlineText: { color: "#6B7280", fontSize: 12 },

  /* Projects list */
  projectsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 12, marginVertical: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#0F1724", paddingHorizontal: 16, marginBottom: 6 },
  sectionSubtitle: { fontSize: 13, color: "#6B7280", paddingHorizontal: 16, marginBottom: 12 },

  row: { justifyContent: "space-between", marginBottom: CARD_MARGIN, paddingHorizontal: 0 },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    elevation: 3,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  cardImage: { width: "100%", height: 140 },
  cardContent: { padding: 12 },
  cardTitle: { fontSize: 15, fontWeight: "800", color: "#0F172A", marginBottom: 6 },
  cardDescription: { fontSize: 13, color: "#6B7280", marginBottom: 8 },
  cardMetaRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  deadlineSmall: { fontSize: 12, color: "#6B7280" },
  percentSmall: { fontSize: 12, color: "#0F1724", fontWeight: "700" },

  progressBarTrack: { backgroundColor: "#F3F4F6", height: 8, borderRadius: 6, overflow: "hidden" },
  progressBarFill: { height: "100%" },

  /* Departments chips */
  departmentsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },

  departmentCard: {
    width: "47%", // ușor mai înguste
    height: 65,
    borderRadius: 14,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  departmentCardText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },


  /* Calendar */
  calendarSection: {
    paddingHorizontal: 12,
    marginTop: 6,
    paddingBottom: 36,
  },
  calendarCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 8,
    height: 550,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    flex: 1,
  },
  calendar: {
    borderRadius: 12,
    flex: 1,
    width: "100%",
    height: "100%",
  },


  /* FAB */
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#2962FF",
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 12,
    marginVertical: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  departmentsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  calendarWrapper: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    padding: 12,
    borderRadius: 16,
    overflow: "hidden",
  },

});
