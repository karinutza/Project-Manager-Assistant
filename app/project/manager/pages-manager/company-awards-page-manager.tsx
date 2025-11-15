import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BurgerMenu from "./burger-menu-manager";

const sampleAwards = {
  department: {
    name: "Engineering Excellence",
    description:
      "This department has shown outstanding performance and collaboration this month. Their dedication has been exceptional!",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
  },
  worker: {
    name: "Alice Johnson",
    position: "Senior Software Engineer",
    description:
      "Alice has gone above and beyond in delivering critical projects on time, mentoring colleagues, and improving our workflows.",
    image:
      "https://images.unsplash.com/photo-1603415526960-f8f0a64c5bfa?auto=format&fit=crop&w=800&q=80",
  },
};

export default function CompanyAwardsPage() {
  const [showDeptDetails, setShowDeptDetails] = useState(false);
  const [showWorkerDetails, setShowWorkerDetails] = useState(false);
  const [open, setOpen] = useState(false);
  const project = { name: "Company Awards", description: "Welcome to the commpany awards section" };
  const progressPercent = 72;
  const tasks = ["Task 1", "Task 2", "Task 3", "Task 4"];
  const completedTasks = 2;

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* HEADER TOOLBAR */}
            <LinearGradient
              colors={["#2962FF", "#4FC3F7"]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.toolbarContainer}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setOpen(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="menu" size={24} color="#fff" />
                </TouchableOpacity>
      
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => router.push("/project/manager/pages-manager/project-page-manager")}
                  activeOpacity={0.8}
                >
                  <Ionicons name="arrow-back" size={18} color="#fff" />
                </TouchableOpacity>
      
              </View>
      
              <TouchableOpacity style={styles.iconButton} onPress={() => { }} activeOpacity={0.8}>
                <Ionicons name="refresh" size={18} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>
      
            {/* OVERLAY PENTRU ÎNCHIDERE BURGER */}
            {open && (
              <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={() => setOpen(false)}
              />
            )}
      
            {/* MENIUL BURGER */}
            {open && <BurgerMenu closeMenu={() => setOpen(false)} />}
      
            {/* HEADER KPI */}
            <LinearGradient
              colors={["#2962FF", "#4FC3F7"]}
              start={[0, 0]}
              end={[1, 0]}
              style={styles.headerGradient}
            >
              <Text style={styles.headerTitle}>{project.name}</Text>
              <Text style={styles.headerSubtitle}>{project.description}</Text>
      
              <View style={styles.topKpiRow}>
                <View style={styles.topKpi}>
                  <Text style={styles.topKpiLabel}>Progress</Text>
                  <Text style={styles.topKpiValue}>{progressPercent}%</Text>
                </View>
                <View style={styles.topKpi}>
                  <Text style={styles.topKpiLabel}>Tasks</Text>
                  <Text style={styles.topKpiValue}>{tasks.length}</Text>
                </View>
                <View style={styles.topKpi}>
                  <Text style={styles.topKpiLabel}>Completed</Text>
                  <Text style={styles.topKpiValue}>{completedTasks}</Text>
                </View>
              </View>
            </LinearGradient>
      

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>🏆 Company Awards</Text>
        <Text style={styles.inspirationText}>
          Celebrating the dedication and excellence of our teams and employees!
        </Text>

        {/* Department of the Month */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => setShowDeptDetails(!showDeptDetails)}
        >
          <Image
            source={{ uri: sampleAwards.department.image }}
            style={styles.cardImage}
          />
          <Text style={styles.cardTitle}>Department of the Month</Text>
          <Text style={styles.cardSubtitle}>{sampleAwards.department.name}</Text>
          {showDeptDetails && (
            <Text style={styles.cardDescription}>
              {sampleAwards.department.description}
            </Text>
          )}
        </TouchableOpacity>

        {/* Worker of the Month */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => setShowWorkerDetails(!showWorkerDetails)}
        >
          <Image
            source={{ uri: sampleAwards.worker.image }}
            style={styles.cardImage}
          />
          <Text style={styles.cardTitle}>Worker of the Month</Text>
          <Text style={styles.cardSubtitle}>{sampleAwards.worker.name}</Text>
          <Text style={styles.cardSubtitle}>{sampleAwards.worker.position}</Text>
          {showWorkerDetails && (
            <Text style={styles.cardDescription}>
              {sampleAwards.worker.description}
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          🌟 Remember, every contribution matters. Keep shining!
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: "center" },
  
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
  toolbarTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 12,
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
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 9,
  },
  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 44 : 20,
    paddingBottom: 18,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 12,
    elevation: 6,
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "800", textAlign: "center" },
  headerSubtitle: { color: "rgba(255,255,255,0.85)", fontSize: 14, marginTop: 6, textAlign: "center" },
  topKpiRow: { flexDirection: "row", marginTop: 14, justifyContent: "space-between" },
  topKpi: { flex: 1, alignItems: "center" },
  topKpiLabel: { color: "rgba(255,255,255,0.85)", fontSize: 12 },
  topKpiValue: { color: "#fff", fontSize: 16, fontWeight: "800", marginTop: 6 },


  headerRow: { flexDirection: "row", alignItems: "center" },
  headerTitleWrap: {},
  
  header: { fontSize: 28, fontWeight: "700", color: "#111", marginVertical: 12 },
  inspirationText: { fontSize: 16, color: "#555", textAlign: "center", marginBottom: 20 },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  cardImage: { width: "100%", height: 180 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#3B82F6", marginTop: 12, marginHorizontal: 12 },
  cardSubtitle: { fontSize: 16, fontWeight: "600", color: "#111", marginHorizontal: 12, marginTop: 4 },
  cardDescription: { fontSize: 14, color: "#555", marginHorizontal: 12, marginVertical: 12, lineHeight: 20 },
  footerText: { fontSize: 16, fontWeight: "500", color: "#10B981", textAlign: "center", marginVertical: 20 },
});
