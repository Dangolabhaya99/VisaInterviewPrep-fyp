import React from "react";

const AboutComponent = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1505063366573-38928ae5567e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Banner"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative z-10 max-w-4xl p-8 bg-white bg-opacity-90 shadow-md rounded-lg">
        <h1 className="text-4xl font-bold text-center text-green-500 mb-8">About Us</h1>
        <div className="space-y-6">
          <p className="text-gray-700 text-lg leading-relaxed">
          Welcome to Visa Interview Prep, your AI-powered partner for mastering visa interviews with confidence. Our platform is designed to bridge the gap between generic preparation resources and the personalized, dynamic needs of visa applicants worldwide. Leveraging cutting-edge artificial intelligence, we analyze your speech, tone, and body language in real time during mock interviews, offering actionable feedback to refine your communication skills and address weaknesses. With a curated database of visa-specific questions, country-specific guidelines, and expert tips, we empower you to navigate interviews with clarity and poise. Whether you’re preparing for a student, work, or tourist visa, our mission is to transform anxiety into assurance by simulating real-world scenarios and delivering tailored insights. Join us to unlock the tools, strategies, and confidence needed to succeed in your visa journey.
          </p>
          
        </div>
      </div>
    </div>
  );
};

export default AboutComponent;
