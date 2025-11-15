import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import BurgerMenu from "../pages-manager/burger-menu-manager";
import NotificationManager from "./notification-manager"; // notificări

interface Event {
  id: string;
  title: string;
  description: string;
  likes: number;
  participants: number;
  location: string;
  datetime: Date;
}

const sampleEvents: Event[] = [
  { id: "1", title: "Escape Room Challenge", description: "Solve intricate puzzles as a team!", likes: 35, participants: 12, location: "Central Park, NYC", datetime: new Date(2025, 10, 15, 18, 0) },
  { id: "2", title: "Yoga Flow Session", description: "Relax your mind and body together.", likes: 18, participants: 8, location: "Sunset Yoga Studio", datetime: new Date(2025, 10, 16, 7, 30) },
  { id: "3", title: "Hackathon 2025", description: "Collaborate, innovate, and create solutions.", likes: 50, participants: 20, location: "Tech Hub, NYC", datetime: new Date(2025, 10, 20, 9, 0) },
  { id: "4", title: "Coffee & Networking", description: "Meet colleagues and share ideas over coffee.", likes: 10, participants: 5, location: "Cafe Central", datetime: new Date(2025, 10, 18, 10, 0) },
  { id: "5", title: "Art Workshop", description: "Discover your creativity through painting.", likes: 28, participants: 9, location: "Art Studio NYC", datetime: new Date(2025, 10, 22, 14, 0) },
  { id: "6", title: "Cooking Class", description: "Learn to cook gourmet meals together.", likes: 22, participants: 7, location: "Culinary School", datetime: new Date(2025, 10, 23, 17, 0) },
  { id: "7", title: "Robotics Meetup", description: "Share your robotics projects and learn.", likes: 15, participants: 10, location: "Tech Lab", datetime: new Date(2025, 10, 25, 16, 0) },
  { id: "8", title: "Music Jam Session", description: "Collaborate and play music together.", likes: 32, participants: 8, location: "Community Hall", datetime: new Date(2025, 10, 28, 19, 0) },
];

