const InterviewResult = require('../Models/VisaInterviewResult');

const saveInterviewResult = async (req, res) => {
  try {
    const { userId, totalPoints, feedback } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' }); // Fixing the check from 'user' to 'userId'
    }

    const newResult = new InterviewResult({
      user: userId, // Assuming 'user' is the reference field in your schema
      totalPoints,
      feedback,
    });

    await newResult.save();

    res.status(201).json({ message: 'Interview result saved successfully', result: newResult });
  } catch (error) {
    console.error('Error saving interview result:', error);
    res.status(500).json({ error: 'Failed to save interview result' });
  }
};

const fetchInterviewResults = async (req, res) => {
  try {
    const userId = req.user.id; // Accessing user ID from the decoded token
    if (!userId) {
      return res.status(400).json({ msg: 'User ID is required' });
    }

    const results = await InterviewResult.find({ user: userId }).populate('user', 'name email');
    res.json({ results });
  } catch (err) {
    console.error('Error fetching interview results:', err);
    res.status(500).json({ msg: 'Failed to load interview results' });
  }
};


module.exports = { saveInterviewResult, fetchInterviewResults };
