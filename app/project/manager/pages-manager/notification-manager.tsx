import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Notification = {
  id: string;
  title: string;
  message: string;
  type?: "info" | "meeting" | "success";
  time?: string;
};

interface NotificationManagerProps {
  notifications: Notification[];
}

export default function NotificationManager({ notifications }: NotificationManagerProps) {
  const [open, setOpen] = useState(false);

  const colorByType = (type?: string) => {
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
    <>
      {/* Buton notificări */}
      <TouchableOpacity style={styles.button} onPress={() => setOpen(true)}>
        <Ionicons name="notifications-outline" size={24} color="#fff" />
        {notifications.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{notifications.length}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Modal notificări */}
      <Modal visible={open} transparent animationType="fade">
        {/* Overlay întunecat */}
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpen(false)} />

        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Notifications</Text>

          {notifications.length === 0 ? (
            <Text style={styles.emptyText}>No notifications</Text>
          ) : (
            <FlatList
              data={notifications}
              keyExtractor={(item) => item.id}
              style={{ maxHeight: 350 }}
              renderItem={({ item }) => (
                <View style={[styles.notificationItem, { borderLeftColor: colorByType(item.type) }]}>
                  <Text style={styles.notificationTitle}>{item.title}</Text>
                  <Text style={styles.notificationMessage}>{item.message}</Text>
                  {item.time && <Text style={styles.notificationTime}>{item.time}</Text>}
                </View>
              )}
            />
          )}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    marginLeft: 12,
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#e63946",
    borderRadius: 8,
    paddingHorizontal: 4,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modal: {
    position: "absolute",
    top: 60,
    right: 16,
    width: 300,
    maxHeight: 400,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10, color: "#1b18b6" },
  emptyText: { textAlign: "center", color: "#777", padding: 12 },

  notificationItem: {
    padding: 10,
    marginBottom: 8,
    borderLeftWidth: 5,
    backgroundColor: "#f9f9ff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  notificationTitle: { fontWeight: "700", fontSize: 14, color: "#0f1724" },
  notificationMessage: { fontSize: 13, color: "#444", marginTop: 2 },
  notificationTime: { fontSize: 11, color: "#999", marginTop: 4 },
});
