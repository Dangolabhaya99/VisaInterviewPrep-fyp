import { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon, MicrophoneIcon, EyeIcon } from "@heroicons/react/24/outline";
import Sentiment from "sentiment";
import stringSimilarity from "string-similarity";

const VisaInterviewQA = () => {
  const [questions, setQuestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [responses, setResponses] = useState({});
  const [tones, setTones] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [showAnswers, setShowAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetch("/data/visa_questions.json")
      .then((response) => response.json())
      .then((data) => setQuestions(data))
      .catch((error) => console.error("Error loading questions:", error));
  }, []);

  const toggleAnswer = (id) => {
    setShowAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sentimentAnalyzer = new Sentiment();

  const compareResponses = (userResponse, correctAnswer) => {
    return (stringSimilarity.compareTwoStrings(userResponse.toLowerCase(), correctAnswer.toLowerCase()) * 100).toFixed(1);
  };

  const isResponseRelevant = (userResponse, correctAnswer) => {
    const similarityScore = stringSimilarity.compareTwoStrings(userResponse.toLowerCase(), correctAnswer.toLowerCase()) * 100;
    return similarityScore > 30;
  };

  const analyzeToneAndMatchAnswer = async (text, question) => {
    const correctAnswer = questions.find(q => q.id === question.id)?.answer || "";
    const similarityPercentage = compareResponses(text, correctAnswer);

    if (!isResponseRelevant(text, correctAnswer)) {
      setTones((prevTones) => ({
        ...prevTones,
        [question.id]: { confidence: "N/A", similarity: "Off-topic", points: 0 },
      }));
      return;
    }

    const result = sentimentAnalyzer.analyze(text);
    const confidenceScore = Math.max(0, Math.min(10, ((result.score + 5) / 10) * 10));
    let points = similarityPercentage >= 90 ? 2 : (similarityPercentage / 100) * 2;
    points = parseFloat(points.toFixed(2));

    setTones((prevTones) => ({
      ...prevTones,
      [question.id]: { confidence: confidenceScore.toFixed(1), similarity: similarityPercentage, points },
    }));

    // Save the response to the backend
    await saveResponse(question, text, confidenceScore, similarityPercentage, points);
  };

  const saveResponse = async (question, text, confidenceScore, similarityPercentage, points) => {
    try {
      const response = await fetch("http://localhost:5000/api/save-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: question.id,
          question: question.question,
          response: text,
          confidenceScore: confidenceScore.toFixed(1),
          similarityScore: similarityPercentage,
          points: points,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
      } else {
        console.log("Response saved successfully");
      }
    } catch (error) {
      console.error("Error saving response to backend:", error);
    }
  };

  const startRecording = (question) => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setResponses((prevResponses) => ({ ...prevResponses, [question.id]: transcript }));
      analyzeToneAndMatchAnswer(transcript, question);
    };

    recognition.onerror = (event) => console.error("Speech recognition error:", event.error);
    recognition.onend = () => setIsRecording(false);

    recognition.start();
  };

  const handleSubmit = () => {
    let total = Object.values(tones).reduce((sum, item) => sum + (item.points || 0), 0);
    setTotalPoints(total);
    setSubmitted(true);

    // Feedback messages
    const feedbackMessages = [
      "Excellent! You're well-prepared for your visa interview!",
      "Good job! Just refine a few answers for more accuracy.",
      "You're on the right track! Work on clarity and precision.",
      "Keep practicing! Try to match your responses more closely with the expected answers."
    ];

    let feedbackMessage = "";
    if (total >= questions.length * 2 * 0.9) {
      feedbackMessage = feedbackMessages[0]; // Excellent
    } else if (total >= questions.length * 2 * 0.7) {
      feedbackMessage = feedbackMessages[1]; // Good job
    } else if (total >= questions.length * 2 * 0.5) {
      feedbackMessage = feedbackMessages[2]; // You're on track
    } else {
      feedbackMessage = feedbackMessages[3]; // Keep practicing
    }

    setFeedback(feedbackMessage);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Visa Interview Preparation</h1>

        <div className="space-y-4">
          {questions.length > 0 ? (
            questions.map((question, index) => (
              <div key={question.id} className="border rounded-lg bg-white shadow-sm">
                <button onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                        className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50">
                  <h3 className="font-medium text-gray-900">{question.question}</h3>
                  {activeIndex === index ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
                </button>

                {activeIndex === index && (
                  <div className="px-6 py-4 border-t bg-gray-50">
                    <div className="mt-4 p-4 border rounded-lg bg-gray-100">
                      <button onClick={() => startRecording(question)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                              disabled={isRecording}>
                        <MicrophoneIcon className="h-5 w-5" />
                        {isRecording ? "Recording..." : "Record Answer"}
                      </button>

                      {responses[question.id] && (
                        <>
                          <p className="mt-2 text-gray-900"><strong>Your Response:</strong> {responses[question.id]}</p>

                          {tones[question.id]?.similarity === "Off-topic" ? (
                            <p className="mt-2 text-red-600 font-bold">Your response is Off-topic. No points awarded.</p>
                          ) : (
                            <>
                              <p className="mt-2 text-gray-700"><strong>Confidence in Tone:</strong> <span className="font-bold text-blue-600">{tones[question.id]?.confidence || "N/A"} / 10</span></p>
                              <p className="mt-2 text-gray-700"><strong>Answer Accuracy:</strong> <span className="font-bold text-green-600">{tones[question.id]?.similarity || "N/A"}%</span></p>
                              <p className="mt-2 text-gray-900 font-bold"><strong>Points Earned:</strong> <span className="text-purple-600">{tones[question.id]?.points || "0"} / 2</span></p>
                            </>
                          )}
                        </>
                      )}

                      <button onClick={() => toggleAnswer(question.id)} className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <EyeIcon className="h-5 w-5" />
                        {showAnswers[question.id] ? "Hide" : "Tips to answer"}
                      </button>

                      {showAnswers[question.id] && (
                        <p className="mt-2 text-gray-900"><strong>Possible Answers:</strong> {question.answer}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Loading questions...</p>
          )}
        </div>

        <button onClick={handleSubmit} className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg w-full font-bold">
          Submit & Get Score
        </button>

        {submitted && (
          <div className="mt-4 p-4 bg-white border rounded-lg shadow">
            <p className="text-lg font-bold">Total Score: {totalPoints} / {questions.length * 2}</p>
            <p className="text-gray-700">{feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisaInterviewQA;
