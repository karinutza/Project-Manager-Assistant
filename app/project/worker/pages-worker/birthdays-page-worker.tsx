import React, { useState } from "react";
import {
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import ToolbarWorker from "../components-worker/toolbar-worker";

const sampleBirthdays = [
  {
    id: "1",
    name: "John Doe",
    age: 28,
    date: "2025-11-12",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "2",
    name: "Jane Smith",
    age: 35,
    date: "2025-11-15",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "3",
    name: "Alice Johnson",
    age: 30,
    date: "2025-11-18",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: "4",
    name: "Michael Brown",
    age: 40,
    date: "2025-11-20",
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
  },
];

export default function BirthdaysPageWorker() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Construim obiectul pentru calendar cu evidențiere
  const markedDates: { [key: string]: any } = {};
  sampleBirthdays.forEach((b) => {
    markedDates[b.date] = {
      marked: true,
      dotColor: "#3B82F6",
      selected: selectedDate === b.date,
      selectedColor: "#10B981",
    };
  });

  const birthdaysForSelectedDate = sampleBirthdays.filter(
    (b) => b.date === selectedDate
  );

  const renderItem = ({ item }: { item: typeof sampleBirthdays[0] }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.date}>🎉 {item.date} ({item.age} 🎂)</Text>
      </View>
      <TouchableOpacity style={styles.giftButton}>
        <Text style={styles.giftText}>🎁 Send</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ToolbarWorker />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Text style={styles.header}>Upcoming Birthdays</Text>

        {/* Calendar */}
        <Calendar
  onDayPress={(day) => setSelectedDate(day.dateString)} // day este deja obiectul primit de Calendar
  markedDates={markedDates}
  style={styles.calendar}
  theme={{
    selectedDayBackgroundColor: "#10B981",
    todayTextColor: "#3B82F6",
    dotColor: "#3B82F6",
    selectedDotColor: "#fff",
  }}
/>


        {/* Afișăm cine are ziua la data selectată */}
        {selectedDate && birthdaysForSelectedDate.length > 0 && (
          <View style={styles.selectedDateList}>
            <Text style={styles.selectedDateHeader}>
              Birthdays on {selectedDate}:
            </Text>
            {birthdaysForSelectedDate.map((b) => (
              <Text key={b.id} style={styles.selectedDateText}>
                🎂 {b.name} ({b.age})
              </Text>
            ))}
          </View>
        )}

        {/* Lista tuturor zilelor */}
        <FlatList
          data={sampleBirthdays}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12 }}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginLeft: 12,
    marginVertical: 12,
  },
  calendar: { marginHorizontal: 12, borderRadius: 16, elevation: 2 },

  selectedDateList: {
    backgroundColor: "#fff",
    margin: 12,
    borderRadius: 16,
    padding: 12,
    elevation: 3,
  },
  selectedDateHeader: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 6,
  },
  selectedDateText: { fontSize: 14, color: "#555", marginVertical: 2 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "700", color: "#111" },
  date: { fontSize: 14, color: "#555", marginTop: 2 },
  giftButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  giftText: { color: "#fff", fontWeight: "700" },
});
