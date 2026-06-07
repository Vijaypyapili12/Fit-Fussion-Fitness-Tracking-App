// src/pages/Challenge.jsx
import React, { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaPlusCircle,
  FaRunning,
  FaBullseye,
  FaTrophy,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

const motivationalQuotes = [
  "Believe in yourself and all that you are!",
  "The only bad workout is the one you didn’t do.",
  "Success is the sum of small efforts repeated daily.",
  "Push harder than yesterday if you want a better tomorrow.",
];

const Challenge = () => {
  const [challenges, setChallenges] = useState(() => {
    const savedChallenges = localStorage.getItem("challenges");
    return savedChallenges ? JSON.parse(savedChallenges) : [];
  });

  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);
  const [newChallenge, setNewChallenge] = useState({
    id: "",
    description: "",
    duration: 7,
    progress: 0,
    difficulty: "Medium",
    reminder: false,
  });
 
  useEffect(() => {
    setCurrentQuote(
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    );
  }, []);
 
  useEffect(() => {
    localStorage.setItem("challenges", JSON.stringify(challenges));
  }, [challenges]);

  const handleCreateChallenge = () => {
    if (newChallenge.description.trim() === "") {
      alert("Please add a description for your challenge.");
      return;
    }

    const challenge = {
      ...newChallenge,
      id: uuidv4(), // Assign a unique ID to each challenge
      progress: 0, // Reset progress on creation
    };

    setChallenges([...challenges, challenge]);
    setNewChallenge({
      id: "",
      description: "",
      duration: 7,
      progress: 0,
      difficulty: "Medium",
      reminder: false,
    });
  };

  const handleAddProgress = (id) => {
    setChallenges((prevChallenges) =>
      prevChallenges.map((challenge) => {
        if (challenge.id === id && challenge.progress < challenge.duration) {
          const updatedProgress = challenge.progress + 1;
          return {
            ...challenge,
            progress: updatedProgress,
            completed: updatedProgress === challenge.duration,
          };
        }
        return challenge;
      })
    );
  };

  const handleDeleteChallenge = (id) => {
    setChallenges((prevChallenges) =>
      prevChallenges.filter((challenge) => challenge.id !== id)
    );
  };

  const handleResetChallenge = (id) => {
    setChallenges((prevChallenges) =>
      prevChallenges.map((challenge) =>
        challenge.id === id
          ? { ...challenge, progress: 0, completed: false }
          : challenge
      )
    );
  };

  const handleInputChange = (field, value) => {
    setNewChallenge((prevChallenge) => ({
      ...prevChallenge,
      [field]: value,
    }));
  };

  return (
    <div className="container mx-auto p-6">
      {/* Motivational Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-600">
          Manage Your Challenges
        </h1>
        <p className="text-lg mt-4 text-gray-700 dark:text-gray-300">
          "{currentQuote}"
        </p>
      </div>

      {/* New Challenge Form */}
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Create a New Challenge
        </h2>

        <label className="block text-left mt-4">
          <span className="text-gray-600 dark:text-gray-300">
            Challenge Description
          </span>
          <input
            type="text"
            value={newChallenge.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="block w-full mt-2 p-3 rounded-md shadow-sm border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            placeholder="e.g., Walk 10,000 steps daily"
          />
        </label>

        <label className="block text-left mt-4">
          <span className="text-gray-600 dark:text-gray-300">
            Duration (days)
          </span>
          <input
            type="number"
            value={newChallenge.duration}
            onChange={(e) =>
              handleInputChange("duration", Number(e.target.value))
            }
            className="block w-full mt-2 p-3 rounded-md shadow-sm border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            placeholder="Duration"
          />
        </label>

        <label className="block text-left mt-4">
          <span className="text-gray-600 dark:text-gray-300">
            Difficulty Level
          </span>
          <select
            value={newChallenge.difficulty}
            onChange={(e) => handleInputChange("difficulty", e.target.value)}
            className="block w-full mt-2 p-3 rounded-md shadow-sm border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </label>

        <button
          onClick={handleCreateChallenge}
          className="w-full mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition flex items-center justify-center"
        >
          <FaPlusCircle className="mr-2" /> Create Challenge
        </button>
      </div>

      {/* Challenge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center relative"
          >
            <FaBullseye className="text-4xl text-purple-600 dark:text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              {challenge.description}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Duration: {challenge.duration} days, Difficulty:{" "}
              {challenge.difficulty}
            </p>
            <div className="relative mt-4 w-full bg-gray-200 rounded-full h-4">
              <div
                className="absolute top-0 left-0 h-4 bg-purple-500 rounded-full"
                style={{
                  width: `${(challenge.progress / challenge.duration) * 100}%`,
                }}
              ></div>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {challenge.progress} / {challenge.duration} days completed
            </p>

            {!challenge.completed ? (
              <button
                onClick={() => handleAddProgress(challenge.id)}
                className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition flex items-center justify-center"
              >
                <FaRunning className="mr-2" /> Add Progress
              </button>
            ) : (
              <p className="mt-4 text-green-500">Challenge Completed!</p>
            )}

            <button
              onClick={() => handleDeleteChallenge(challenge.id)}
              className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
              title="Delete Challenge"
            >
              <FaTrash />
            </button>
            {challenge.completed && (
              <button
                onClick={() => handleResetChallenge(challenge.id)}
                className="w-full mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition flex items-center justify-center"
              >
                <FaEdit className="mr-2" /> Reset Challenge
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Challenge;
