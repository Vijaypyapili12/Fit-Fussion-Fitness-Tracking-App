// src/pages/LogWorkout.jsx
import React, { useState, useEffect } from "react";
import {
  FaHeart,
  FaCheckCircle,
  FaStar,
  FaTrash,
  FaCheck,
} from "react-icons/fa";

const LogWorkout = () => {
  // Initialize state with local storage data or default values
  const [workouts, setWorkouts] = useState(() => {
    const savedWorkouts = localStorage.getItem("workouts");
    return savedWorkouts ? JSON.parse(savedWorkouts) : [];
  });

  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const [personalBests, setPersonalBests] = useState(() => {
    const savedPersonalBests = localStorage.getItem("personalBests");
    return savedPersonalBests
      ? JSON.parse(savedPersonalBests)
      : { Cardio: 0, Strength: 0, Flexibility: 0, Other: 0 };
  });

  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("Cardio");
  const [message, setMessage] = useState("");
  const [weeklySummary, setWeeklySummary] = useState({
    totalWorkouts: 0,
    totalTime: 0,
  });

  const categories = ["Cardio", "Strength", "Flexibility", "Other"];

  // Update weekly summary when workouts change
  useEffect(() => {
    const totalWorkouts = workouts.length;
    const totalTime = workouts.reduce(
      (acc, workout) => acc + workout.duration,
      0
    );
    setWeeklySummary({ totalWorkouts, totalTime });
  }, [workouts]);

  // Save workouts, favorites, and personal bests to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("personalBests", JSON.stringify(personalBests));
  }, [personalBests]);

  const handleLogWorkout = () => {
    if (!type || !duration || duration <= 0) {
      setMessage("Please enter a valid workout type and duration.");
      return;
    }

    const newWorkout = {
      type,
      duration: Number(duration),
      category,
      date: new Date().toLocaleDateString(),
      completed: false,
    };
    setWorkouts((prevWorkouts) => [newWorkout, ...prevWorkouts]);
    setType("");
    setDuration("");
    setMessage("Workout logged successfully!");

    // Update personal bests if this duration is the new highest
    if (Number(duration) > personalBests[category]) {
      setPersonalBests((prevBests) => ({
        ...prevBests,
        [category]: Number(duration),
      }));
    }

    setTimeout(() => setMessage(""), 2000);
  };

  const handleAddFavorite = (workoutType) => {
    if (!favorites.includes(workoutType)) {
      setFavorites((prevFavorites) => [...prevFavorites, workoutType]);
      setMessage("Added to favorites!");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const handleLogFavorite = (favoriteWorkout) => {
    setType(favoriteWorkout);
  };

  const markAsComplete = (index) => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((workout, i) =>
        i === index ? { ...workout, completed: !workout.completed } : workout
      )
    );
  };

  const deleteWorkout = (index) => {
    setWorkouts((prevWorkouts) => prevWorkouts.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center text-blue-600">
        Log Workout
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogWorkout();
        }}
        className="max-w-lg mx-auto mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
      >
        <label className="block mb-4">
          <span className="text-gray-700 dark:text-gray-300">Workout Type</span>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="block w-full mt-1 p-3 rounded-md shadow-sm border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
            placeholder="e.g., Running, Yoga"
          />
          <button
            type="button"
            onClick={() => handleAddFavorite(type)}
            className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 flex items-center"
          >
            <FaHeart className="mr-1" /> Add to Favorites
          </button>
        </label>

        <label className="block mb-4">
          <span className="text-gray-700 dark:text-gray-300">
            Duration (minutes)
          </span>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="block w-full mt-1 p-3 rounded-md shadow-sm border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
            placeholder="Duration"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700 dark:text-gray-300">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block w-full mt-1 p-3 rounded-md shadow-sm border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition flex items-center justify-center"
        >
          <FaCheckCircle className="mr-2" /> Log Workout
        </button>
        {message && (
          <div className="mt-4 text-center text-green-500">
            <FaCheckCircle className="inline mr-2" /> {message}
          </div>
        )}
      </form>

      {/* Weekly Summary, Favorite Workouts, and Personal Bests */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto">
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Weekly Summary
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            <span className="font-bold">{weeklySummary.totalWorkouts}</span>{" "}
            Workouts
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-bold">{weeklySummary.totalTime}</span> minutes
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Favorite Workouts
          </h2>
          {favorites.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {favorites.map((favorite, index) => (
                <li
                  key={index}
                  className="text-gray-800 dark:text-gray-100 flex items-center justify-between cursor-pointer"
                  onClick={() => handleLogFavorite(favorite)}
                >
                  <span>{favorite}</span>
                  <FaHeart className="text-red-500" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-4">No favorites added.</p>
          )}
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Personal Bests
          </h2>
          <ul className="mt-4 space-y-2">
            {Object.keys(personalBests).map((category) => (
              <li
                key={category}
                className="text-gray-600 dark:text-gray-300 flex justify-between"
              >
                <span>{category}:</span>
                <span className="font-bold">{personalBests[category]} min</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-10 max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Recent Workouts
        </h2>
        {workouts.length === 0 ? (
          <p className="text-gray-500 text-center">No workouts logged yet.</p>
        ) : (
          <ul className="space-y-4">
            {workouts.map((workout, index) => (
              <li
                key={index}
                className={`p-6 rounded-lg shadow-md flex justify-between items-center ${
                  workout.completed
                    ? "bg-green-100 dark:bg-green-800"
                    : "bg-gray-100 dark:bg-gray-700"
                }`}
              >
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-100 text-xl">
                    {workout.type}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {workout.duration} minutes, {workout.category} -{" "}
                    {workout.date}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => markAsComplete(index)}
                    title="Mark as Complete"
                  >
                    <FaCheck
                      className={`text-${
                        workout.completed ? "green" : "gray"
                      }-500 text-xl`}
                    />
                  </button>
                  <button
                    onClick={() => deleteWorkout(index)}
                    title="Delete Workout"
                  >
                    <FaTrash className="text-red-500 text-xl" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LogWorkout;
