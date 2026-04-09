import { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WeeklyScreen() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://192.168.100.11:5000/weekly-summary/1")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.log(err));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Weekly Cholesterol Trend</Text>

      <ScrollView>
        {data.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.day}>{item.date}</Text>
            <Text style={styles.value}>{item.cholesterol} mg</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 14,
    backgroundColor: "#f5f5f5",
  },
  day: {
    fontSize: 18,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
  },
});