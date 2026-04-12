import { View, Text,TouchableOpacity,StyleSheet } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect,router } from "expo-router";
import * as Progress from "react-native-progress";
export default function Home() {
  const [summary, setSummary] = useState<any>(null);

  const fetchSummary = async () => {
    try {
      const res = await fetch("http://192.168.100.11:5000/summary/1");
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.log(err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSummary();
    }, [])
  );

  const consumed = summary?.today_total_cholesterol || 0;
  const target = summary?.target_cholesterol || 1;
  const progress = consumed / target;

  const isOver = consumed > target;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.title}>Health Diet Tracker</Text>
      <Text style={styles.subtitle}>Today’s overview</Text>

      {/* MAIN CARD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today’s Cholesterol</Text>

        <Text style={styles.value}>
          {consumed} mg / {target} mg
        </Text>

        <Progress.Bar
          progress={progress > 1 ? 1 : progress}
          width={null}
          color={isOver ? "#ff4d4d" : "#4CAF50"}
          style={{ marginTop: 10 }}
        />

        <Text style={styles.status}>
          {isOver ? "⚠️ Limit exceeded" : "✅ Within safe range"}
        </Text>
      </View>

      {/* QUICK ACTIONS */}
      <View style={styles.actions}>
  
  {/* ADD MEAL */}
  <TouchableOpacity
    style={styles.actionCard}
    onPress={() => router.push("/add-meal")}
  >
    <Text style={styles.actionText}>➕ Add Meal</Text>
  </TouchableOpacity>

  {/* VIEW HISTORY */}
  <TouchableOpacity
    style={styles.actionCard}
    onPress={() => router.push("/meal-history")}
  >
    <Text style={styles.actionText}>📜 View History</Text>
  </TouchableOpacity>

</View>

      {/* MINI INSIGHT */}
      <View style={styles.smallCard}>
        <Text style={styles.smallTitle}>Insight</Text>
        <Text style={styles.smallText}>
          Track your meals daily to maintain healthy cholesterol levels.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fb",
    padding: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginTop: 30,
  },

  subtitle: {
    color: "#666",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  value: {
    fontSize: 20,
    fontWeight: "700",
  },

  status: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  actionCard: {
    flex: 1,
    backgroundColor: "white",
    marginHorizontal: 5,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  actionText: {
    fontWeight: "600",
  },

  smallCard: {
    marginTop: 20,
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
  },

  smallTitle: {
    fontWeight: "700",
    marginBottom: 6,
  },

  smallText: {
    color: "#555",
  },
});