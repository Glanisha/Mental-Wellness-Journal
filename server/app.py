from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import pymongo
import datetime
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={
    r"/analyze": {"origins": "*"},
    r"/entries": {"origins": "*"}
})

# Database connection
mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/mental_journal")
client = pymongo.MongoClient(mongo_uri)
db = client["mental_journal"]
entries = db["logs"]

# Emotion classification model
MODEL_NAME = "bhadresh-savani/distilbert-base-uncased-emotion"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
EMOTIONS = ['sadness', 'joy', 'love', 'anger', 'fear', 'surprise']

@app.route("/analyze", methods=["POST", "OPTIONS"])
def analyze_entry():
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    
    try:
        data = request.get_json()
        text = data.get("text", "").strip()
        
        if not text:
            return jsonify({"error": "Text is required"}), 400
            
        # Tokenize and predict
        inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
        with torch.no_grad():
            outputs = model(**inputs)
            probs = torch.nn.functional.softmax(outputs.logits, dim=1)
            top_idx = torch.argmax(probs, dim=1).item()
            emotion = EMOTIONS[top_idx]
            confidence = probs[0][top_idx].item()

        # Save to DB
        entry = {
            "text": text,
            "emotion": emotion,
            "confidence": confidence,
            "date": datetime.datetime.utcnow()
        }
        entries.insert_one(entry)

        return jsonify({
            "emotion": emotion,
            "confidence": confidence,
            "timestamp": entry["date"].isoformat()
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/entries", methods=["GET", "OPTIONS"])
def get_entries():
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
        
    try:
        # Get entries sorted by date (newest first)
        result = list(entries.find({}, {"_id": 0}).sort("date", -1))
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def _build_cors_preflight_response():
    response = jsonify({"success": True})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    return response

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)