// models/Response.js
const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true },
    question: { type: String, required: true },
    response: { type: String, required: true },
    confidenceScore: { type: Number, required: true }, 
    similarityScore: { type: Number, required: true },
    points: { type: Number, required: true },
  },
  { timestamps: true }
);

const Response = mongoose.model("Response", responseSchema);

module.exports = Response;
