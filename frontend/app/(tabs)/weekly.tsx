import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function WeeklyScreen() {
  const [data, setData] = useState<any[]>([]);

  const fetchWeekly = async () => {
    try {
      const res = await fetch("http://192.168.100.11:5000/weekly-summary/1");
      const json = await res.json();
      setData(json || []);
    } catch (err) {
      console.log(err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWeekly();
    }, [])
  );

  // 🛡 SAFE TRANSFORMATIONS
  const labels =
    data?.length > 0
      ? data.map((item) =>
          item?.date
            ? new Date(item.date).toLocaleDateString("en-US", {
                weekday: "short",
              })
            : ""
        )
      : [];

  const values =
    data?.length > 0
      ? data.map((item) => Number(item.cholesterol) || 0)
      : [0];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Overview</Text>
      <Text style={styles.subtitle}>Cholesterol intake per day</Text>

      {data.length > 0 ? (
        <BarChart
          data={{
            labels,
            datasets: [{ data: values }],
          }}
          width={screenWidth - 32}
          height={240}
          fromZero
          showValuesOnTopOfBars
          yAxisLabel=""
          yAxisSuffix=" mg"
          chartConfig={{
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: () => "#4CAF50",
            labelColor: () => "#333",
            style: {
              borderRadius: 16,
            },
          }}
          style={styles.chart}
        />
      ) : (
        <Text style={{ marginTop: 20, color: "#666" }}>
          No weekly data yet
        </Text>
      )}

      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>Insight</Text>
        <Text style={styles.noteText}>
          This shows your cholesterol trends over the last 7 days.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c1d5b3",
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 20,
  },

  subtitle: {
    color: "#666",
    marginBottom: 16,
  },

  chart: {
    borderRadius: 16,
  },

  noteCard: {
    marginTop: 20,
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
  },

  noteTitle: {
    fontWeight: "700",
    marginBottom: 6,
  },

  noteText: {
    color: "#555",
  },
});