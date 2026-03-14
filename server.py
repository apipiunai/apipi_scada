from flask import Flask, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

user = {
    "name": "Unai",
    "role": "admin"
    }

pages = [
    {"page": "Dashboard", "path": "/"},
    {"page": "Albaran", "path": "/albaran"},
    {"page": "Plano", "path": "/plano"},
    {"page": "OEE", "path": "/oee"}
]





@app.route('/getUser', methods=['GET'])
def get_user():
    return jsonify(user)

@app.route('/getPages', methods=['GET'])
def get_pages():
    return jsonify(pages)

@app.route('/getAlarms', methods=['GET'])
def get_alarms():
    try:
        with open('data/alarms.json', 'r', encoding='utf-8') as f:
            alarms = json.load(f)
        return jsonify(alarms)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/getPressData', methods=['GET'])
def get_press_data():
    try:
        with open('data/press.json', 'r', encoding='utf-8') as f:
            press_data = json.load(f)
        return jsonify(press_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
