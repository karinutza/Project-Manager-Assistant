  import { Link, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";

  import Toolbar from "../components-worker/toolbar-worker";

  import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

  const { width } = Dimensions.get("window");
  const CARD_MARGIN = 12;
  const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

  const sampleProjects = [
    { id: "1", name: "Bridge Structural Analysis", description: "Finite element modeling of a suspension bridge.", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60", progress: 46, deadline: "2025-12-01", color: "#FF6B6B" },
    { id: "2", name: "Robotics Automation System", description: "Real-time robotic motion planning and AI vision.", image: "https://images.unsplash.com/photo-1581091012184-5c1b9d8f6d6e?auto=format&fit=crop&w=800&q=60", progress: 72, deadline: "2025-11-15", color: "#4D96FF" },
    { id: "3", name: "Renewable Energy Grid", description: "AI-driven optimization for wind–solar balance.", image: "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=800&q=60" },
    { id: "4", name: "Autonomous Vehicle Platform", description: "Control algorithms for self-driving systems.", image: "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?auto=format&fit=crop&w=800&q=60" },
    { id: "5", name: "Smart Building Sensors", description: "IoT network for energy-efficient architecture.", image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=60" },
    { id: "6", name: "Aerospace Simulation", description: "Thermal and aerodynamic testing for UAV design.", image: "https://images.unsplash.com/photo-1598300051280-4e01d97cf0d1?auto=format&fit=crop&w=800&q=60", progress: 12, deadline: "2026-01-10", color: "#00C9A7" },
  ];

  export default function HomeScreen() {
    const params = useLocalSearchParams();
    const [projects, setProjects] = useState<any[]>(sampleProjects);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
      if (params.updatedProject) {
        try {
          const upd = JSON.parse(decodeURIComponent(String(params.updatedProject)));
          setProjects((prev) => prev.map((p) => (String(p.id) === String(upd.id) ? { ...p, ...upd } : p)));
          router.replace("/");
        } catch {}
      }
    }, [params.updatedProject]);

    const renderProject = ({ item }: { item: any }) => (
      <Link href={`/project/worker/pages-worker/project-page-worker?id=${item.id}`} asChild>
        <TouchableOpacity style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </View>
        </TouchableOpacity>
      </Link>
    );

    const derivedDepartments = React.useMemo(() => {
      const fromProjects: Set<string> = new Set();
      projects.forEach((p) => {
        if (Array.isArray(p.departments)) p.departments.forEach((d: string) => fromProjects.add(d));
        if (p.department) fromProjects.add(p.department);
      });
      return fromProjects.size > 0 ? Array.from(fromProjects) : [
        "Design Mecanic", "Design Electric", "Purchasing", "Tooling Shop", "Assamblare Mecanica", "Assamblare Electrica", "Assamblare Finala", "Software Offline", "Software Debug", "Teste", "Livrare",
      ];
    }, [projects]);

    // 🟢 Helper function pentru navigare + inchidere menu
    const navigateAndClose = (path: string) => {
      setIsMenuOpen(false);
      router.push(path);
    };

    return (
      <SafeAreaView style={styles.container}>
        {/* Toolbar */}
        <Toolbar onMenuPress={() => setIsMenuOpen(!isMenuOpen)} />

        {/* Lateral menu */}
        {isMenuOpen && (
          <View style={styles.sideMenu}>
            <TouchableOpacity onPress={() => navigateAndClose("/project/worker/pages-worker/user-profile-worker")}>
              <Text style={styles.menuItem}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateAndClose("/project/worker/pages-worker/community-page-worker")}>
              <Text style={styles.menuItem}>Community</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateAndClose("/project/worker/pages-worker/settings")}>
              <Text style={styles.menuItem}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsMenuOpen(false)}>
              <Text style={styles.menuItem}>Close Menu</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Projects List */}
        <FlatList
          data={projects}
          renderItem={renderProject}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 180 }}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#EEF3F9" },
    row: { justifyContent: "space-between", marginBottom: CARD_MARGIN },
    card: { width: CARD_WIDTH, backgroundColor: "#fff", borderRadius: 14, overflow: "hidden", paddingHorizontal: 10, marginBottom: 12, elevation: 3 },
    cardImage: { width: "100%", height: 140 },
    cardContent: { padding: 10, backgroundColor: "#F7FAFF" },
    cardTitle: { fontSize: 15, fontWeight: "600", color: "#1C1C1E", marginBottom: 4 },
    cardDescription: { fontSize: 13, color: "#6B6B6B" },
    sideMenu: { position: "absolute", top: 70, left: 0, width: 200, backgroundColor: "#fff", borderRightWidth: 1, borderRightColor: "#ccc", paddingVertical: 10, paddingHorizontal: 15, zIndex: 1000, elevation: 5 },
    menuItem: { fontSize: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#eee" },
  });
