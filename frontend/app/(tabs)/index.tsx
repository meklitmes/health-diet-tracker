import { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    fetch("http://192.168.100.11:5000/summary/1")
      .then((res) => res.json())
      .then((data) => setSummary(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Health Diet Tracker</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Today's Cholesterol</Text>
        <Text style={styles.value}>
          {summary ? `${summary.today_total_cholesterol} mg` : "Loading..."}
        </Text>
        <Text style={styles.warning}>
          {summary?.warning || "Healthy progress"}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  card: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  value: {
    fontSize: 36,
    fontWeight: "bold",
  },
  warning: {
    marginTop: 10,
    fontSize: 16,
  },
});