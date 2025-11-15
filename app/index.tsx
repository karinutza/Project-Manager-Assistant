import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function Index() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "" && password === "") {
      router.replace("../../project/manager/pages-manager/manager-log-page");
    } else if (username === "boss" && password === "boss") {
      router.replace("../../project/boss/pages-boss/boss-log-page");
    } else if (username === "worker" && password === "worker") {
      router.replace("../../project/worker/pages-worker/worker-log-page");
    } else {
      alert("Username sau parola greșită!");
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* FUNDAL GRADIENT */}
      <LinearGradient
        colors={["#E4ECFF", "#F3F6FB"]}
        start={[0, 0]}
        end={[1, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* BLOB-uri decorative */}
      <View style={styles.blobBlue} />
      <View style={styles.blobCyan} />

      {/* Conținut */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={["#2962FF", "#33C1FF"]}
            style={styles.logoCircle}
          >
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/9068/9068649.png",
              }}
              style={styles.logoIcon}
            />
          </LinearGradient>
        </View>

        <Text style={styles.title}>Project Assistant</Text>
        <Text style={styles.subtitle}>Gestionare simplă. Decizii rapide.</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          style={styles.input}
          placeholderTextColor="#9CA3AF"
        />

        <TextInput
          placeholder="Parolă"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#9CA3AF"
        />

        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <LinearGradient
            colors={["#1b18b6", "#2962FF"]}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Continuă</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },

  /* BLOB-URI */
  blobBlue: {
    position: "absolute",
    width: 260,
    height: 260,
    backgroundColor: "#2962FF33",
    borderRadius: 200,
    top: -40,
    left: -60,
  },

  blobCyan: {
    position: "absolute",
    width: 260,
    height: 260,
    backgroundColor: "#33C1FF33",
    borderRadius: 200,
    bottom: -50,
    right: -40,
  },

  header: {
    alignItems: "center",
    marginBottom: 40,
  },

  logoContainer: {
    marginBottom: 16,
  },

  logoCircle: {
    width: 95,
    height: 95,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  logoIcon: {
    width: 54,
    height: 54,
    tintColor: "#fff",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1E293B",
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 3,
  },

  /* CARD MICȘORAT */
  form: {
    width: "78%",
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  input: {
    width: "100%",
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    fontSize: 15,
    color: "#1E293B",
  },

  button: {
    width: "100%",
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 4,
  },

  buttonGradient: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});