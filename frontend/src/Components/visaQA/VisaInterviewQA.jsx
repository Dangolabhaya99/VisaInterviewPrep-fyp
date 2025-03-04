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
        [question.id]: { confidence: "N/A", similarity: "Off-topic" },
      }));
      return;
    }

    const result = sentimentAnalyzer.analyze(text);
    const confidenceScore = Math.max(0, Math.min(10, ((result.score + 5) / 10) * 10));

    setTones((prevTones) => ({
      ...prevTones,
      [question.id]: { confidence: confidenceScore.toFixed(1), similarity: similarityPercentage },
    }));

    try {
      await fetch("http://localhost:5000/api/save-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: question.id,
          question: question.question,
          response: text,
          confidenceScore: confidenceScore.toFixed(1),
          similarityScore: similarityPercentage,
        }),
      });

      console.log("Response saved successfully");
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
                          <p className="mt-2 text-gray-700"><strong>Confidence in Tone:</strong> <span className="font-bold text-blue-600">{tones[question.id]?.confidence || "N/A"}</span></p>
                          <p className="mt-2 text-gray-700"><strong>Answer Accuracy:</strong> 
                            {tones[question.id]?.similarity === "Off-topic" ? (
                              <span className="font-bold text-red-600">Off-topic</span>
                            ) : (
                              <span className="font-bold text-green-600">{tones[question.id]?.similarity || "N/A"}%</span>
                            )}
                          </p>
                        </>
                      )}

                      {/* "See Answer" Button */}
                      <button onClick={() => toggleAnswer(question.id)}
                              className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <EyeIcon className="h-5 w-5" />
                        {showAnswers[question.id] ? "Hide" : "Tips to answer"}
                      </button>

                      {/* Show Correct Answer */}
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
      </div>
    </div>
  );
};

export default VisaInterviewQA;
