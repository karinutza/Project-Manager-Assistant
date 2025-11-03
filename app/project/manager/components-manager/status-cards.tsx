import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Task = {
    id?: string;
    name: string;
    departments: string[];
    color: string;
    deadline: string;
    createdAt: string;
    done?: boolean;
    progress?: number;
    startDate?: string;
    cost?: number;
};

type Props = {
    pastDue: Task[];
    inProgress: Task[];
    done: Task[];
    departmentColors: Record<string, string>;
    textColorForBg: (hex: string) => string;
    onMarkDone?: (taskId?: string) => void;
    onEditTask?: (taskId?: string) => void;
};

export default function StatusCards({
    pastDue,
    inProgress,
    done,
    departmentColors,
    textColorForBg,
    onMarkDone,
    onEditTask,
}: Props) {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [filteredPastDue, setFilteredPastDue] = useState<Task[]>([]);
    const [filteredInProgress, setFilteredInProgress] = useState<Task[]>([]);
    const [filteredDone, setFilteredDone] = useState<Task[]>([]);

    useEffect(() => {
        const today = dayjs();

        setFilteredPastDue(
            pastDue.filter((t) => {
                const deadlineDate = dayjs(t.deadline);
                return deadlineDate.isBefore(today) && !t.done;
            })
        );

        setFilteredInProgress(
            inProgress.filter((t) => {
                const deadlineDate = dayjs(t.deadline);
                return deadlineDate.isAfter(today) && !t.done;
            })
        );

        setFilteredDone(done.filter((t) => t.done === true));
    }, [pastDue, inProgress, done]);

    const openOptions = (task: Task) => {
        setSelectedTask(task);
        setModalVisible(true);
    };

    const closeOptions = () => {
        setModalVisible(false);
        setSelectedTask(null);
    };

    const handleMarkDone = () => {
        if (onMarkDone && selectedTask) onMarkDone(selectedTask.id);
        closeOptions();
    };

    const handleEditTask = () => {
        if (onEditTask && selectedTask) onEditTask(selectedTask.id);
        closeOptions();
    };

    const renderList = (items: Task[]) => {
        if (!items || items.length === 0)
            return <Text style={styles.emptyText}>No tasks</Text>;

        return (
            <ScrollView style={styles.list} nestedScrollEnabled>
                {items.map((task) => {
                    const dept = task.departments[0];
                    const color = dept ? departmentColors[dept] : "#6366f1";
                    const textColor = textColorForBg(color);
                    return (
                        <TouchableOpacity
                            key={task.id ?? task.name}
                            onPress={() => openOptions(task)}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={[`${color}EE`, `${color}AA`]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={[styles.taskCard, { borderColor: color, borderWidth: 1.5 }]}
                            >
                                <Text
                                    style={[styles.taskTitle, { color: textColor }]}
                                    numberOfLines={1}
                                >
                                    {task.name}
                                </Text>
                                <Text
                                    style={[styles.taskDept, { color: textColor }]}
                                    numberOfLines={1}
                                >
                                    {dept}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        );
    };

    const getColumnColor = (tasks: Task[]) => {
        if (tasks.length === 0) return "#f1f5f9";
        const dept = tasks[0].departments[0];
        return departmentColors[dept] || "#e2e8f0";
    };

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View
                    style={[
                        styles.col,
                        { backgroundColor: `${getColumnColor(filteredPastDue)}22` },
                    ]}
                >
                    <Text style={[styles.colTitle, { color: "#ef4444" }]}>🔴 Past Due</Text>
                    {renderList(filteredPastDue)}
                </View>

                <View
                    style={[
                        styles.col,
                        { backgroundColor: `${getColumnColor(filteredInProgress)}22` },
                    ]}
                >
                    <Text style={[styles.colTitle, { color: "#6366f1" }]}>🔵 In Progress</Text>
                    {renderList(filteredInProgress)}
                </View>

                <View
                    style={[
                        styles.col,
                        { backgroundColor: `${getColumnColor(filteredDone)}22` },
                    ]}
                >
                    <Text style={[styles.colTitle, { color: "#22c55e" }]}>✅ Done</Text>
                    {renderList(filteredDone)}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 4,
        margin: 12,
    },
    header: {
        fontSize: 22,
        fontWeight: "800",
        color: "#0f172a",
        marginBottom: 20,
        textAlign: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 14,
    },
    list: {
        maxHeight: 200,
    },
    emptyText: {
        fontSize: 14,
        color: "#475569",
        fontStyle: "italic",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        width: "88%",
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 24,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1e293b",
        marginBottom: 18,
        textAlign: "center",
    },
    modalButton: {
        width: "100%",
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 12,
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },
    markDone: {
        backgroundColor: "#22c55e",
    },
    editTask: {
        backgroundColor: "#6366f1",
    },
    cancel: {
        backgroundColor: "#f1f5f9",
    },
    modalButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
    col: {
  flex: 1,
  borderRadius: 18,
  padding: 18, // puțin mai mult padding pentru uniformitate
  minHeight: 260,
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowRadius: 8,
  elevation: 3,
},
colTitle: {
  fontWeight: "700",
  fontSize: 18,
  marginBottom: 12,
  textAlign: "center",
},
taskCard: {
  borderRadius: 16,
  paddingVertical: 16,
  paddingHorizontal: 18,
  marginBottom: 12,
},
taskTitle: { fontSize: 16, fontWeight: "700" },
taskDept: { fontSize: 14, opacity: 0.85, marginTop: 4 },

});
