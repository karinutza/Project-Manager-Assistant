import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BurgerMenu from "./burger-menu-worker";

export default function Toolbar() {
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    {
      id: "1",
      title: "New Task Assigned",
      message: "You have a new task: Design Review at 11:00",
      type: "info",
      time: "1h ago",
    },
    {
      id: "2",
      title: "Meeting Reminder",
      message: "Project Planning starts at 14:00 on Zoom",
      type: "meeting",
      time: "2h ago",
    },
    {
      id: "3",
      title: "Task Completed",
      message: "John marked 'Client Call' as done",
      type: "success",
      time: "Yesterday",
    },
  ];

  const colorByType = (type: string) => {
    switch (type) {
      case "meeting":
        return "#1b18b6";
      case "info":
        return "#2a9d8f";
      case "success":
        return "#4caf50";
      default:
        return "#555";
    }
  };

  return (
    <View style={{ zIndex: 100 }}>
      {/* Toolbar */}
      <View style={styles.toolbar}>
        {/* Burger */}
        <TouchableOpacity onPress={() => setOpen(!open)}>
          <Ionicons name="menu-outline" size={32} color="#fff" />
        </TouchableOpacity>

        {/* Title (button) */}
        <TouchableOpacity
          onPress={() =>
            router.push("/project/worker/pages-worker/worker-log-page")
          }
        >
          <Text style={styles.appName}>Department Member Assistant</Text>
        </TouchableOpacity>

        <View style={styles.rightSide}>
          {/* Notifications */}
          <TouchableOpacity
            style={{ marginRight: 14 }}
            onPress={() => setNotifOpen(true)}
          >
            <Ionicons name="notifications-outline" size={28} color="#fff" />
            {notifications.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notifications.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Profile Button */}
          <TouchableOpacity
            onPress={() =>
              router.push("/project/worker/pages-worker/user-profile-worker")
            }
          >
            <Image
              source={require("../../../user.png")}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Lateral Menu */}
      {open && <BurgerMenu closeMenu={() => setOpen(false)} />}

      {/* Notification Modal */}
      <Modal visible={notifOpen} transparent animationType="fade">
        <TouchableOpacity
          activeOpacity={1}
          style={styles.overlay}
          onPress={() => setNotifOpen(false)}
        >
          <View style={styles.dropdown}>
            <Text style={styles.dropdownTitle}>Notifications</Text>

            {notifications.length === 0 ? (
              <Text style={styles.emptyText}>No notifications</Text>
            ) : (
              <ScrollView style={{ maxHeight: 300 }}>
                {notifications.map((n) => (
                  <View key={n.id} style={styles.notificationItem}>
                    <View
                      style={[
                        styles.sideColor,
                        { backgroundColor: colorByType(n.type) },
                      ]}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.notificationTitle}>{n.title}</Text>
                      <Text style={styles.notificationMsg}>{n.message}</Text>
                      <Text style={styles.notificationTime}>{n.time}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: "#1b18b6",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 2 },
  },

  appName: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 20,
  },

  rightSide: {
    flexDirection: "row",
    alignItems: "center",
  },

  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: "#fff",
    borderWidth: 1.5,
  },

  badge: {
    position: "absolute",
    top: -3,
    right: -6,
    backgroundColor: "#e63946",
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },

  dropdown: {
    backgroundColor: "#fff",
    marginTop: 70,
    marginRight: 10,
    width: 300,
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },

  dropdownTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 10,
    color: "#1b18b6",
  },

  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    backgroundColor: "#f9f9ff",
    borderRadius: 10,
    padding: 10,
  },

  sideColor: {
    width: 6,
    height: "100%",
    borderRadius: 3,
    marginRight: 8,
  },

  notificationTitle: { fontWeight: "700", color: "#0f1724" },
  notificationMsg: { color: "#444", marginTop: 2 },
  notificationTime: { color: "#999", marginTop: 4, fontSize: 12 },
  emptyText: { color: "#777", textAlign: "center", padding: 10 },
});
