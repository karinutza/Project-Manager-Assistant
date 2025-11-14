import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useMemo } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";
import BurgerMenu from "./burger-menu-manager";

export default function CalendarDay() {
    const params = useLocalSearchParams();
    const date = (params.date as string) || undefined;
    const [open, setOpen] = useState(false);

    // Dacă există projects din params, folosim acelea; altfel, mock data
    const projects = useMemo(() => {
        try {
            if (params.projects) return JSON.parse(decodeURIComponent(String(params.projects)));
        } catch {}
        // Mock data
        return [
            { id: 1, name: "Project Alpha", deadline: "2025-11-16", color: "#1b18b6" },
            { id: 2, name: "Project Beta", deadline: "2025-11-18", color: "#2962FF" },
            { id: 3, name: "Project Gamma", deadline: "2025-11-18", color: "#33C1FF" },
            { id: 4, name: "Project Delta", deadline: "2025-11-20", color: "#004f2fff" },
            { id: 5, name: "Project Epsilon", deadline: "2025-11-22", color: "#26A69A" },
            { id: 6, name: "Project Zeta", deadline: "2025-11-25", color: "#00a643ff" },
        ];
    }, [params.projects]);

    const progressPercent = projects.length
        ? Math.round(projects.reduce((sum: any, p: any) => sum + (p.progress || 0), 0) / projects.length)
        : 0;

    const inProgress = projects.filter((p: any) => (p.progress || 0) < 100).length;

    // markedDates pe baza proiectelor
    const markedDates = useMemo(() => {
        const marks: Record<string, any> = {};
        projects.forEach((p: any) => {
            if (!p.deadline) return;
            if (!marks[p.deadline]) marks[p.deadline] = { dots: [] };
            marks[p.deadline].dots.push({ key: p.id?.toString() || Math.random().toString(), color: p.color || "#2962FF" });
        });
        return marks;
    }, [projects]);

    const { height } = Dimensions.get("window");
    const calendarHeight = Math.min(700, Math.round(height * 0.8));

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F7FB" }}>
            <View style={{ position: "relative" }}>
                {/* HEADER TOOLBAR */}
                <LinearGradient
                    colors={["#2962FF", "#4FC3F7"]}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={styles.toolbarContainer}
                >
                    <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                            style={[styles.iconButton, { marginRight: 8 }]}
                            onPress={() => setOpen(true)}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="menu" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => router.push("/project/manager/pages-manager/manager-log-page")}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="arrow-back" size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.iconButton} onPress={() => { }} activeOpacity={0.8}>
                        <Ionicons name="refresh" size={18} color="#fff" />
                    </TouchableOpacity>
                </LinearGradient>

                {open && (
                    <>
                        <TouchableOpacity
                            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "transparent", zIndex: 1 }}
                            activeOpacity={1}
                            onPress={() => setOpen(false)}
                        />
                        <BurgerMenu closeMenu={() => setOpen(false)} />
                    </>
                )}

                {/* HEADER GRADIENT KPI */}
                <LinearGradient
                    colors={["#2962FF", "#4FC3F7"]}
                    start={[0, 0]}
                    end={[1, 0]}
                    style={styles.headerGradient}
                >
                    <View style={styles.headerRow}>
                        <View style={styles.headerTitleWrap}>
                            <Text style={styles.headerTitle}>Project Calendar</Text>
                            <Text style={styles.headerSubtitle}>Overview & deadlines</Text>
                        </View>
                    </View>
                    <View style={styles.headerKpiRow}>
                        <View style={styles.headerKpi}>
                            <Text style={styles.headerKpiLabel}>Overall</Text>
                            <Text style={styles.headerKpiValue}>{progressPercent}%</Text>
                        </View>
                        <View style={styles.headerKpi}>
                            <Text style={styles.headerKpiLabel}>Projects</Text>
                            <Text style={styles.headerKpiValue}>{projects.length}</Text>
                        </View>
                        <View style={styles.headerKpi}>
                            <Text style={styles.headerKpiLabel}>In Progress</Text>
                            <Text style={styles.headerKpiValue}>{inProgress}</Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingTop: 6 }}>
                {/* Calendar */}
                <View style={[styles.calendarCard, { height: calendarHeight }]}>
                    <Calendar
                        current={date}
                        markingType="multi-dot"
                        markedDates={markedDates}
                        dayComponent={(dayProps) => {
                            const { date: d, marking, onPress, state } = dayProps as any;
                            const DAY_SIZE = 64;
                            const dots = (marking && marking.dots) || [];
                            const tabs = dots.map((dot: any, index: number) => (
                                <View key={index} style={{ height: 6, width: 24, borderRadius: 3, backgroundColor: dot.color, marginHorizontal: 1 }} />
                            ));

                            return (
                                <TouchableOpacity
                                    onPress={() => onPress && onPress(d)}
                                    activeOpacity={0.8}
                                    style={{ width: DAY_SIZE, height: DAY_SIZE, marginVertical: 6, alignItems: "center", justifyContent: "center" }}
                                >
                                    <View
                                        style={{
                                            width: DAY_SIZE - 6,
                                            height: DAY_SIZE - 6,
                                            borderRadius: 10,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: state === "disabled" ? "#f6f7fb" : "#fff",
                                            borderWidth: state === "today" ? 2 : 1,
                                            borderColor: state === "today" ? "#1b18b6" : "#e0e0e0",
                                        }}
                                    >
                                        <Text style={{ fontSize: 18, color: state === "disabled" ? "#b8bac8" : "#0f1724", fontWeight: state === "today" ? "700" : "600" }}>
                                            {d.day}
                                        </Text>
                                        <View style={{ position: "absolute", bottom: 6, flexDirection: "row" }}>{tabs}</View>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                        onDayPress={(d) => {
                            const payload = encodeURIComponent(
                                JSON.stringify(projects.map((p) => ({ id: p.id, name: p.name, color: p.color, deadline: p.deadline })))
                            );
                            router.push({ pathname: "/project/CalendarDay", params: { date: d.dateString, projects: payload } } as any);
                        }}
                        theme={{
                            todayTextColor: "#1b18b6",
                            arrowColor: "#2962FF",
                            monthTextColor: "#0f1724",
                            textDayFontSize: 18,
                            textMonthFontSize: 20,
                            selectedDayBackgroundColor: "#33C1FF",
                            dotColor: "#26A69A",
                            selectedDotColor: "#00a643ff",
                        }}
                        style={styles.calendar}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    toolbarContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, paddingVertical: 12, borderBottomWidth: 0, borderBottomColor: "rgba(255,255,255,0.15)", shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
    iconButton: { width: 44, height: 44, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center", marginRight: 8 },
    headerGradient: { paddingTop: 20, paddingBottom: 14, paddingHorizontal: 16, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginBottom: 12, elevation: 6 },
    headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    headerTitleWrap: { flex: 1, paddingHorizontal: 12, alignItems: "center" },
    headerTitle: { color: "#fff", fontSize: 20, fontWeight: "800", textAlign: "center" },
    headerSubtitle: { color: "rgba(255,255,255,0.9)", fontSize: 12, marginTop: 4, textAlign: "center" },
    headerKpiRow: { flexDirection: "row", marginTop: 12, justifyContent: "space-between", gap: 8 },
    headerKpi: { flex: 1, alignItems: "center" },
    headerKpiLabel: { color: "rgba(255,255,255,0.9)", fontSize: 12 },
    headerKpiValue: { color: "#fff", fontSize: 16, fontWeight: "800", marginTop: 6 },
    calendarCard: { backgroundColor: "#fff", borderRadius: 16, marginVertical: 18, marginHorizontal: 6, shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 4, elevation: 3, overflow: "hidden" },
    calendar: { borderRadius: 12, overflow: "hidden" },
});
