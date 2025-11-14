import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ToolbarWorker from "../components-worker/toolbar-worker";

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

  const toggleJoin = (id: string) => {
    setJoinedEvents(prev => (prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]));
  };

  const toggleLike = (id: string) => {
    setLikedEvents(prev => (prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]));
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  // Filtrare evenimente în funcție de filter
  const filteredEvents = sampleEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase());
    if (filter === "joined") return joinedEvents.includes(event.id) && matchesSearch;
    if (filter === "popular") return event.likes > 25 && matchesSearch;
    return matchesSearch;
  });

  const renderEvent = (event: Event) => {
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
            {isPopular && <Text style={styles.popularBadge}>🔥 Popular</Text>}
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
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <ToolbarWorker />
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

        {filteredEvents.map(renderEvent)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 16,
  },
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
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  expandedCard: {
    backgroundColor: "#F3F4F6",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  badges: {
    flexDirection: "row",
    alignItems: "center",
  },
  popularBadge: {
    fontSize: 12,
    fontWeight: "700",
    color: "#EF4444",
    marginLeft: 8,
  },
  joinedBadge: {
    fontSize: 12,
    fontWeight: "700",
    color: "#10B981",
    marginLeft: 8,
  },
  details: {
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  detail: {
    fontSize: 13,
    color: "#333",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#3B82F6",
  },
  joinedButton: {
    backgroundColor: "#10B981",
  },
});
