from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import speech_recognition as sr

app = Flask(__name__)
analyzer = SentimentIntensityAnalyzer()
model = SentenceTransformer("all-MiniLM-L6-v2")  # Free model for sentence similarity

@app.route("/analyze-response", methods=["POST"])
def analyze_response():
    data = request.json
    user_response = data.get("response", "")
    correct_answer = data.get("correct_answer", "")

    # Calculate similarity score
    similarity_score = util.pytorch_cos_sim(
        model.encode(user_response, convert_to_tensor=True),
        model.encode(correct_answer, convert_to_tensor=True)
    ).item() * 100  # Convert to percentage

    # Sentiment Analysis
    sentiment = analyzer.polarity_scores(user_response)
    confidence_score = round((sentiment["compound"] + 1) * 50, 1)  # Normalize from 0-100

    return jsonify({
        "similarity_score": round(similarity_score, 1),
        "confidence": confidence_score
    })

if __name__ == "__main__":
    app.run(debug=True)
