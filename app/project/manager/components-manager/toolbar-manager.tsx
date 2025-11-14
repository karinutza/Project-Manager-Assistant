import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";


export default function Toolbar() {
  const [open, setOpen] = useState(false);

  return (
    <LinearGradient
      colors={["#2962FF", "#4FC3F7"]}
      start={[0, 0]}
      end={[1, 1]}
      style={styles.toolbarContainer}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          /* poți adăuga deschiderea unui meniu lateral aici */
        }}
      >
        <Ionicons name="menu-outline" size={28} color="#fff" />
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  toolbarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 0,
    borderBottomColor: "rgba(255,255,255,0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  appName: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
    letterSpacing: 0.5,
  },
  profileImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
  },
});
