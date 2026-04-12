import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "expo-router";

type Meal = {
  id: number;
  food_name: string;
  cholesterol: number;
  quantity: number;
  meal_time: string;
};

export default function MealHistory() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [search, setSearch] = useState("");

  const fetchMeals = async () => {
    try {
      const res = await fetch("http://192.168.100.11:5000/meals");
      const data = await res.json();
      setMeals(data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteMeal = async (id: number) => {
    try {
      await fetch(`http://192.168.100.11:5000/meals/${id}`, {
        method: "DELETE",
      });

      setMeals((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMeals();
    }, [])
  );

  const filteredMeals = meals.filter((meal) =>
    meal.food_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍽 Meal History</Text>

      {/* SEARCH (TOP ONLY) */}
      <TextInput
        placeholder="Search meals..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      <FlatList
        data={filteredMeals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.food}>{item.food_name}</Text>

              <Text style={styles.text}>
                Cholesterol: {item.cholesterol} mg
              </Text>

              <Text style={styles.text}>
                Quantity: {item.quantity}
              </Text>

              <Text style={styles.date}>
                {new Date(item.meal_time).toLocaleString()}
              </Text>
            </View>

            {/* DELETE BUTTON (INSIDE CARD) */}
            <TouchableOpacity
              onPress={() => deleteMeal(item.id)}
              style={styles.deleteBtn}
            >
              <Text style={styles.deleteText}>🗑</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f7fb",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 30,
  },

  search: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    alignItems: "center",
  },

  food: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },

  text: {
    color: "#444",
  },

  date: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },

  deleteBtn: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#ffe5e5",
  },

  deleteText: {
    fontSize: 16,
  },
});