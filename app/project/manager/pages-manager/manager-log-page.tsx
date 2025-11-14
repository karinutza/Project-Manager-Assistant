import { Ionicons } from "@expo/vector-icons";
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
];

export default function ManagerLogPage(): React.ReactElement {
  const params = useLocalSearchParams();
  const [projects, setProjects] = useState<Project[]>(sampleProjects);

  /* --- BURGER MENU CONTROL --- */
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible((prev) => !prev);
  const closeMenu = () => setMenuVisible(false);

  /* update project */
  useEffect(() => {
    if (params.updatedProject) {
      try {
        const upd = JSON.parse(decodeURIComponent(String(params.updatedProject)));
        setProjects((prev) =>
          prev.map((p) => (String(p.id) === String(upd.id) ? { ...p, ...upd } : p))
        );
        router.replace({ pathname: "/" } as any);
      } catch {}
    }
  }, [params.updatedProject]);

  /* KPIs */
  const progressPercent = projects.length
    ? Math.round(projects.reduce((acc, t) => acc + (t.progress ?? 0), 0) / projects.length)
    : 0;

  const inProgress = projects.filter(
    (p) => (p.progress ?? 0) > 0 && (p.progress ?? 0) < 100
  ).length;

  /* Calendar dots */
  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};
    projects.forEach((p) => {
      if (!p.deadline) return;
      if (!marks[p.deadline]) marks[p.deadline] = { dots: [] };
      marks[p.deadline].dots.push({ key: p.id, color: p.color || "#2962FF" });
    });

    const today = dayjs().format("YYYY-MM-DD");
    marks[today] = { ...(marks[today] || {}), selected: true, selectedColor: "#E8F6FF" };

    return marks;
  }, [projects]);

  /* Render project card */
  const renderProject = ({ item }: { item: Project }) => {
    const safePercent = Math.max(0, Math.min(100, item.progress ?? 0));

    return (
      <Link
        href={`/project/manager/pages-manager/project-page-manager?id=${item.id}`}
        asChild
      >
        <TouchableOpacity style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.cardImage} />

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>

            <View style={styles.cardMetaRow}>
              <Text style={styles.deadlineSmall}>
                {item.deadline ? `Deadline: ${item.deadline}` : "No deadline"}
              </Text>
              <Text style={styles.percentSmall}>{safePercent}%</Text>
            </View>

            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${safePercent}%`, backgroundColor: item.color || "#4FC3F7" },
                ]}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* --- OVERLAY --- */}
      {menuVisible && (
        <TouchableOpacity style={styles.overlay} onPress={closeMenu} />
      )}

      {/* --- BURGER MENU --- */}
      {menuVisible && <BurgerMenu closeMenu={closeMenu} />}

      {/* --- HEADER --- */}
      <LinearGradient colors={["#2962FF", "#4FC3F7"]} style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleMenu}>
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>

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

      {/* --- MAIN SCROLL --- */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>All Projects</Text>
          <FlatList
            data={projects}
            renderItem={renderProject}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={{ paddingVertical: 6 }}
          />
        </View>

        {/* Calendar */}
        <View style={[styles.sectionCard, { padding: 0 }]}>
          <View style={{ padding: 16 }}>
            <Text style={styles.sectionTitle}>Deadlines</Text>
            <Text style={styles.sectionSubtitle}>Upcoming tasks</Text>
          </View>

          <View style={styles.calendarWrapper}>
            <Calendar
              markingType="multi-dot"
              markedDates={markedDates}
              theme={{
                monthTextColor: "#1b18b6",
                textMonthFontSize: 20,
                textMonthFontWeight: "700",
                arrowColor: "#1b18b6",
              }}
            />
          </View>
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/project/manager/pages-manager/add-project")}
      >
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* --- STYLES --- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FB" },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: 50,
  },

  scrollContainer: { paddingBottom: 120 },

  headerGradient: {
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    elevation: 6,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitleWrap: { flex: 1, alignItems: "center" },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "800" },
  headerSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    marginTop: 3,
  },

  headerKpiRow: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "space-around",
  },
  headerKpi: { alignItems: "center" },
  headerKpiLabel: { color: "#fff", fontSize: 12 },
  headerKpiValue: { color: "#fff", fontSize: 18, fontWeight: "800" },

  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 12,
    marginVertical: 10,
    padding: 16,
    elevation: 3,
  },

  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 6 },
  sectionSubtitle: { fontSize: 13, color: "#6B7280", marginBottom: 12 },

  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 3,
  },
  cardImage: { width: "100%", height: 140 },
  cardContent: { padding: 12 },

  cardTitle: { fontSize: 15, fontWeight: "800", marginBottom: 4 },
  cardDescription: { fontSize: 13, color: "#6B7280", marginBottom: 8 },

  cardMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  deadlineSmall: { fontSize: 12, color: "#6B7280" },
  percentSmall: { fontSize: 12, fontWeight: "700" },

  progressBarTrack: {
    backgroundColor: "#F3F4F6",
    height: 8,
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%" },

  calendarWrapper: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    padding: 12,
  },

  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#2962FF",
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
});
