const mongoose = require('mongoose');

const VisaInterviewResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  totalPoints: {
    type: Number,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('VisaInterviewResult', VisaInterviewResultSchema);
