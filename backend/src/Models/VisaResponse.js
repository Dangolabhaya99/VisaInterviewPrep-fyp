const mongoose = require("mongoose");

const VisaResponseSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  question: { type: String, required: true },
  response: { type: String, required: true },
  tone: { type: String, enum: ["Positive", "Neutral", "Negative"], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("VisaResponse", VisaResponseSchema);
