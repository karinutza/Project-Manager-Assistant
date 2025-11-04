import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DetailedOverviewPage() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f5f7" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.header}>
          <Text style={styles.title}>📊 Detailed Overview</Text>
          <Text style={styles.subtitle}>
            Aici poți afișa toate statisticile detaliate ale proiectului, grafic, buget, progres taskuri și altele.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Progres Taskuri</Text>
          <Text style={styles.cardContent}>Ex: 12 taskuri în progres, 3 finalizate, 2 întârziate</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Buget și Cheltuieli</Text>
          <Text style={styles.cardContent}>Ex: Buget rămas 5.000€, total cheltuit 15.000€</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Deadline-uri importante</Text>
          <Text style={styles.cardContent}>Ex: 3 taskuri critice până la sfârșitul săptămânii</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "800", color: "#4f46e5" },
  subtitle: { fontSize: 16, color: "#6b7280", marginTop: 6 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8, color: "#1e293b" },
  cardContent: { fontSize: 15, color: "#334155" },
});
