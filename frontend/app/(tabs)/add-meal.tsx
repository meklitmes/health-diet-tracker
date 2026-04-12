import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddMeal() {
  const [foodName, setFoodName] = useState("");
  const [cholesterol, setCholesterol] = useState("");
  const [quantity, setQuantity] = useState("");

  const addMeal = async () => {
    if (!foodName || !cholesterol || !quantity) {
      Alert.alert("Missing Fields", "Please fill all fields.");
      return;
    }

    try {
      const response = await fetch("http://192.168.100.11:5000/meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: 1,
          food_name: foodName,
          cholesterol: Number(cholesterol),
          quantity: Number(quantity),
        }),
      });

      const data = await response.json();

      Alert.alert("Success", data.message);
     
      
      setFoodName("");
      setCholesterol("");
      setQuantity("");
       router.push("/");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🍽 Add Meal</Text>
      <Text style={styles.subtitle}>
        Track your food cholesterol intake
      </Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Food name"
          value={foodName}
          onChangeText={setFoodName}
          style={styles.input}
          placeholderTextColor="#888"
        />

        <TextInput
          placeholder="Cholesterol (mg)"
          keyboardType="numeric"
          value={cholesterol}
          onChangeText={setCholesterol}
          style={styles.input}
          placeholderTextColor="#888"
        />

        <TextInput
          placeholder="Quantity"
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
          style={styles.input}
          placeholderTextColor="#888"
        />

        <TouchableOpacity style={styles.button} onPress={addMeal}>
          <Text style={styles.buttonText}>Save Meal</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    gap: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  button: {
    backgroundColor: "#222",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});