import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import ToolbarWorker from "../components-worker/toolbar-worker";

const sampleAnnouncements = [
  {
    id: "1",
    title: "New Safety Protocols",
    description:
      "Please review the updated safety protocols for the workshop. Mandatory training will take place next week.",
    date: "2025-11-15",
    important: true,
  },
  {
    id: "2",
    title: "Holiday Schedule",
    description:
      "The office will be closed on December 25th and January 1st. Plan your work accordingly.",
    date: "2025-11-10",
    important: false,
  },
  {
    id: "3",
    title: "Team Building Event",
    description:
      "Join us for a fun team-building day at the local park. Lunch and activities will be provided.",
    date: "2025-11-20",
    important: true,
  },
  {
    id: "4",
    title: "System Maintenance",
    description:
      "Scheduled maintenance will occur on November 18th from 6 AM to 10 AM. Access to certain tools may be limited.",
    date: "2025-11-12",
    important: false,
  },
];

export default function AnnouncementsPageWorker() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <ToolbarWorker />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>📢 Announcements</Text>

        {sampleAnnouncements.map((announcement) => (
          <TouchableOpacity
            key={announcement.id}
            style={[
              styles.card,
              announcement.important && styles.importantCard,
              expandedId === announcement.id && styles.expandedCard,
            ]}
            onPress={() => toggleExpand(announcement.id)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardDate}>{announcement.date}</Text>
              {announcement.important && (
                <Text style={styles.badge}>IMPORTANT</Text>
              )}
            </View>
            <Text style={styles.cardTitle}>{announcement.title}</Text>
            {expandedId === announcement.id && (
              <Text style={styles.cardDescription}>{announcement.description}</Text>
            )}
          </TouchableOpacity>
        ))}

        <Text style={styles.footerText}>
          Stay updated! Check announcements regularly.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  importantCard: {
    borderLeftWidth: 5,
    borderLeftColor: "#EF4444",
  },
  expandedCard: {
    backgroundColor: "#F3F4F6",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 12,
    color: "#555",
  },
  badge: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
    backgroundColor: "#EF4444",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    overflow: "hidden",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  footerText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#10B981",
    marginVertical: 20,
    textAlign: "center",
  },
});
