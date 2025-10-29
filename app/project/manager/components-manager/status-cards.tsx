import React, { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Task = {
    id?: string;
    name: string;
    departments?: string[];
    color?: string;
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

export default function StatusCards({ pastDue, inProgress, done, departmentColors, textColorForBg, onMarkDone, onEditTask }: Props) {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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
        if (!items || items.length === 0) return <Text style={styles.emptyText}>No tasks</Text>;
        return (
            <ScrollView style={styles.list} nestedScrollEnabled>
                {items.map((task) => {
                    const dept = task.departments?.[0] ?? "General";
                    const color = departmentColors[dept] ?? task.color ?? "#1b18b6";
                    const textColor = textColorForBg(color);
                    return (
                        <TouchableOpacity key={task.id ?? task.name} onPress={() => openOptions(task)} activeOpacity={0.85}>
                            <View style={[styles.taskCard, { backgroundColor: color }]}>
                                <Text style={[styles.taskTitle, { color: textColor }]} numberOfLines={1} ellipsizeMode="tail">{task.name}</Text>
                                <Text style={[styles.taskDept, { color: textColor }]} numberOfLines={1} ellipsizeMode="tail">{dept}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Task Status</Text>
            <View style={styles.row}>
                <View style={[styles.col, styles.pastDue]}>
                    <Text style={styles.colTitle}>Past Due</Text>
                    {renderList(pastDue)}
                </View>

                <View style={[styles.col, styles.inProgress]}>
                    <Text style={styles.colTitle}>In Progress</Text>
                    {renderList(inProgress)}
                </View>

                <View style={[styles.col, styles.done]}>
                    <Text style={styles.colTitle}>Done</Text>
                    {renderList(done)}
                </View>
            </View>

            <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeOptions}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>{selectedTask?.name}</Text>
                        <TouchableOpacity style={[styles.modalButton, styles.markDone]} onPress={handleMarkDone}>
                            <Text style={styles.modalButtonText}>Mark as Done</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, styles.editTask]} onPress={handleEditTask}>
                            <Text style={styles.modalButtonText}>Edit Task</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, styles.cancel]} onPress={closeOptions}>
                            <Text style={[styles.modalButtonText, { color: "#444" }]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    // add margins so the card doesn't touch sibling components or screen edges
    container: { backgroundColor: "#fff", borderRadius: 12, padding: 12, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, marginVertical: 8, marginHorizontal: 8 },
    header: { fontSize: 18, fontWeight: "700", color: "#0f1724", marginBottom: 10, paddingHorizontal: 8, },
    row: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
    col: { flex: 1, padding: 8, borderRadius: 10, backgroundColor: "#fafafa", minHeight: 100 },
    colTitle: { fontWeight: "700", marginBottom: 8, color: "#111827" },
    list: { maxHeight: 160 },
    taskCard: { borderRadius: 8, paddingVertical: 8, paddingHorizontal: 10, marginBottom: 8, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
    taskTitle: { fontSize: 14, fontWeight: "700" },
    taskDept: { fontSize: 12, opacity: 0.9, marginTop: 4 },
    emptyText: { fontSize: 13, color: "#9ca3af", fontStyle: "italic" },
    pastDue: { borderLeftWidth: 4, borderLeftColor: "#ff3333" },
    inProgress: { borderLeftWidth: 4, borderLeftColor: "#1b18b6" },
    done: { borderLeftWidth: 4, borderLeftColor: "#00a643" },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", alignItems: "center" },
    modalBox: { width: "86%", backgroundColor: "#fff", borderRadius: 12, padding: 16, alignItems: "center" },
    modalTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12, textAlign: "center" },
    modalButton: { width: "100%", paddingVertical: 12, borderRadius: 10, alignItems: "center", marginTop: 8 },
    markDone: { backgroundColor: "#00a643" },
    editTask: { backgroundColor: "#1b18b6" },
    cancel: { backgroundColor: "#f3f4f6" },
    modalButtonText: { color: "#fff", fontWeight: "700" },
});
