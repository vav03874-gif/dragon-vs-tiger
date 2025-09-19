import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function App() {
  const [result, setResult] = useState("");

  const playGame = (choice) => {
    const choices = ["🐉 Dragon", "🐯 Tiger"];
    const randomChoice = choices[Math.floor(Math.random() * choices.length)];
    if (choice === randomChoice) {
      setResult("🎉 You Win! " + choice);
    } else {
      setResult("❌ You Lose! " + randomChoice);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dragon 🐉 vs Tiger 🐯</Text>

      <TouchableOpacity style={styles.button} onPress={() => playGame("🐉 Dragon")}>
        <Text style={styles.btnText}>Choose Dragon 🐉</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => playGame("🐯 Tiger")}>
        <Text style={styles.btnText}>Choose Tiger 🐯</Text>
      </TouchableOpacity>

      <Text style={styles.result}>{result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#222" },
  title: { fontSize: 26, fontWeight: "bold", color: "white", marginBottom: 30 },
  button: { backgroundColor: "#ff9800", padding: 15, borderRadius: 10, margin: 10 },
  btnText: { fontSize: 18, color: "white" },
  result: { fontSize: 22, marginTop: 30, color: "#fff" },
});
