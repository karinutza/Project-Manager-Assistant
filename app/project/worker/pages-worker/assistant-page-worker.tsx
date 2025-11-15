import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ToolbarWorker from "../components-worker/toolbar-worker";
import { askAI } from "./local-ai";

export default function AssistantPageWorker() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const submit = () => {
    if (input.trim() === "") return;
    const r = askAI(input.trim());
    setResponse(r);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      <ToolbarWorker />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.title}>🤖 Workplace Assistant</Text>
        <Text style={styles.subtitle}>Întreabă-mă despre zile de naștere, întâlniri și alte lucruri legate de muncă.</Text>

        <TextInput
          style={styles.input}
          placeholder="Ex: Când e ziua lui Alex?"
          value={input}
          onChangeText={setInput}
        />

        <TouchableOpacity style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>Răspunde</Text>
        </TouchableOpacity>

        {response !== "" && (
          <View style={styles.responseBox}>
            <Text style={styles.responseText}>{response}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: "800", marginBottom: 4 },
  subtitle: { fontSize: 15, color: "#555", marginBottom: 20 },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#3B82F6",
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 17 },
  responseBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  responseText: { fontSize: 16, lineHeight: 22 },
});
