from flask import Flask, jsonify
import psycopg2
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)

# Connect to PostgreSQL
conn = psycopg2.connect(
    host=os.getenv("DB_HOST"),
    database=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    port=os.getenv("DB_PORT")
)

@app.route('/')
def home():
    return jsonify({"message": "Health Diet Tracker Backend is running!"})

if __name__ == '__main__':
    app.run(debug=True)