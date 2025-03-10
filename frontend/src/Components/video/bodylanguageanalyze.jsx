import React, { useRef, useState, useEffect } from "react";
import * as posenet from "@tensorflow-models/posenet";
import "@tensorflow/tfjs";

const BodyLanguageAnalyzer = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const recordingRef = useRef(false); // Use ref to ensure correct recording state in setInterval
  const [feedback, setFeedback] = useState("Press record to analyze posture.");
  const [poseData, setPoseData] = useState([]);

  useEffect(() => {
    startCamera();
  }, []);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  const startRecording = async () => {
    setFeedback("Recording posture...");
    recordingRef.current = true; // Update ref
    setPoseData([]); // Reset pose data
    analyzePose();
  };

  const stopRecording = () => {
    recordingRef.current = false; // Stop recording

    if (poseData.length === 0) {
      setFeedback("No posture data recorded. Please try again.");
    } else {
      generateFinalFeedback();
    }
  };

  const analyzePose = async () => {
    const net = await posenet.load();
    const video = videoRef.current;

    if (!video) return;

    const interval = setInterval(async () => {
      if (!recordingRef.current) {
        clearInterval(interval);
        return;
      }

      const pose = await net.estimateSinglePose(video, { flipHorizontal: false });

      if (!pose || !pose.keypoints) {
        console.log("No pose detected.");
        return;
      }

      console.log("Pose detected:", pose);

      drawPose(pose);

      // Store pose data safely
      setPoseData((prev) => [...prev, pose]);
    }, 1000);
  };

  const drawPose = (pose) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pose.keypoints.forEach((point) => {
      if (point.score > 0.5) {
        ctx.beginPath();
        ctx.arc(point.position.x, point.position.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
      }
    });
  };

  const generateFinalFeedback = () => {
    if (poseData.length === 0) {
      setFeedback("No posture data recorded.");
      return;
    }

    let badPostureCount = 0;

    poseData.forEach((pose) => {
      const leftShoulder = pose.keypoints.find((p) => p.part === "leftShoulder");
      const rightShoulder = pose.keypoints.find((p) => p.part === "rightShoulder");
      const leftHip = pose.keypoints.find((p) => p.part === "leftHip");
      const rightHip = pose.keypoints.find((p) => p.part === "rightHip");

      // Shoulder alignment check
      if (leftShoulder && rightShoulder) {
        const shoulderDiff = Math.abs(leftShoulder.position.y - rightShoulder.position.y);
        if (shoulderDiff > 20) {
          badPostureCount++;
        }
      }

      // Hip alignment check
      if (leftHip && rightHip) {
        const hipDiff = Math.abs(leftHip.position.y - rightHip.position.y);
        if (hipDiff > 20) {
          badPostureCount++;
        }
      }
    });

    if (badPostureCount > poseData.length / 2) {
      setFeedback("Your posture was uneven for most of the session. Try to sit up straight.");
    } else {
      setFeedback("Great job! Your posture was mostly good.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Body Language Analyzer</h1>
      <p className="text-lg text-gray-600 mb-4">{feedback}</p>
      <div className="relative">
        <video ref={videoRef} autoPlay playsInline className="border rounded-lg shadow-lg"></video>
        <canvas ref={canvasRef} className="absolute top-0 left-0"></canvas>
      </div>
      <div className="mt-4 flex space-x-4">
        <button onClick={startRecording} className="px-4 py-2 bg-red-600 text-white rounded-lg">
          Start Recording
        </button>
        <button onClick={stopRecording} className="px-4 py-2 bg-gray-600 text-white rounded-lg">
          Stop Recording
        </button>
      </div>
    </div>
  );
};

export default BodyLanguageAnalyzer;