export default function CommunityPageWorker() {
  const [joinedEvents, setJoinedEvents] = useState<string[]>([]);
  const [likedEvents, setLikedEvents] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "joined" | "popular">("all");
  const [open, setOpen] = useState(false);

  const project = { name: "Activities 📅", description: "Manage your events and participation" };

  const totalEvents = sampleEvents.length;
  const joinedCount = joinedEvents.length;
  const popularEvents = sampleEvents.filter(e => e.likes > 25).length;

  const notifications: { id: string; title: string; message: string; type: "info" | "meeting" | "success"; time: string }[] = [
    { id: "1", title: "New Announcement", message: "New Safety Protocols added", type: "info", time: "1h ago" },
    { id: "2", title: "Holiday Alert", message: "Holiday Schedule updated", type: "info", time: "2h ago" },
  ];

  const toggleJoin = (id: string) => {
    setJoinedEvents(prev => (prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]));
  };

  const toggleLike = (id: string) => {
    setLikedEvents(prev => (prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]));
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const filteredEvents = sampleEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase());
    if (filter === "joined") return joinedEvents.includes(event.id) && matchesSearch;
    if (filter === "popular") return event.likes > 25 && matchesSearch;
    return matchesSearch;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* TOOLBAR */}
      <LinearGradient
        colors={["#2962FF", "#4FC3F7"]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.toolbarContainer}
      >
        {/* stânga: menu + back */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity style={styles.iconButton} onPress={() => setOpen(true)}>
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/project/manager/pages-manager/community-hub-manager")}
          >
            <Ionicons name="arrow-back" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* dreapta: refresh + notificări */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity style={[styles.iconButton, { marginRight: 8 }]} onPress={() => { }}>
            <Ionicons name="refresh" size={18} color="#fff" />
          </TouchableOpacity>
          <NotificationManager notifications={notifications} />
        </View>
      </LinearGradient>

      {/* OVERLAY + BURGER MENU */}
      {open && (
        <>
          <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpen(false)} />
          <BurgerMenu closeMenu={() => setOpen(false)} />
        </>
      )}

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
            <Text style={styles.topKpiLabel}>Total Events</Text>
            <Text style={styles.topKpiValue}>{totalEvents}</Text>
          </View>
          <View style={styles.topKpi}>
            <Text style={styles.topKpiLabel}>Joined</Text>
            <Text style={styles.topKpiValue}>{joinedCount}</Text>
          </View>
          <View style={styles.topKpi}>
            <Text style={styles.topKpiLabel}>Popular</Text>
            <Text style={styles.topKpiValue}>{popularEvents}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* SEARCH + FILTER + EVENTS */}
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search events..."
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterButton, filter === "all" && styles.filterSelected]}
            onPress={() => setFilter("all")}
          >
            <Text style={[styles.filterText, filter === "all" && { color: "#fff" }]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === "joined" && styles.filterSelected]}
            onPress={() => setFilter("joined")}
          >
            <Text style={[styles.filterText, filter === "joined" && { color: "#fff" }]}>Joined</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === "popular" && styles.filterSelected]}
            onPress={() => setFilter("popular")}
          >
            <Text style={[styles.filterText, filter === "popular" && { color: "#fff" }]}>Popular</Text>
          </TouchableOpacity>
        </View>

        {filteredEvents.map(event => {
          const isJoined = joinedEvents.includes(event.id);
          const isLiked = likedEvents.includes(event.id);
          const isPopular = event.likes > 25;

          return (
            <TouchableOpacity
              key={event.id}
              style={[styles.card, expandedId === event.id && styles.expandedCard]}
              onPress={() => toggleExpand(event.id)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.title}>{event.title}</Text>
                <View style={styles.badges}>
                  {isPopular && (
                    <LinearGradient
                      colors={["#FF6B6B", "#FF3D71"]}
                      start={[0, 0]}
                      end={[1, 0]}
                      style={styles.popularBadgeGradient}
                    >
                      <Text style={styles.popularBadgeText}>🔥 Popular</Text>
                    </LinearGradient>
                  )}
                  {isJoined && <Text style={styles.joinedBadge}>✅ Joined</Text>}
                </View>
              </View>

              {expandedId === event.id && (
                <View style={styles.details}>
                  <Text style={styles.description}>{event.description}</Text>
                  <Text style={styles.detail}>📍 {event.location}</Text>
                  <Text style={styles.detail}>
                    🗓 {event.datetime.toLocaleDateString()} ⏰ {event.datetime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </Text>
                </View>
              )}

              <View style={styles.actions}>
                <TouchableOpacity onPress={() => toggleLike(event.id)} style={styles.actionButton}>
                  <Text style={{ color: isLiked ? "#EF4444" : "#555" }}>{isLiked ? "♥ Liked" : "♡ Like"} ({event.likes + (isLiked ? 1 : 0)})</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleJoin(event.id)} style={[styles.actionButton, isJoined && styles.joinedButton]}>
                  <Text style={{ color: "#fff" }}>{isJoined ? "Joined" : "Join"} ({event.participants + (isJoined ? 1 : 0)})</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  toolbarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // stânga / dreapta
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
    marginRight: 6,
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

  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  filterRow: { flexDirection: "row", justifyContent: "flex-start", marginBottom: 16 },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  filterSelected: { backgroundColor: "#3B82F6" },
  filterText: { color: "#333", fontWeight: "600" },

  popularBadgeGradient: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  popularBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },

  card: { backgroundColor: "#fff", padding: 16, borderRadius: 16, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  expandedCard: { backgroundColor: "#F3F4F6" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap", alignItems: "center", marginBottom: 8 },
  title: { fontSize: 16, fontWeight: "700", color: "#111" },
  badges: { flexDirection: "row", alignItems: "center" },
  joinedBadge: { fontSize: 12, fontWeight: "700", color: "#10B981", marginLeft: 8 },
  details: { marginTop: 8 },
  description: { fontSize: 14, color: "#555", marginBottom: 4 },
  detail: { fontSize: 13, color: "#333" },
  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  actionButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, backgroundColor: "#3B82F6" },
  joinedButton: { backgroundColor: "#10B981" },
});
