const InterviewResult = require('../Models/VisaInterviewResult');

const saveInterviewResult = async (req, res) => {
  try {
    const { totalPoints, feedback } = req.body;

    if (totalPoints === undefined || !feedback) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const result = new InterviewResult({
      totalPoints,
      feedback,
    });

    await result.save();

    res.status(201).json({
      message: 'Interview result saved successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error saving interview result:', error);
    res.status(500).json({ error: 'Failed to save interview result' });
  }
};

const fetchInterviewResults = async (req, res) => {
  try {
    const results = await InterviewResult.find({ user: req.userId }) // Fetch results for the logged-in user
      .populate('user', 'name email'); // Optionally populate user details
    res.json({ results });
  } catch (error) {
    console.error('Error fetching interview results:', error);
    res.status(500).json({ error: 'Failed to fetch interview results' });
  }
};



module.exports = { saveInterviewResult,fetchInterviewResults };
