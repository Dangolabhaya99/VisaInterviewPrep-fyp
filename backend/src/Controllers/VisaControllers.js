// controllers/responseController.js
const Response = require("../Models/VisaResponse");

const saveResponse = async (req, res) => {
  const { questionId, question, response, confidenceScore, similarityScore, points } = req.body;

  try {
    // Create a new response document with the incoming data
    const newResponse = new Response({
      questionId,
      question,
      response,
      confidenceScore,
      similarityScore,
      points,
    });

    // Save the response to the database
    await newResponse.save();

    // Send a success response
    res.status(201).json({ message: "Response saved successfully", response: newResponse });
  } catch (error) {
    console.error("Error saving response:", error);
    res.status(500).json({ error: "Failed to save response", details: error.message });
  }
};

module.exports = { saveResponse };
