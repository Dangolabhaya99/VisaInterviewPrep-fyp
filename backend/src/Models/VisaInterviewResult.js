const mongoose = require('mongoose');

const interviewResultSchema = new mongoose.Schema({
  totalPoints: { 
    type: Number, 
    required: true 
  },
  feedback: { 
    type: String, 
    required: true 
  },
}, { timestamps: true });

const InterviewResult = mongoose.model('InterviewResult', interviewResultSchema);

module.exports = InterviewResult;
