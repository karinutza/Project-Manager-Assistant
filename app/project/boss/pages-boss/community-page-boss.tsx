import React, { useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    Linking,
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 10;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

const sampleEvents = [
  {
    id: "1",
    title: "Escape Room Challenge",
    description: "Solve intricate puzzles as a team!",
    likes: 35,
    participants: 12,
    image:
      "https://images.unsplash.com/photo-1596495577886-5d70b33a3f40?auto=format&fit=crop&w=800&q=80",
    location: "Central Park, NYC",
    datetime: new Date(2025, 10, 15, 18, 0),
    organizer: "Company Team",
  },
  {
    id: "2",
    title: "Yoga Flow Session",
    description: "Relax your mind and body together.",
    likes: 18,
    participants: 8,
    image:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=800&q=80",
    location: "Sunset Yoga Studio",
    datetime: new Date(2025, 10, 16, 7, 30),
    organizer: "Wellness Co.",
  },
  {
    id: "3",
    title: "Hackathon 2025",
    description: "Collaborate, innovate, and create solutions.",
    likes: 50,
    participants: 20,
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    location: "Tech Hub, NYC",
    datetime: new Date(2025, 10, 20, 9, 0),
    organizer: "Dev Team",
  },
  {
    id: "4",
    title: "Coffee & Networking",
    description: "Meet colleagues and share ideas over coffee.",
    likes: 10,
    participants: 5,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    location: "Cafe Central",
    datetime: new Date(2025, 10, 18, 10, 0),
    organizer: "Community Team",
  },
];

export default function CommunityPage() {
  const [joinedEvents, setJoinedEvents] = useState<string[]>([]);
  const [likedEvents, setLikedEvents] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [comments, setComments] = useState<{ [key: string]: string[] }>({});
  const [newComment, setNewComment] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const handleJoin = (id: string) =>
    setJoinedEvents((prev) => (prev.includes(id) ? prev : [...prev, id]));
  const handleLeave = (id: string) =>
    setJoinedEvents((prev) => prev.filter((e) => e !== id));
  const toggleLike = (id: string) =>
    setLikedEvents((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const openModal = (event: any) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };
  const closeModal = () => {
    setSelectedEvent(null);
    setModalVisible(false);
  };
  const addComment = () => {
    if (!newComment.trim() || !selectedEvent) return;
    setComments((prev) => ({
      ...prev,
      [selectedEvent.id]: [...(prev[selectedEvent.id] || []), newComment],
    }));
    setNewComment("");
  };

  const filteredEvents = sampleEvents
    .filter((event) =>
      filter === "joined"
        ? joinedEvents.includes(event.id)
        : filter === "popular"
        ? event.likes > 20
        : true
    )
    .filter((event) =>
      event.title.toLowerCase().includes(search.toLowerCase())
    );

  const renderItem = ({ item }: { item: any }) => {
    const isJoined = joinedEvents.includes(item.id);
    const isLiked = likedEvents.includes(item.id);

    return (
      <Pressable
        style={styles.card}
        onPress={() => openModal(item)}
        android_ripple={{ color: "#eee" }}
      >
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statText}>❤️ {item.likes + (isLiked ? 1 : 0)}</Text>
            <Text style={styles.statText}>
              👥 {item.participants + (isJoined ? 1 : 0)}
            </Text>
          </View>
          {item.likes > 25 && <Text style={styles.popularBadge}>🔥 Popular</Text>}
        </View>
        <View style={styles.cardFooter}>
          <TouchableOpacity onPress={() => toggleLike(item.id)} style={styles.likeButton}>
            <Text style={{ color: isLiked ? "#EF4444" : "#555" }}>
              {isLiked ? "♥ Liked" : "♡ Like"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleJoin(item.id)}
            style={[styles.joinButtonSmall, isJoined && styles.joinedButtonSmall]}
            disabled={isJoined}
          >
            <Text style={styles.joinTextSmall}>{isJoined ? "Joined" : "Join"}</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Toolbar */}
      <View style={styles.toolbar}>
        <Text style={styles.toolbarTitle}>Community</Text>
      </View>

      {/* Search */}
      <TextInput
        placeholder="Search events..."
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
      />

      {/* Filters */}
      <View style={styles.filterRow}>
        {["all", "joined", "popular"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterButton, filter === f && styles.filterSelected]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && { color: "#fff" }]}>
              {f.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Event List */}
      <FlatList
        data={filteredEvents}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: CARD_MARGIN }}
        contentContainerStyle={{ paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView>
              {selectedEvent && (
                <>
                  <Image
                    source={{ uri: selectedEvent.image }}
                    style={styles.modalImage}
                  />
                  <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
                  <Text style={styles.modalDescription}>
                    {selectedEvent.description}
                  </Text>

                  <View style={styles.detailsRow}>
                    <Text style={styles.detailLabel}>📍 Location:</Text>
                    <Text style={styles.detailValue}>{selectedEvent.location}</Text>
                  </View>
                  <View style={styles.detailsRow}>
                    <Text style={styles.detailLabel}>🗓 Date & Time:</Text>
                    <Text style={styles.detailValue}>
                      {selectedEvent.datetime.toLocaleDateString(undefined, {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      {selectedEvent.datetime.toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                  <View style={styles.detailsRow}>
                    <Text style={styles.detailLabel}>👤 Organizer:</Text>
                    <Text style={styles.detailValue}>{selectedEvent.organizer}</Text>
                  </View>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.shareButton}
                      onPress={() =>
                        Linking.openURL(
                          `mailto:?subject=${selectedEvent.title}&body=Join this event!`
                        )
                      }
                    >
                      <Text style={styles.shareText}>Share 📤</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reminderButton}>
                      <Text style={styles.reminderText}>Add Reminder ⏰</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.commentHeader}>Comments:</Text>
                  <ScrollView style={styles.commentBox}>
                    {(comments[selectedEvent.id] || []).map((c, i) => (
                      <Text key={i} style={styles.commentItem}>
                        • {c}
                      </Text>
                    ))}
                  </ScrollView>

                  <TextInput
                    placeholder="Write a comment..."
                    value={newComment}
                    onChangeText={setNewComment}
                    style={styles.commentInput}
                  />
                  <TouchableOpacity
                    style={styles.addCommentButton}
                    onPress={addComment}
                  >
                    <Text style={{ color: "#fff", fontWeight: "700" }}>
                      Add Comment
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={[
                        styles.joinButton,
                        joinedEvents.includes(selectedEvent.id) && styles.joinedButton,
                      ]}
                      onPress={() =>
                        joinedEvents.includes(selectedEvent.id)
                          ? handleLeave(selectedEvent.id)
                          : handleJoin(selectedEvent.id)
                      }
                    >
                      <Text style={styles.joinText}>
                        {joinedEvents.includes(selectedEvent.id)
                          ? "Leave Event"
                          : "Join Event"}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.leaveButton}
                      onPress={closeModal}
                    >
                      <Text style={styles.leaveText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  toolbar: {
    height: 60,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  toolbarTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },

  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    margin: 12,
    borderRadius: 12,
    fontSize: 16,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginHorizontal: 5,
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
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: CARD_MARGIN,
    elevation: 4,
    marginHorizontal: CARD_MARGIN / 2,
  },
  cardImage: { width: "100%", height: CARD_WIDTH * 0.6 },
  cardContent: { padding: 10 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#111", marginBottom: 4 },
  cardDescription: { fontSize: 13, color: "#666" },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  statText: { fontSize: 12, color: "#555" },
  popularBadge: { marginTop: 6, color: "#EF4444", fontWeight: "700" },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    alignItems: "center",
  },
  likeButton: { padding: 6 },
  joinButtonSmall: { backgroundColor: "#3B82F6", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12 },
  joinedButtonSmall: { backgroundColor: "#10B981" },
  joinTextSmall: { color: "#fff", fontWeight: "700", fontSize: 13 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", alignItems: "center" },
  modalContainer: { backgroundColor: "#fff", borderRadius: 20, width: "90%", maxHeight: "90%", padding: 16 },
  modalImage: { width: "100%", height: 220, borderRadius: 16, marginBottom: 14 },
  modalTitle: { fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: 8, color: "#111" },
  modalDescription: { fontSize: 14, color: "#555", textAlign: "center", marginBottom: 16 },

  detailsRow: { flexDirection: "row", marginBottom: 6 },
  detailLabel: { fontWeight: "600", width: 120 },
  detailValue: { flex: 1, color: "#333" },

  actionRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 12 },
  shareButton: { flex: 1, backgroundColor: "#3B82F6", padding: 12, borderRadius: 16, marginRight: 6, alignItems: "center" },
  reminderButton: { flex: 1, backgroundColor: "#10B981", padding: 12, borderRadius: 16, marginLeft: 6, alignItems: "center" },
  shareText: { color: "#fff", fontWeight: "700" },
  reminderText: { color: "#fff", fontWeight: "700" },

  commentHeader: { fontWeight: "700", fontSize: 16, marginBottom: 8 },
  commentBox: { maxHeight: 140, padding: 12, backgroundColor: "#F2F2F2", borderRadius: 12, marginBottom: 12 },
  commentItem: { fontSize: 13, marginVertical: 2 },
  commentInput: { backgroundColor: "#EEE", padding: 12, borderRadius: 12, marginBottom: 10 },
  addCommentButton: { backgroundColor: "#3B82F6", padding: 14, borderRadius: 16, alignItems: "center", marginBottom: 16 },

  modalActions: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  joinButton: { flex: 1, backgroundColor: "#3B82F6", paddingVertical: 14, borderRadius: 16, marginRight: 6, alignItems: "center" },
  joinedButton: { backgroundColor: "#10B981" },
  joinText: { color: "#fff", fontWeight: "700" },
  leaveButton: { flex: 1, backgroundColor: "#ccc", paddingVertical: 14, borderRadius: 16, marginLeft: 6, alignItems: "center" },
  leaveText: { color: "#333", fontWeight: "600" },
});
