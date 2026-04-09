from flask import Flask, jsonify, request
import psycopg2
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from .env
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

app = Flask(__name__)

# Connect to PostgreSQL
def get_connection():
   print("DEBUG PASSWORD:", os.getenv("DB_PASSWORD"))
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
@app.route('/summary/<int:user_id>', methods=['GET'])
def daily_summary(user_id):
    conn = get_connection()
    cursor = conn.cursor()

    # get user target first
    cursor.execute("""
        SELECT target_cholesterol
        FROM public.users
        WHERE id = %s
    """, (user_id,))
    
    user_target = cursor.fetchone()

    if user_target is None:
        conn.close()
        return jsonify({"error": "User not found"}), 404

    target = float(user_target[0])

    # get today's cholesterol total
    cursor.execute("""
        SELECT COALESCE(SUM(cholesterol * quantity), 0)
        FROM public.meals
        WHERE user_id = %s
        AND DATE(meal_time) = CURRENT_DATE
    """, (user_id,))
    
    total = cursor.fetchone()[0]

    conn.close()

    warning = None
    if float(total) > target:
        warning = "Daily cholesterol limit exceeded"

    return jsonify({
        "user_id": user_id,
        "today_total_cholesterol": float(total),
        "target_cholesterol": target,
        "warning": warning
    })
@app.route('/weekly-summary/<int:user_id>', methods=['GET'])
def weekly_summary(user_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT DATE(meal_time) as day,
               COALESCE(SUM(cholesterol * quantity), 0) as total
        FROM public.meals
        WHERE user_id = %s
          AND meal_time >= CURRENT_DATE - INTERVAL '6 days'
        GROUP BY DATE(meal_time)
        ORDER BY day ASC
    """, (user_id,))

    rows = cursor.fetchall()
    conn.close()

    result = []
    for row in rows:
        result.append({
            "date": str(row[0]),
            "cholesterol": float(row[1])
        })

    return jsonify(result)
@app.route('/risky-foods/<int:user_id>', methods=['GET'])
def risky_foods(user_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT food_name,
               SUM(cholesterol * quantity) as total
        FROM public.meals
        WHERE user_id = %s
          AND DATE(meal_time) = CURRENT_DATE
        GROUP BY food_name
        ORDER BY total DESC
        LIMIT 5
    """, (user_id,))

    rows = cursor.fetchall()
    conn.close()

    result = []
    for row in rows:
        result.append({
            "food_name": row[0],
            "total_cholesterol": float(row[1])
        })

    return jsonify(result)
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)