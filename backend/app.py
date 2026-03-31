from flask import Flask, jsonify, request
import psycopg2
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)

# Connect to PostgreSQL
def get_connection():
 return psycopg2.connect(
    host=os.getenv("DB_HOST"),
    database=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    port=os.getenv("DB_PORT")
)
@app.route('/users', methods=['POST'])
def add_user():
    data = request.get_json()

    name = data.get("name")
    age = data.get("age")
    weight = data.get("weight")
    target = data.get("target_cholesterol")

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO users (name, age, weight, target_cholesterol)
        VALUES (%s, %s, %s, %s)
        RETURNING id
    """, (name, age, weight, target))

    user_id = cursor.fetchone()[0]
    conn.commit()
    conn.close()

    return jsonify({
        "message": "User added successfully",
        "id": user_id
    }), 201

@app.route('/users', methods=['GET'])
def get_users():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, name, age, weight, target_cholesterol FROM users")
    users = cursor.fetchall()

    conn.close()

    result = []
    for u in users:
        result.append({
            "id": u[0],
            "name": u[1],
            "age": u[2],
            "weight": u[3],
            "target_cholesterol": u[4]
        })

    return jsonify(result)


@app.route('/')
def home():
    return jsonify({"message": "Health Diet Tracker Backend is running!"})

@app.route('/status', methods=['GET'])
def status():
    return jsonify({"message": "Server is running"})
@app.route('/meals', methods=['POST'])
def add_meal():
    data = request.get_json()

    user_id = data.get("user_id")
    food_name = data.get("food_name")
    cholesterol = data.get("cholesterol")
    quantity = data.get("quantity")

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO public.meals (user_id, food_name, cholesterol, quantity)
        VALUES (%s, %s, %s, %s)
        RETURNING id
    """, (user_id, food_name, cholesterol, quantity))

    meal_id = cursor.fetchone()[0]
    conn.commit()
    conn.close()

    return jsonify({
        "message": "Meal added successfully",
        "meal_id": meal_id
    }), 201

@app.route('/meals', methods=['GET'])
def get_meals():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, user_id, food_name, cholesterol, quantity, meal_time
        FROM public.meals
        ORDER BY meal_time DESC
    """)

    meals = cursor.fetchall()
    conn.close()

    result = []

    for meal in meals:
        result.append({
            "id": meal[0],
            "user_id": meal[1],
            "food_name": meal[2],
            "cholesterol": meal[3],
            "quantity": meal[4],
            "meal_time": str(meal[5])
        })

    return jsonify(result)
if __name__ == '__main__':
    app.run(debug=True)