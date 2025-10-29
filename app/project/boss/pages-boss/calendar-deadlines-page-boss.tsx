import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import Toolbar from "../components-boss/toolbar-boss";

import React from "react";
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { Calendar } from "react-native-calendars";

export default function CalendarDay() {
    const params = useLocalSearchParams();
    const date = (params.date as string) || undefined;

    let projects: Array<{ id?: string; name?: string; color?: string; deadline?: string }> = [];
    if (params.projects) {
        try {
            const parsed = JSON.parse(decodeURIComponent(String(params.projects)));
            if (Array.isArray(parsed)) projects = parsed;
        } catch { }
    }

    const markedDates: Record<string, any> = {};
    projects.forEach((p) => {
        if (!p.deadline) return;
        if (!markedDates[p.deadline]) markedDates[p.deadline] = { dots: [] };
        markedDates[p.deadline].dots.push({
            key: p.id || p.name || Math.random().toString(),
            color: p.color || "#999",
        });
    });

    const { height } = Dimensions.get("window");
    const calendarHeight = Math.min(700, Math.round(height * 0.8));

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {/* Toolbar */}
                <Toolbar />

                <View style={styles.content}>
                    {/* Full-width Home Button */}
                    <TouchableOpacity style={styles.homeButton} onPress={() => router.push("/project/boss/pages-boss/project-page-boss")}>
                        <Ionicons name="arrow-back" size={20} color="#fff" />
                        <Text style={styles.homeButtonText}>Home</Text>
                    </TouchableOpacity>

                    <Text style={styles.pageTitle}>Project Calendar</Text>
                    <Text style={styles.subTitle}>View all project deadlines and key dates</Text>

                    {/* Calendar Section */}
                    <View style={[styles.calendarCard, { height: calendarHeight }]}>
                        <Calendar
                            current={date}
                            markingType="multi-dot"
                            markedDates={markedDates}
                            // Use a custom day component so we can control the day "square" size
                            dayComponent={(dayProps) => {
                                const { date: d, marking, onPress, state } = dayProps as any;
                                const DAY_SIZE = 64; // larger square size
                                const dots = (marking && marking.dots) || [];

                                return (
                                    <TouchableOpacity
                                        onPress={() => onPress && onPress(d)}
                                        activeOpacity={0.8}
                                        style={{
                                            width: DAY_SIZE,
                                            height: DAY_SIZE,
                                            marginVertical: 6,
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: DAY_SIZE - 6,
                                                height: DAY_SIZE - 6,
                                                borderRadius: 10,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                backgroundColor: state === "disabled" ? "#f6f7fb" : "transparent",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 18,
                                                    color: state === "disabled" ? "#b8bac8" : "#0f1724",
                                                    fontWeight: state === "today" ? "700" : "600",
                                                }}
                                            >
                                                {d.day}
                                            </Text>

                                            {/* dots */}
                                            <View style={{ position: "absolute", bottom: 6, flexDirection: "row" }}>
                                                {dots.map((dot: any) => (
                                                    <View
                                                        key={dot.key}
                                                        style={{
                                                            width: 8,
                                                            height: 8,
                                                            borderRadius: 4,
                                                            backgroundColor: dot.color || "#999",
                                                            marginHorizontal: 2,
                                                        }}
                                                    />
                                                ))}
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            }}
                            onDayPress={(d) => {
                                try {
                                    const payload = encodeURIComponent(
                                        JSON.stringify(
                                            projects.map((p) => ({
                                                id: p.id,
                                                name: p.name,
                                                color: p.color,
                                                deadline: p.deadline,
                                            }))
                                        )
                                    );
                                    router.push({
                                        pathname: "/project/CalendarDay",
                                        params: { date: d.dateString, projects: payload },
                                    } as any);
                                } catch {
                                    router.push({ pathname: "/project/CalendarDay", params: { date: d.dateString } } as any);
                                }
                            }}
                            theme={{
                                todayTextColor: "#1b18b6",
                                arrowColor: "#1b18b6",
                                monthTextColor: "#0f1724",
                                textDayFontSize: 18,
                                textMonthFontSize: 20,
                            }}
                            style={styles.calendar}
                        />
                    </View>

                    <Text style={styles.footerNote}>Select a date to explore related project tasks.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f7f8fc" },
    content: { flex: 1, padding: 20 },
    homeButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1b18b6",
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 12,
        width: "100%",
        justifyContent: "flex-start",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 14,
    },
    homeButtonText: {
        color: "#fff",
        marginLeft: 10,
        fontWeight: "700",
        fontSize: 16,
        letterSpacing: 0.3,
    },
    pageTitle: {
        fontSize: 32,
        fontWeight: "700",
        color: "#1b18b6",
        textAlign: "center",
        marginTop: 8,
    },
    subTitle: { color: "#555", fontSize: 15, textAlign: "center", marginTop: 6 },
    calendarCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        marginVertical: 18,
        marginHorizontal: 6,
        shadowColor: "#000",
        shadowOpacity: 0.07,
        shadowRadius: 4,
        elevation: 3,
        overflow: "hidden",
    },
    calendar: { borderRadius: 12, overflow: "hidden" },
    footerNote: {
        color: "#555",
        fontStyle: "italic",
        textAlign: "center",
        marginTop: 10,
    },
});
