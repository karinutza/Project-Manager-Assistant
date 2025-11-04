import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useRef } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  LayoutChangeEvent,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { KeyboardAvoidingView, Platform } from "react-native";
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
  tasks: Task[];
  departmentColors: Record<string, string>;
  textColorForBg: (hex: string) => string;
  styles: any;
  onTaskAdded?: (task: Task) => void;
};

export default function CalendarComponent({
  tasks: initialTasks,
  departmentColors,
  textColorForBg,
  styles,
  onTaskAdded,
}: Props) {
  const today = dayjs();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showModal, setShowModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState<"start" | "deadline" | null>(null);
  const [calendarPosition, setCalendarPosition] = useState<number>(0);
  const [warning, setWarning] = useState("");

  const handleAddTask = () => {
    const newTask = {
      name: "New Task",
      departments: ["General"],
      color: "#4F46E5",
      deadline: new Date().toISOString().slice(0, 10),
    };

    onTaskAdded(newTask);
  };

  const [taskData, setTaskData] = useState({
    name: "",
    description: "",
    departments: [] as string[],
    color: "",
    startDate: "",
    deadline: "",
    progress: 0,
  });

  const startInputRef = useRef<View>(null);
  const deadlineInputRef = useRef<View>(null);

  const measureCalendarPosition = (ref: React.RefObject<View>) => {
    ref.current?.measure((_x, _y, _width, height, _pageX, pageY) => {
      setCalendarPosition(pageY + height + 10);
    });
  };

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

    setTasks((prev) => [...prev, newTask]);
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
    onTaskAdded?.(newTask);
    Alert.alert("Task added!", `${newTask.name} - ${firstDept}`);
  };

  return (
    <View>
      {/* Calendar principal */}
      <Calendar
        style={styles.professionalCalendar}
        markingType="multi-dot"
        dayComponent={({ date, state }) => {
          if (!date) return null;
          const d = dayjs(date.dateString);
          const isToday = d.isSame(today, "day");

          const dayTasks = tasks.filter((task) => {
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
              <View style={styles.dayNumberRow}>
                <Text
                  style={[
                    styles.dayText,
                    isToday && styles.dayTextToday,
                    state === "disabled" && styles.dayTextDisabled,
                  ]}
                >
                  {date.day}
                </Text>
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

      {/* Buton Add Task */}
      <View style={{ marginTop: 12, alignItems: "center" }}>
        <TouchableOpacity onPress={() => setShowModal(true)} activeOpacity={0.9}>
          <LinearGradient
            colors={["#1b18b6", "#2063f4", "#2420f9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradientButton, { width: "70%" }]}
          >
            <Ionicons name="add-circle-outline" size={22} color="#fff" />
            <Text style={styles.addTaskButtonText}>Add Task</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Modal profesional pentru adăugare task */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior="padding"
            style={{ flex: 1, justifyContent: "center" }}
          >
            <ScrollView
              style={{ flexGrow: 0 }}
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
                <ScrollView
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  <Text
                    style={[styles.modalTitle, { color: "#1b18b6", textAlign: "center" }]}
                  >
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
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      marginVertical: 10,
                    }}
                  >
                    {departmentsList.map((dep) => {
                      const selected = taskData.departments.includes(dep);
                      const depColor = departmentColors[dep] ?? "#ccc";
                      const textColor = textColorForBg(depColor);

                      return (
                        <TouchableOpacity
                          key={dep}
                          style={{
                            borderWidth: 1,
                            borderColor: selected ? "#1b18b6" : "#ccc",
                            borderRadius: 10,
                            padding: 6,
                            marginVertical: 4,
                            flexBasis: "48%",
                            backgroundColor: selected ? "#1b18b6" : "#fff",
                          }}
                          onPress={() => {
                            const exists = taskData.departments.includes(dep);
                            const updated = selected
                              ? taskData.departments.filter((d) => d !== dep)
                              : [...taskData.departments, dep];
                            setTaskData({
                              ...taskData,
                              departments: updated,
                              color: departmentColors[dep] ?? taskData.color
                            });
                          }}
                        >
                          <Ionicons
                            name={selected ? "checkbox-outline" : "square-outline"}
                            size={20}
                            color={selected ? textColor : "#1b18b6"}
                          />

                          <Text
                            style={{
                              color: selected ?
                                textColor : "#1b18b6",
                              textAlign: "center",
                              fontWeight: "600",
                            }}
                          >
                            {dep}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Start Date */}
                  <Text style={styles.label}>Start Date</Text>
                  <TextInput
                    placeholder="YYYY-MM-DD"
                    style={styles.input}
                    value={taskData.startDate}
                    onFocus={() => setShowCalendar("start")}
                  />

                  {/* Calendar pentru Start Date */}
                  {showCalendar === "start" && (
                    <View style={{ height: 400, marginVertical: 10 }}>
                      <View style={{ marginVertical: 10, borderRadius: 12, overflow: "hidden", borderWidth: 1, borderColor: "#E0E0E0" }}>
                        <Calendar
                          onDayPress={(day) => {
                            if (showCalendar === "start") {
                              setTaskData({ ...taskData, startDate: day.dateString });
                            } else if (showCalendar === "deadline") {
                              setTaskData({ ...taskData, deadline: day.dateString });
                            }
                            setShowCalendar(null);
                          }}
                          markedDates={{
                            ...(taskData.startDate && showCalendar === "start"
                              ? { [taskData.startDate]: { selected: true, selectedColor: "#1b18b6", selectedTextColor: "#fff" } }
                              : {}),
                            ...(taskData.deadline && showCalendar === "deadline"
                              ? { [taskData.deadline]: { selected: true, selectedColor: "#f54b64", selectedTextColor: "#fff" } }
                              : {}),
                          }}
                          theme={{
                            backgroundColor: "#FAFAFA",
                            calendarBackground: "#FAFAFA",
                            textSectionTitleColor: "#444",
                            monthTextColor: "#1b18b6",
                            textMonthFontSize: 18,
                            textMonthFontWeight: "600",
                            arrowColor: "#1b18b6",
                            dayTextColor: "#333",
                            textDisabledColor: "#CCC",
                            todayTextColor: "#1b18b6",
                            todayBackgroundColor: "#E8F0FE",
                            selectedDayBackgroundColor: showCalendar === "start" ? "#1b18b6" : "#f54b64",
                            selectedDayTextColor: "#fff",
                            dotColor: "#1b18b6",
                            selectedDotColor: "#fff",
                            textDayFontSize: 16,
                            textDayFontWeight: "500",
                            textDayHeaderFontSize: 14,
                            textDayHeaderFontWeight: "500",
                          }}
                          hideExtraDays={false}
                          firstDay={1}
                          enableSwipeMonths
                        />
                      </View>

                    </View>
                  )}

                  <Text style={styles.label}>Deadline</Text>
                  <TextInput
                    placeholder="YYYY-MM-DD"
                    style={styles.input}
                    value={taskData.deadline}
                    onFocus={() => setShowCalendar("deadline")}
                  />

                  {/* Calendar pentru Deadline */}
                  {showCalendar === "deadline" && (
                    <View
                      style={{
                        marginVertical: 10,
                        borderRadius: 12,
                        overflow: "hidden",
                        borderWidth: 1,
                        borderColor: "#E0E0E0",
                        backgroundColor: "#FAFAFA",
                      }}
                    >
                      <Calendar
                        onDayPress={(day) => {
                          setTaskData({ ...taskData, deadline: day.dateString });
                          setShowCalendar(null);
                        }}
                        markedDates={{
                          ...(taskData.deadline
                            ? { [taskData.deadline]: { selected: true, selectedColor: "#f54b64" } }
                            : {}),
                          ...(taskData.startDate && taskData.startDate !== taskData.deadline
                            ? {
                              [taskData.startDate]: {
                                selected: true, selectedColor: "#1b18b6", textColor: "#fff", customStyles: {
                                  container: {
                                    borderWidth: 1,
                                    borderColor: "#1b18b6",
                                    borderRadius: 6,
                                  },
                                  text: { fontWeight: "600", fontSize: 12 }
                                }
                              }
                            }
                            : {}),
                        }}
                        markingType="custom"
                        theme={{
                          backgroundColor: "#FAFAFA",
                          calendarBackground: "#FAFAFA",
                          textSectionTitleColor: "#444",
                          monthTextColor: "#1b18b6",
                          textMonthFontSize: 18,
                          textMonthFontWeight: "600",
                          arrowColor: "#1b18b6",
                          dayTextColor: "#333",
                          textDisabledColor: "#CCC",
                          todayTextColor: "#1b18b6",
                          todayBackgroundColor: "#E8F0FE",
                          selectedDayTextColor: "#fff",
                          textDayFontSize: 16,
                          textDayFontWeight: "500",
                          textDayHeaderFontSize: 14,
                          textDayHeaderFontWeight: "500",
                        }}
                        hideExtraDays={false}
                        firstDay={1}
                        enableSwipeMonths
                      />
                    </View>
                  )}

                  {warning ? (
                    <Text style={{ color: "red", textAlign: "center", marginVertical: 10 }}>
                      {warning}
                    </Text>
                  ) : null}

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      marginTop: 20,
                    }}
                  >
                    <TouchableOpacity onPress={() => setShowModal(false)}>
                      <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>

                    {/* ADD TASK */}
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
                          marginTop: 12,
                        }}
                      >
                          <Ionicons name="add-circle-outline" size={22} color="white" style={{ marginRight: 8 }} />
                          <Text
                            style={{
                              color: "white",
                              fontWeight: "600",
                              fontSize: 16,
                              letterSpacing: 0.5,
                              textAlign: "center",
                            }}
                          >
                            Add Task
                          </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}
