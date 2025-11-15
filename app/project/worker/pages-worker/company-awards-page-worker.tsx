import React, { useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import ToolbarWorker from "../components-worker/toolbar-worker";

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

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <ToolbarWorker />

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

        {/* Footer inspiration */}
        <Text style={styles.footerText}>
          🌟 Remember, every contribution matters. Keep shining!
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
    marginVertical: 12,
  },
  inspirationText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
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
  cardImage: {
    width: "100%",
    height: 180,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3B82F6",
    marginTop: 12,
    marginHorizontal: 12,
  },
  cardSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginHorizontal: 12,
    marginTop: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: "#555",
    marginHorizontal: 12,
    marginVertical: 12,
    lineHeight: 20,
  },
  footerText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#10B981",
    textAlign: "center",
    marginVertical: 20,
  },
});
