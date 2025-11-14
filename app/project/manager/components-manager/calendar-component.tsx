import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import dayjs from "dayjs";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Slider from "@react-native-community/slider";

type Task = {
  id?: string;
  name: string;
  description?: string;
  departments?: string[];
  color?: string;
  startDate?: string;
  deadline?: string;
  progress?: number;
};

type Props = {
  tasks?: Task[];
  departmentColors: Record<string, string>;
  textColorForBg: (hex: string) => string;
  styles: any;
  onTaskAdded?: (task: Task) => void; // ✅ PROPS DEFINIT CORECT
};

export default function CalendarComponent({
  tasks: initialTasks = [],
  departmentColors,
  textColorForBg,
  styles,
  onTaskAdded, // ✅ SCOS DIN PROPS
}: Props) {
  const today = dayjs();
  const [tasks, setTasks] = useState<Task[]>(initialTasks ?? []);
  const [showModal, setShowModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState<"start" | "deadline" | null>(null);
  const [warning, setWarning] = useState("");

  const [taskData, setTaskData] = useState({
    name: "",
    description: "",
    departments: [] as string[],
    color: "",
    startDate: "",
    deadline: "",
    progress: 0,
  });

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

  const addTask = () => {
    if (!taskData.name) return setWarning("Please enter a task name.");
    if (!taskData.startDate) return setWarning("Please select a start date.");
    if (!taskData.deadline) return setWarning("Please select a deadline.");
    if (taskData.departments.length === 0)
      return setWarning("Please select at least one department.");

    const firstDept = taskData.departments[0];
    const deptColor = departmentColors[firstDept] ?? "#1b18b6";

    const newTask: Task = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: taskData.name,
      description: taskData.description,
      departments: taskData.departments,
      color: deptColor,
      startDate: taskData.startDate,
      deadline: taskData.deadline,
      progress: taskData.progress,
    };

    // ✅ adaugă task în lista locală
    setTasks((prev) => [...prev, newTask]);

    // ✅ trimite task-ul în parent dacă există un callback
    onTaskAdded?.(newTask);

    // reset modal
    setTaskData({
      name: "",
      description: "",
      departments: [],
      color: "",
      startDate: "",
      deadline: "",
      progress: 0,
    });
    setShowModal(false);
    setShowCalendar(null);
    setWarning("");

    Alert.alert("Task added!", `${newTask.name} - ${firstDept}`);
  };

  return (
    <View>
      {/* CALENDAR PRINCIPAL */}
      <Calendar
        style={styles.professionalCalendar}
        markingType="multi-dot"
        dayComponent={({ date, state }) => {
          if (!date) return null;
          const d = dayjs(date.dateString);
          const isToday = d.isSame(today, "day");

          const dayTasks = (tasks ?? []).filter((task) => {
            if (!task.startDate || !task.deadline) return false;
            const start = dayjs(task.startDate);
            const end = dayjs(task.deadline);
            return d.isAfter(start.subtract(1, "day")) && d.isBefore(end.add(1, "day"));
          });

          const visible = dayTasks.slice(0, 2);
          const extra = Math.max(0, dayTasks.length - visible.length);
          const bgColor =
            dayTasks.length > 0
              ? (dayTasks[0].color ?? "#1b18b6") + "22"
              : isToday
              ? "#EEF2FF"
              : "#fff";

          return (
            <View
              style={[
                styles.dayBox,
                { backgroundColor: bgColor },
                isToday && styles.todayBox,
                state === "disabled" && styles.dayBoxDisabled,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  isToday && styles.dayTextToday,
                  state === "disabled" && styles.dayTextDisabled,
                ]}
              >
                {date.day}
              </Text>

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
        enableSwipeMonths
      />

      {/* BUTON ADD TASK */}
      <View style={{ alignItems: "center", marginTop: 16 }}>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          activeOpacity={0.85}
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 3 },
            elevation: 4,
            borderRadius: 50,
            overflow: "hidden",
          }}
        >
          <LinearGradient
            colors={["#4F46E5", "#6366F1", "#818CF8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 14,
              paddingHorizontal: 28,
              borderRadius: 50,
            }}
          >
            <Ionicons name="add" size={22} color="#fff" style={{ marginRight: 8 }} />
            <Text
              style={{
                color: "#fff",
                fontSize: 17,
                fontWeight: "700",
                letterSpacing: 0.5,
              }}
            >
              Add Task
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* MODAL */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior="padding" style={{ flex: 1, justifyContent: "center" }}>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
                paddingVertical: 60,
              }}
              keyboardShouldPersistTaps="handled"
            >
              <View
                style={[
                  styles.modalBox,
                  {
                    borderRadius: 20,
                    backgroundColor: "#fff",
                    padding: 20,
                    shadowColor: "#000",
                    shadowOpacity: 0.15,
                    shadowRadius: 10,
                    marginHorizontal: 15,
                  },
                ]}
              >
                <Text style={[styles.modalTitle, { color: "#1b18b6", textAlign: "center" }]}>
                  Create a New Task
                </Text>

                <TextInput
                  placeholder="Task name"
                  style={styles.input}
                  value={taskData.name}
                  onChangeText={(text) => setTaskData({ ...taskData, name: text })}
                />

                <TextInput
                  placeholder="Short description..."
                  style={[styles.input, { height: 70, textAlignVertical: "top" }]}
                  multiline
                  value={taskData.description}
                  onChangeText={(text) => setTaskData({ ...taskData, description: text })}
                />

                <Text style={styles.label}>Progress: {taskData.progress}%</Text>
                <Slider
                  style={{ width: "100%" }}
                  minimumValue={0}
                  maximumValue={100}
                  step={5}
                  minimumTrackTintColor="#1b18b6"
                  maximumTrackTintColor="#ddd"
                  thumbTintColor="#1b18b6"
                  value={taskData.progress}
                  onValueChange={(v: number) => setTaskData({ ...taskData, progress: v })}
                />

                <Text style={styles.label}>Departments</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {departmentsList.map((dep) => {
                    const selected = taskData.departments.includes(dep);
                    return (
                      <TouchableOpacity
                        key={dep}
                        style={{
                          borderWidth: 1,
                          borderColor: selected ? "#1b18b6" : "#ccc",
                          borderRadius: 10,
                          padding: 6,
                          margin: 4,
                          backgroundColor: selected ? "#1b18b6" : "#fff",
                        }}
                        onPress={() => {
                          const exists = taskData.departments.includes(dep);
                          const updated = exists
                            ? taskData.departments.filter((d) => d !== dep)
                            : [...taskData.departments, dep];
                          setTaskData({ ...taskData, departments: updated });
                        }}
                      >
                        <Text
                          style={{
                            color: selected ? "#fff" : "#1b18b6",
                            fontWeight: "600",
                            textAlign: "center",
                          }}
                        >
                          {dep}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.label}>Start Date</Text>
                <TextInput
                  placeholder="YYYY-MM-DD"
                  style={styles.input}
                  value={taskData.startDate}
                  onFocus={() => setShowCalendar("start")}
                />

                {showCalendar === "start" && (
                  <View style={{ marginVertical: 10 }}>
                    <Calendar
                      onDayPress={(day) => {
                        setTaskData({ ...taskData, startDate: day.dateString });
                        setShowCalendar(null);
                      }}
                      markedDates={{
                        ...(taskData.startDate
                          ? { [taskData.startDate]: { selected: true, selectedColor: "#1b18b6" } }
                          : {}),
                      }}
                      theme={{
                        calendarBackground: "#fff",
                        monthTextColor: "#1b18b6",
                        arrowColor: "#1b18b6",
                        todayTextColor: "#1b18b6",
                        selectedDayBackgroundColor: "#1b18b6",
                        selectedDayTextColor: "#fff",
                      }}
                      style={{
                        borderRadius: 16,
                        elevation: 3,
                      }}
                    />
                  </View>
                )}

                <Text style={styles.label}>Deadline</Text>
                <TextInput
                  placeholder="YYYY-MM-DD"
                  style={styles.input}
                  value={taskData.deadline}
                  onFocus={() => setShowCalendar("deadline")}
                />

                {showCalendar === "deadline" && (
                  <View style={{ marginVertical: 10 }}>
                    <Calendar
                      onDayPress={(day) => {
                        setTaskData({ ...taskData, deadline: day.dateString });
                        setShowCalendar(null);
                      }}
                      markedDates={{
                        ...(taskData.deadline
                          ? { [taskData.deadline]: { selected: true, selectedColor: "#f54b64" } }
                          : {}),
                      }}
                      theme={{
                        calendarBackground: "#fff",
                        monthTextColor: "#f54b64",
                        arrowColor: "#f54b64",
                        todayTextColor: "#f54b64",
                        selectedDayBackgroundColor: "#f54b64",
                        selectedDayTextColor: "#fff",
                      }}
                      style={{
                        borderRadius: 16,
                        elevation: 3,
                      }}
                    />
                  </View>
                )}

                {warning ? (
                  <Text style={{ color: "red", textAlign: "center", marginVertical: 10 }}>
                    {warning}
                  </Text>
                ) : null}

                <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
                  <TouchableOpacity onPress={() => setShowModal(false)}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={addTask} activeOpacity={0.9}>
                    <LinearGradient
                      colors={["#1b18b6", "#2063f4", "#2420f9"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 12,
                        borderRadius: 12,
                      }}
                    >
                      <Ionicons name="add-circle-outline" size={22} color="white" style={{ marginRight: 8 }} />
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "600",
                          fontSize: 16,
                          letterSpacing: 0.5,
                        }}
                      >
                        Add Task
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}
