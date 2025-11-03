import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";

export const CalendarView = ({ tasks, today }) => {
  return (
    <View style={styles.calendarCard}>
      <Text style={styles.sectionTitle}>Calendar</Text>
      <Calendar
        style={styles.calendar}
        hideExtraDays
        theme={{
          textDayFontSize: 16,
          textMonthFontSize: 18,
          todayTextColor: "#2420f9",
          arrowColor: "#2420f9",
        }}
        dayComponent={({ date }) => {
          const d = dayjs(date.dateString);
          const isToday = d.isSame(today, "day");
          const dayTasks = tasks.filter((t) =>
            dayjs(t.deadline).isSame(d, "day")
          );

          return (
            <View style={[styles.dayBox, isToday && styles.todayBox]}>
              <Text style={[styles.dayText, isToday && styles.todayText]}>
                {date.day}
              </Text>
              {dayTasks.slice(0, 3).map((t) => (
                <View
                  key={t.id}
                  style={[styles.taskLine, { backgroundColor: t.color || "#bbb" }]}
                >
                  <Text numberOfLines={1} style={styles.taskLineText}>
                    {t.name}
                  </Text>
                </View>
              ))}
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calendarCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#111",
  },
  calendar: { borderRadius: 10 },
  dayBox: { alignItems: "center", paddingVertical: 4 },
  todayBox: {
    backgroundColor: "#eef1ff",
    borderRadius: 8,
    padding: 4,
  },
  dayText: { fontSize: 15, color: "#333" },
  todayText: { fontWeight: "700", color: "#2420f9" },
  taskLine: {
    marginTop: 2,
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  taskLineText: { fontSize: 10, color: "#fff" },
});
