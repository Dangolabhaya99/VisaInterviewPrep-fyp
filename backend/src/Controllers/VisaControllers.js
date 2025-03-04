const VisaResponse = require("../Models/VisaResponse");

// Store user response
exports.saveResponse = async (req, res) => {
  try {
    const { questionId, question, response, tone } = req.body;

    const newResponse = new VisaResponse({
      questionId,
      question,
      response,
      tone
    });

    await newResponse.save();
    res.status(201).json({ message: "Response saved successfully", data: newResponse });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Fetch all responses
exports.getResponses = async (req, res) => {
  try {
    const responses = await VisaResponse.find();
    res.status(200).json(responses);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
