import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import ToolbarWorker from "../components-worker/toolbar-worker";

const sampleMeetings = [
  {
    id: "1",
    title: "Team Sync",
    description: "Weekly team sync-up meeting",
    datetime: "2025-11-12T10:00",
    duration: "1h",
    location: "Conference Room A",
    organizer: "John Doe",
  },
  {
    id: "2",
    title: "Project Planning",
    description: "Plan next sprint",
    datetime: "2025-11-13T14:00",
    duration: "2h",
    location: "Zoom",
    organizer: "Jane Smith",
  },
  {
    id: "3",
    title: "Client Call",
    description: "Call with client to discuss feedback",
    datetime: "2025-11-13T16:00",
    duration: "30min",
    location: "Teams",
    organizer: "John Doe",
  },
  {
    id: "4",
    title: "Design Review",
    description: "Review UI/UX designs for project",
    datetime: "2025-11-15T11:00",
    duration: "1h",
    location: "Design Room",
    organizer: "Alice Johnson",
  },
];

export default function MeetingsPageWorker() {
  const [selectedDate, setSelectedDate] = useState<string>("2025-11-12");

  // Construim markedDates: toate zilele cu întâlniri
  const marked: Record<string, any> = {};
  sampleMeetings.forEach((m) => {
    const dateStr = m.datetime.split("T")[0];
    marked[dateStr] = { marked: true, dotColor: "#fff", selected: true, selectedColor: "#3B82F6" };
  });

  return (
    <View style={styles.container}>
      <ToolbarWorker />

      <View style={styles.content}>
        {/* Coloana întâlniri */}
        <ScrollView style={styles.leftColumn}>
          {sampleMeetings.map((m) => (
            <View key={m.id} style={styles.meetingCard}>
              <Text style={styles.title}>{m.title}</Text>
              <Text>{m.description}</Text>
              <Text>📅 {m.datetime.split("T")[0]}</Text>
              <Text>⏱ Duration: {m.duration}</Text>
              <Text>📍 Location: {m.location}</Text>
              <Text>👤 Organizer: {m.organizer}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Coloana calendar */}
        <View style={styles.rightColumn}>
          <Calendar
            onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
            markedDates={marked}
            theme={{
              selectedDayBackgroundColor: "#3B82F6",
              selectedDayTextColor: "#fff",
              todayTextColor: "#3B82F6",
              dotColor: "#3B82F6",
              arrowColor: "#3B82F6",
              monthTextColor: "#1b18b6",
              textDayFontWeight: "700",
              textMonthFontWeight: "700",
            }}
            style={styles.calendar}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  content: { flex: 1, flexDirection: "row", padding: 12 },
  leftColumn: { flex: 2, marginRight: 12 },
  rightColumn: { flex: 1, justifyContent: "flex-start" },
  meetingCard: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  calendar: { flex: 1, borderRadius: 12 }, // ocupă tot spațiul coloanei
});
