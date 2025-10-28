import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";

import PageFooter from "../project/components/PageFooter";
import StatusCards from "../project/components/StatusCards";
import Toolbar from "./components/Toolbar_manager";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProjectPage(): React.ReactElement {
  const { id } = useLocalSearchParams();

  type Task = {
    name: string;
    departments: string[];
    color: string;
    deadline: string;
    createdAt: string;
    done?: boolean;
    progress?: number;
    id?: string;
  };

  type Project = {
    id: string | number | undefined;
    name: string;
    description: string;
    deadline?: string;
  };

  const existing: Project | null = null;

  const [project, setProject] = useState<Project>(
    existing || {
      id,
      name: `Project ${id}`,
      description: " ",
    } as Project
  );

  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<{ id: string; text: string; date: string; checked?: boolean }[]>([]);
  const [noteModal, setNoteModal] = useState(false);
  const [editNoteModal, setEditNoteModal] = useState(false);
  const [noteBeingEdited, setNoteBeingEdited] = useState<{ id: string; text: string } | null>(null);
  const [newNote, setNewNote] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTaskModalVisible, setEditTaskModalVisible] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number | null>(null);
  const [warning, setWarning] = useState("");

  const [taskData, setTaskData] = useState<Task>({
    name: "",
    departments: [],
    color: "",
    deadline: "",
    createdAt: dayjs().format("YYYY-MM-DD"),
    done: false,
    progress: 0,
  });

  const [editData, setEditData] = useState<{ name: string; description: string; deadline?: string }>(
    {
      name: project?.name ?? "",
      description: project?.description ?? "",
      deadline: project?.deadline ?? "",
    }
  );

  // Keep editData.deadline in sync with project.deadline (e.g. when saved elsewhere)
  useEffect(() => {
    setEditData((prev) => ({
      ...prev,
      deadline: project?.deadline ?? "",
    }));
  }, [project.deadline]);

  // When the user picks a date in the edit modal, reflect it immediately in the Overview card
  useEffect(() => {
    if (project?.deadline !== editData.deadline) {
      setProject((prev) => ({ ...prev, deadline: editData.deadline }));
    }
    // we only care about deadline changes here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData.deadline]);

  const departmentsList = [
    "Design Mecanic",
    "Design Electric",
    "Purchasing",
    "Tooling Shop",
    "Assamblare Mecanica",
    "Assamblare Electrica",
    "Assamblare Finala",
    "Software Offline",
    "Software Debug",
    "Teste",
    "Livrare",
  ];

  const departmentColors: Record<string, string> = {
    "Design Mecanic": "#ff16d4ff",
    "Design Electric": "#33C1FF",
    Purchasing: "#004f2fff",
    "Tooling Shop": "#17e100ff",
    "Assamblare Mecanica": "#ff3333ff",
    "Assamblare Electrica": "#FF8F33",
    "Assamblare Finala": "#8F33FF",
    "Software Offline": "#008c85ff",
    "Software Debug": "#00a643ff",
    Teste: "#3a33ffff",
    Livrare: "#d454ffff",
  };

  const colors = [
    "#FF6B6B",
    "#FFD93D",
    "#6BCB77",
    "#4D96FF",
    "#B983FF",
    "#FF8C42",
    "#00C9A7",
    "#FF4E88",
    "#1B9CFC",
    "#C56CF0",
  ];

  const today = dayjs();

  // pick readable text color for a background hex (simple luminance check)
  function textColorForBg(hex: string) {
    try {
      const h = (hex || "#000").replace("#", "").slice(0, 6);
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.65 ? "#000" : "#fff";
    } catch (e) {
      return "#fff";
    }
  }

  // === WARNINGS ===
  useEffect(() => {
    if (!warning) return;
    const timer = setTimeout(() => setWarning(""), 20000);
    return () => clearTimeout(timer);
  }, [warning]);

  // === ADD TASK ===
  function addTask() {
    if (!taskData.name) return setWarning("Please enter a task name.");
    if (!taskData.deadline) return setWarning("Please select a deadline.");
    if (taskData.departments.length === 0) return setWarning("Please select at least one department.");

    // Pick a color based on the first selected department
    const firstDept = taskData.departments[0];
    const deptColor = departmentColors[firstDept] ?? "#1b18b6";

    const newTask: Task = {
      ...taskData,
      color: deptColor,
      createdAt: dayjs().format("YYYY-MM-DD"),
      // ensure every task has an id for referencing
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}` as unknown as any,
      progress: taskData.progress ?? 0,
    };

    setTasks((prev) => [...prev, newTask]);
    setTaskData({ name: "", departments: [], color: "", deadline: "", createdAt: "", done: false, progress: 0 });
    setShowModal(false);
    setWarning("");
  }

  function toggleTask(taskId: any) {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)));
  }

  function addNote() {
    if (!newNote || newNote.trim() === "") return setNoteModal(false);
    const note = { id: `${Date.now()}`, text: newNote.trim(), date: dayjs().format("YYYY-MM-DD") };
    setNotes((prev) => [note, ...prev]);
    setNewNote("");
    setNoteModal(false);
  }

  function toggleNoteChecked(noteId: string) {
    setNotes((prev) => {
      const updated = prev.map((n) =>
        n.id === noteId ? { ...n, checked: !n.checked } : n
      );
      // Move checked notes to bottom
      return [...updated.filter((n) => !n.checked), ...updated.filter((n) => n.checked)];
    });
  }

  function editNote(noteId: string, newText: string) {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, text: newText } : n))
    );
  }


  const [selectTaskModalVisible, setSelectTaskModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskOptions, setShowTaskOptions] = useState(false);

  const inProgress = tasks.filter((t) => dayjs(t.deadline).isAfter(today) && !t.done);
  const pastDue = tasks.filter((t) => dayjs(t.deadline).isBefore(today));
  const done = tasks.filter((t) => t.done);
  const [allNotesModal, setAllNotesModal] = useState(false);
  function chooseTaskToEdit(index: number) {
    setSelectedTaskIndex(index);
    setTaskData(tasks[index]);
    setSelectTaskModalVisible(false);
    setEditTaskModalVisible(true);
  }

  function saveEditedTask() {
    if (selectedTaskIndex === null) {
      setWarning("No task selected to save.");
      return;
    }
    const updated = [...tasks];
    updated[selectedTaskIndex] = taskData;
    setTasks(updated);
    setEditTaskModalVisible(false);
    setWarning("");
  }

  function saveProjectEdits() {
    if (!editData.name || editData.name.trim().length === 0) {
      setWarning("Project name cannot be empty.");
      return;
    }
    const updated = { ...project, ...editData };
    setProject(updated);
    try {
      const payload = encodeURIComponent(JSON.stringify(updated));
      router.push({ pathname: "/", params: { updatedProject: payload } } as any);
    } catch (e) {
      // ignore
    }
    setEditModalVisible(false);
  }



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Toolbar */}
        <Toolbar />

        <View style={styles.content}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push("/")}>
            <Ionicons name="arrow-back" size={18} color="#fff" />
            <Text style={styles.backButtonText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              setEditData({ name: project?.name ?? "", description: project?.description ?? "", deadline: project?.deadline ?? "" });
              setEditModalVisible(true);
            }}
          >
            <Ionicons name="create-outline" size={18} color="#fff" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>

          <Text style={styles.projectName}>{project.name}</Text>
          <Text style={styles.projectDescription}>{project.description}</Text>

          {/* Overview / Tasks / Notes / Schedule (combined UI) */}
          <ScrollView style={styles.scroll} nestedScrollEnabled>
            {/* Overview Card */}
            <View style={styles.cardOverview}>
              <Text style={styles.sectionTitle}>Overview</Text>
              <Text style={styles.label}>Deadline: <Text style={styles.value}>{project.deadline ?? '—'}</Text></Text>
              <Text style={styles.label}>Progress: <Text style={styles.progress}>{
                tasks.length ? Math.round(tasks.reduce((a, t) => a + (t.progress ?? 0), 0) / tasks.length) : 0
              }%</Text></Text>
              <Text style={styles.description}>{project.description}</Text>

              <TouchableOpacity
                onPress={() => {
                  try {
                    const payload = encodeURIComponent(
                      JSON.stringify(
                        tasks.map((t) => ({
                          name: t.name,
                          progress: t.progress ?? 0,
                          department: (t.departments && t.departments[0]) || "General",
                        }))
                      )
                    );
                    router.push({
                      pathname: "/project/AnalyticsPage",
                      params: { id: project.id, tasks: payload },
                    } as any);
                  } catch (e) {
                    router.push(("/project/AnalyticsPage" as unknown) as any);
                  }
                }}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={["#1b18b6", "rgba(32, 99, 244, 1)", "#2420f9ff"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.progressButton}
                >
                  <Text style={styles.progressButtonText}>See Progress & Data</Text>
                </LinearGradient>
              </TouchableOpacity>

            </View>

            {/* Spacer between Overview and Tasks */}
            <View style={styles.calendarEmptyRow} />
            {/* Tasks */}
            <View style={styles.cardTasks}>
              <Text style={styles.sectionTitle}>Tasks</Text>
              {tasks.map((t) => (
                <TouchableOpacity
                  key={t.id ?? t.name}
                  style={[styles.taskRow, t.done ? styles.taskDone : null]}
                  onPress={() => toggleTask(t.id ?? t.name)}
                >
                  <Ionicons
                    name={t.done ? "checkmark-circle" : "ellipse-outline"}
                    size={22}
                    color={t.done ? "#1b18b6" : "#aaa"}
                  />
                  <Text
                    style={[styles.taskText, t.done ? { textDecorationLine: "line-through", color: "#999" } : null]}
                  >
                    {t.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Spacer between Tasks and Notes */}
            <View style={styles.calendarEmptyRow} />
            {/* Notes */}
            <View style={styles.cardNotes}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Notes</Text>
                <TouchableOpacity onPress={() => setNoteModal(true)}>
                  <Ionicons name="add-circle" size={24} color="#1b18b6" />
                </TouchableOpacity>
              </View>
              {notes.slice(0, 5).map((n) => (
                <View key={n.id} style={[styles.noteItem, n.checked && { opacity: 0.6 }]}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text
                      style={[
                        styles.noteText,
                        n.checked && { textDecorationLine: "line-through", color: "#999" }
                      ]}
                    >
                      {n.text}
                    </Text>
                    <View style={{ flexDirection: "row", gap: 10 }}>
                      <TouchableOpacity
                        onPress={() => {
                          setNoteBeingEdited(n);
                          setEditNoteModal(true);
                        }}
                      >
                        <Ionicons name="create-outline" size={20} color="#1b18b6" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => toggleNoteChecked(n.id)}>
                        <Ionicons
                          name={n.checked ? "checkmark-circle" : "ellipse-outline"}
                          size={22}
                          color={n.checked ? "#1b18b6" : "#aaa"}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.noteDate}>{n.date}</Text>
                </View>
              ))}

              {notes.length > 3 && (
                <TouchableOpacity onPress={() => setAllNotesModal(true)} style={styles.seeMoreButton}>
                  <Text style={styles.seeMoreText}>See More</Text>
                </TouchableOpacity>
              )}

            </View>

            <Modal visible={allNotesModal} transparent animationType="slide" onRequestClose={() => setAllNotesModal(false)}>
              <View style={styles.modalOverlay}>
                <View style={[styles.modalBox, { width: "90%", maxHeight: "80%" }]}>
                  <Text style={styles.modalTitle}>All Notes</Text>
                  <ScrollView>
                    {notes.map((n) => (
                      <View key={n.id} style={[styles.noteItem, n.checked && { opacity: 0.6 }]}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                          <Text
                            style={[
                              styles.noteText,
                              n.checked && { textDecorationLine: "line-through", color: "#999" }
                            ]}
                          >
                            {n.text}
                          </Text>
                          <View style={{ flexDirection: "row", gap: 10 }}>
                            <TouchableOpacity
                              onPress={() => {
                                setNoteBeingEdited(n);
                                setEditNoteModal(true);
                              }}
                            >
                              <Ionicons name="create-outline" size={20} color="#1b18b6" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => toggleNoteChecked(n.id)}>
                              <Ionicons
                                name={n.checked ? "checkmark-circle" : "ellipse-outline"}
                                size={22}
                                color={n.checked ? "#1b18b6" : "#aaa"}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                        <Text style={styles.noteDate}>{n.date}</Text>
                      </View>
                    ))}
                  </ScrollView>

                  <TouchableOpacity onPress={() => setAllNotesModal(false)} style={[styles.addButton, { backgroundColor: "#aaa" }]}>
                    <Text style={styles.addButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>


            {/* NOTE MODAL */}
            <Modal visible={noteModal} transparent animationType="slide" onRequestClose={() => setNoteModal(false)}>
              <View style={styles.modalOverlay}>
                <View style={[styles.modalBox, { width: "90%" }]}>
                  <Text style={styles.modalTitle}>Add Note</Text>
                  <TextInput
                    placeholder="Write a note..."
                    style={[styles.input, { minHeight: 80, textAlignVertical: "top" }]}
                    multiline
                    value={newNote}
                    onChangeText={(text) => setNewNote(text)}
                  />
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                    <TouchableOpacity onPress={() => { setNewNote(""); setNoteModal(false); }}>
                      <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={addNote}>
                      <Text style={styles.saveText}>Save Note</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            <Modal
              visible={editNoteModal}
              transparent
              animationType="slide"
              onRequestClose={() => setEditNoteModal(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={[styles.modalBox, { width: "90%" }]}>
                  <Text style={styles.modalTitle}>Edit Note</Text>
                  <TextInput
                    style={[styles.input, { minHeight: 80, textAlignVertical: "top" }]}
                    multiline
                    value={noteBeingEdited?.text || ""}
                    onChangeText={(text) =>
                      setNoteBeingEdited((prev) => (prev ? { ...prev, text } : null))
                    }
                  />
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                    <TouchableOpacity onPress={() => setEditNoteModal(false)}>
                      <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (noteBeingEdited) editNote(noteBeingEdited.id, noteBeingEdited.text);
                        setEditNoteModal(false);
                      }}
                    >
                      <Text style={styles.saveText}>Save Changes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
            {/* Spacer between Notes and Schedule */}
            <View style={styles.calendarEmptyRow} />
          </ScrollView>

          {/* Calendar / Schedule */}
          {/* Calendar / Schedule */}

          {/* Calendar / Schedule */}
          {/* Calendar / Schedule */}
          <View style={styles.cardSchedule}>
            <Text style={styles.sectionTitle}>Schedule</Text>

            <Calendar
              style={styles.professionalCalendar}
              markingType="multi-dot"
              dayComponent={({ date, state }) => {
                if (!date) return null;

                const d = dayjs(date.dateString);
                const isToday = d.isSame(today, "day");

                const dayTasks = tasks.filter((task) => {
                  if (!task.deadline) return false;
                  const tDate = dayjs(task.deadline);
                  return d.isSame(tDate, "day");
                });

                // render up to two tasks as raised chips with name and department
                const visible = dayTasks.slice(0, 2);
                const extra = Math.max(0, dayTasks.length - visible.length);

                return (
                  <View style={[styles.dayBox, isToday && styles.todayBox, state === "disabled" && styles.dayBoxDisabled]}>
                    <View style={styles.dayNumberRow}>
                      <View style={[styles.dayNumberBadge, isToday && styles.dayNumberBadgeToday]}>
                        <Text style={[styles.dayText, isToday && styles.dayTextToday, state === "disabled" && styles.dayTextDisabled]}>{date.day}</Text>
                      </View>
                    </View>

                    <View style={styles.taskLinesColumn}>
                      {visible.map((task) => {
                        const dept = task.departments?.[0] ?? "General";
                        const color = departmentColors[dept] ?? task.color ?? "#1b18b6";
                        const textColor = textColorForBg(color);
                        return (
                          <View key={task.id} style={[styles.taskLine, { backgroundColor: color }]}>
                            <Text style={[styles.taskLineText, { color: textColor }]}>
                              {`${task.name} - ${dept}`}
                            </Text>
                          </View>
                        );
                      })}
                      {extra > 0 && <Text style={styles.moreText}>+{extra}</Text>}
                    </View>
                  </View>
                );
              }}
              theme={{
                backgroundColor: "#ffffff",
                calendarBackground: "#ffffff",
                textSectionTitleColor: "#1b18b6",
                monthTextColor: "#1b18b6",
                textMonthFontSize: 20,
                textMonthFontWeight: "700",
                arrowColor: "#1b18b6",
                todayBackgroundColor: "#EEF2FF",
                todayTextColor: "#1b18b6",
                textDayFontSize: 18,
                textDayFontWeight: "700",
                textDayStyle: { textAlign: "center" },
              }}
              firstDay={1}
              hideExtraDays={false}
              enableSwipeMonths={true}
            />
            <View style={{ marginTop: 12, alignItems: "center" }}>
              <TouchableOpacity onPress={() => setShowModal(true)} activeOpacity={0.9}>
                <LinearGradient
                  colors={["#1b18b6", "rgba(32, 99, 244, 1)", "#2420f9ff"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.gradientButton, { width: "70%" }]}
                >
                  <Ionicons name="add-circle-outline" size={22} color="#fff" />
                  <Text style={styles.addTaskButtonText}>Add Task</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>



          {/* Two empty rows under the calendar to reduce crowding */}
          <View style={styles.calendarEmptyRow} />
        </View>

        {/* Task Categories (replaced with a unified StatusCards component) */}
        <StatusCards
          pastDue={pastDue}
          inProgress={inProgress}
          done={done}
          departmentColors={departmentColors}
          textColorForBg={textColorForBg}
          onMarkDone={(taskId) => {
            if (!taskId) return;
            setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, done: true } : t)));
          }}
          onEditTask={(taskId) => {
            if (!taskId) {
              setWarning("No task selected to edit.");
              return;
            }
            const idx = tasks.findIndex((t) => t.id === taskId);
            if (idx === -1) {
              setWarning("Selected task not found.");
              return;
            }
            chooseTaskToEdit(idx);
          }}
        />

        {/* spacer rows after divider */}
        <View style={styles.calendarEmptyRow} />
        <View style={styles.calendarEmptyRow} />

        {/* ADD TASK MODAL */}
        <Modal visible={showModal} transparent animationType="slide" key={showModal ? "open" : "closed"}>
          {warning ? <Text style={styles.warningText}>{warning}</Text> : null}
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, styles.modalBoxTall]}>
              <ScrollView contentContainerStyle={styles.modalContentScroll}>
                <Text style={styles.modalTitle}>New Task</Text>

                <TextInput
                  placeholder="Task Name"
                  style={styles.input}
                  value={taskData.name}
                  onChangeText={(text) => setTaskData({ ...taskData, name: text })}
                />

                <Text style={styles.label}>Progress (%)</Text>
                <TextInput
                  placeholder="e.g. 35"
                  style={styles.input}
                  keyboardType="numeric"
                  value={String(taskData.progress ?? 0)}
                  onChangeText={(text) => {
                    const num = parseInt(text.replace(/[^0-9]/g, ""), 10);
                    setTaskData({ ...taskData, progress: Number.isNaN(num) ? 0 : Math.max(0, Math.min(100, num)) });
                  }}
                />

                <Text style={styles.label}>Select Department(s):</Text>
                {departmentsList.map((dep, idx) => (
                  <TouchableOpacity
                    key={dep}
                    style={styles.checkboxRow}
                    onPress={() => {
                      const exists = taskData.departments.includes(dep);
                      const updated = exists ? taskData.departments.filter((d) => d !== dep) : [...taskData.departments, dep];
                      const deptColor = departmentColors[dep];
                      const newColor = !exists ? deptColor ?? taskData.color : taskData.color;
                      setTaskData({ ...taskData, departments: updated, color: newColor });
                    }}
                  >
                    <Ionicons name={taskData.departments.includes(dep) ? "checkbox-outline" : "square-outline"} size={20} color="#1b18b6" />
                    <Text style={styles.checkboxLabel}>{dep}</Text>
                  </TouchableOpacity>
                ))}

                <Text style={styles.label}>Select Deadline:</Text>
                <Calendar
                  onDayPress={(day) => setTaskData({ ...taskData, deadline: day.dateString })}
                  markedDates={{
                    [taskData.deadline]: { selected: true, selectedColor: "#1b18b6" },
                  }}
                />

                <View style={styles.modalActions}>
                  <TouchableOpacity onPress={() => setShowModal(false)}>
                    <Text style={styles.cancelText}>Cancel</Text>
                    {warning ? <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>{warning}</Text> : null}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={addTask}>
                    <Text style={styles.saveText}>Add Task</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal visible={editTaskModalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, styles.modalBoxTall]}>
              <ScrollView contentContainerStyle={styles.modalContentScroll}>
                <Text style={styles.modalTitle}>Edit Task</Text>
                <TextInput
                  placeholder="Task Name"
                  style={styles.input}
                  value={taskData.name}
                  onChangeText={(text) => setTaskData({ ...taskData, name: text })}
                />

                <Text style={styles.label}>Progress (%)</Text>
                <TextInput
                  placeholder="e.g. 35"
                  style={styles.input}
                  keyboardType="numeric"
                  value={String(taskData.progress ?? 0)}
                  onChangeText={(text) => {
                    const num = parseInt(text.replace(/[^0-9]/g, ""), 10);
                    setTaskData({ ...taskData, progress: Number.isNaN(num) ? 0 : Math.max(0, Math.min(100, num)) });
                  }}
                />

                <Text style={styles.label}>Select Deadline:</Text>
                <Calendar
                  onDayPress={(day) => setTaskData({ ...taskData, deadline: day.dateString })}
                  markedDates={{ [taskData.deadline]: { selected: true, selectedColor: "#1b18b6" } }}
                />

                <View style={styles.modalActions}>
                  <TouchableOpacity onPress={() => setEditTaskModalVisible(false)}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={saveEditedTask}>
                    <Text style={styles.saveText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* === EDIT PROJECT MODAL === */}
        <Modal visible={editModalVisible} transparent animationType="slide" onRequestClose={() => setEditModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, styles.modalBoxTall]}>
              <ScrollView contentContainerStyle={styles.modalContentScroll}>
                <Text style={styles.modalTitle}>Edit Project</Text>

                <TextInput
                  placeholder="Project Name"
                  style={styles.input}
                  value={editData.name}
                  onChangeText={(text) => setEditData({ ...editData, name: text })}
                />

                <TextInput
                  placeholder="Project Description"
                  style={[styles.input, { minHeight: 100 }]}
                  multiline
                  value={editData.description}
                  onChangeText={(text) => setEditData({ ...editData, description: text })}
                />

                <Text style={styles.label}>Deadline</Text>
                <Calendar
                  onDayPress={(day) => setEditData({ ...editData, deadline: day.dateString })}
                  markedDates={editData.deadline ? { [editData.deadline]: { selected: true, selectedColor: "#1b18b6" } } : {}}
                  style={styles.calendar}
                />

                <View style={styles.modalActions}>
                  <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={saveProjectEdits}>
                    <Text style={styles.saveText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* === SELECT TASK TO EDIT MODAL === */}
        <Modal visible={selectTaskModalVisible} transparent animationType="slide" onRequestClose={() => setSelectTaskModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Select a Task to Edit</Text>
              {tasks.map((task, idx) => (
                <TouchableOpacity key={idx} style={[styles.taskItem, { backgroundColor: task.color }]} onPress={() => chooseTaskToEdit(idx)}>
                  <Text style={styles.taskName}>{task.name}</Text>
                  <Text style={styles.taskDept}>{task.departments.join(", ")}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setSelectTaskModalVisible(false)} style={[styles.addButton, { backgroundColor: "#aaa" }]}>
                <Text style={styles.addButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Footer */}
        <PageFooter />

      </ScrollView>
    </SafeAreaView >
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8fc" },
  content: { flex: 1, padding: 20 },

  backButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#1b18b6", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 8 },
  backButtonText: { color: "#fff", marginLeft: 8, fontWeight: "600" },
  editButton: { position: "absolute", right: 0, flexDirection: "row", alignItems: "center", backgroundColor: "#1b18b6", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  editButtonText: { color: "#fff", marginLeft: 6 },

  projectName: { fontSize: 36, fontWeight: "700", color: "#1b18b6", textAlign: "center" },
  projectDescription: { color: "#555", fontSize: 14, textAlign: "center", marginTop: 6, marginBottom: 18 },

  scroll: { maxHeight: 600 },

  /* Cards */
  cardOverview: { backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 12 },
  cardTasks: { backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 12 },
  cardNotes: { backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 12 },
  //cardSchedule: { backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 12 },

  cardSchedule: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
  },

  professionalCalendar: {
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },

  dayContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
  },

  card: { backgroundColor: "#fff", borderRadius: 12, padding: 12, marginVertical: 8 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 8 },
  cardText: { color: "#475569", fontSize: 13 },

  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#0F1724", marginBottom: 8 },
  label: { fontWeight: "600", marginVertical: 6 },
  value: { fontWeight: "700", color: "#333" },
  progress: { fontWeight: "700", color: "#1b18b6" },
  description: { color: "#444", marginTop: 8 },

  progressButton: { paddingVertical: 10, borderRadius: 10, alignItems: "center", backgroundColor: "#1b18b6" },
  progressButtonText: { color: "#fff", fontWeight: "600" },

  /* Task rows */
  taskRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  taskDone: { opacity: 0.6 },
  taskText: { marginLeft: 8, fontWeight: "600" },
  taskItem: { borderRadius: 8, padding: 6, marginVertical: 3 },
  taskName: { color: "#fff", fontWeight: "700" },
  taskDept: { color: "#fff", fontSize: 12 },

  /* Notes */
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  noteItem: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  noteText: { color: "#333" },
  noteDate: { fontSize: 12, color: "#888", marginTop: 4 },
  seeMoreButton: { marginTop: 8, alignSelf: "center", paddingVertical: 6, paddingHorizontal: 12, backgroundColor: "#1b18b6", borderRadius: 8 },
  seeMoreText: { color: "#fff", fontWeight: "600" },

  /* Modals */
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: "center" },
  modalBox: { width: "90%", backgroundColor: "#fff", borderRadius: 12, padding: 16 },
  modalBoxTall: { width: "90%", backgroundColor: "#fff", borderRadius: 12, padding: 16, maxHeight: "80%" },
  modalContentScroll: { paddingBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, marginBottom: 10 },
  cancelText: { color: "#888", fontWeight: "600" },
  saveText: { color: "#1b18b6", fontWeight: "700" },
  modalActions: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },

  /* Calendar */
  calendar: { borderRadius: 12, marginVertical: 12, marginHorizontal: 6, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, elevation: 3 },
  dayText: { fontSize: 18, fontWeight: "700", marginBottom: 6, textAlign: "center" },
  taskPill: { borderRadius: 6, paddingHorizontal: 4, paddingVertical: 2, marginTop: 2, width: "95%" },
  taskPillText: { fontSize: 10, color: "#ffffff", fontWeight: "500" },

  /* Calendar - improved day UI */
  // Wider day box (keep same height) so task names and departments fit; allow overflow to show full content
  dayBox: { alignItems: "center", justifyContent: "flex-start", paddingVertical: 10, paddingHorizontal: 10, width: 160, minHeight: 104, margin: 6, borderRadius: 10, overflow: "visible" },
  dayBoxDisabled: { opacity: 0.6 },
  // highlight style for today
  todayBox: {
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#1b18b6",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  // row holding the day number badge
  dayNumberRow: { width: "100%", alignItems: "flex-end" },
  // small badge that shows the day number
  dayNumberBadge: { backgroundColor: "#f1f5f9", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  dayNumberBadgeToday: { backgroundColor: "#1b18b6" },
  dayTextToday: { color: "#fff" },
  dayTextDisabled: { color: "#9ca3af" },
  dotRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  dot: { width: 8, height: 8, borderRadius: 8, marginRight: 6 },
  moreText: { fontSize: 10, color: "#6b7280", marginLeft: 4 },
  // Center task lines and give more padding so the name+dept fit and can wrap
  taskLinesColumn: { width: "100%", marginTop: 6, alignItems: "center", paddingHorizontal: 6 },
  taskLine: { width: "96%", alignSelf: "center", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 10, marginBottom: 6, overflow: "visible", shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  taskLineText: { color: "#fff", fontSize: 12, fontWeight: "600", textAlign: "left", flexShrink: 1, flexWrap: "wrap" },

  /* Small layout */
  calendarEmptyRow: { height: 18 },
  calendarDivider: { height: 2, width: "90%", alignSelf: "center", borderRadius: 2, marginTop: 10, marginBottom: 15, backgroundColor: "#1b18b633" },
  warningText: { color: "red", fontWeight: "600", textAlign: "center", marginTop: 10 },

  /* Cards row */
  cardsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 15, gap: 8 },
  cardContainer: { flex: 1, borderRadius: 12, padding: 10, minHeight: 100, backgroundColor: "#fff" },
  taskNameText: { fontSize: 13, color: "#333", marginBottom: 2 },
  emptyText: { fontSize: 13, color: "#999", fontStyle: "italic" },

  /* Task-card row and department badge */
  taskCardRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  deptBadge: { width: 12, height: 12, borderRadius: 6 },
  deptLabel: { fontSize: 12, color: "#1b18b6", marginTop: 2 },
  /* colored task container used inside cards */
  taskCardContainer: { borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10, marginBottom: 8 },
  taskCardTitle: { fontSize: 14, fontWeight: "700" },
  taskCardDept: { fontSize: 12, opacity: 0.9 },

  pastDueAccent: { borderLeftWidth: 4, borderLeftColor: "#ff3333" },
  inProgressAccent: { borderLeftWidth: 4, borderLeftColor: "#1b18b6" },
  doneAccent: { borderLeftWidth: 4, borderLeftColor: "#00a643" },

  actionRow: { flexDirection: "row", justifyContent: "space-between", marginHorizontal: 10, marginBottom: 10 },
  addTaskButton: { flex: 1 },
  // make gradientButton expand to full row: ensure it stretches and cannot be shrunk by an inline width override
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 30,
    alignSelf: "stretch",
    minWidth: "100%",
  },
  addTaskButtonText: { color: "#fff", fontWeight: "600", fontSize: 16, marginLeft: 8 },

  optionsOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  optionsBox: { backgroundColor: "#fff", padding: 20, borderRadius: 12, width: "80%", alignItems: "center" },
  optionsTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  optionButton: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, marginVertical: 8, width: "100%", alignItems: "center" },
  optionText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  cancelOption: { color: "gray", marginTop: 10 },

  addButton: { flexDirection: "row", backgroundColor: "#1b18b6", padding: 10, borderRadius: 8, alignItems: "center", alignSelf: "center" },
  addButtonText: { color: "#fff", fontWeight: "600" },

  checkboxRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  checkboxLabel: { marginLeft: 8, color: "#333" },

});