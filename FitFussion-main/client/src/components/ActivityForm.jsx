// src/components/ActivityForm.jsx
import { useState, useEffect } from "react";
import { createActivity, updateActivity } from "../services/api";
import motivationalImage from "../assets/motivational-image.gif";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ActivityForm = ({
  fetchActivities,
  editingActivity,
  setEditingActivity,
}) => {
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingActivity) {
      setType(editingActivity.type);
      setDuration(editingActivity.duration);
      setCaloriesBurned(editingActivity.caloriesBurned);
    } else {
      setType("");
      setDuration("");
      setCaloriesBurned("");
    }
  }, [editingActivity]);

  const motivationalQuotes = [
    "Push harder than yesterday if you want a different tomorrow.",
    "Your body can stand almost anything. It’s your mind you have to convince.",
    "Success isn’t always about greatness. It’s about consistency.",
    "The only bad workout is the one you didn’t do.",
    "Push yourself, because no one else is going to do it for you!",
  ];

  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 5000);
    return () => clearInterval(quoteInterval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const activityData = {
      type,
      duration: Number(duration),
      caloriesBurned: Number(caloriesBurned),
    };

    try {
      if (editingActivity) {
        await updateActivity(editingActivity._id, activityData);
        setEditingActivity(null);
        toast.success("Activity updated successfully!", { autoClose: 3000 });
      } else {
        await createActivity(activityData);
        toast.success("Activity added successfully!", { autoClose: 3000 });
      }
      fetchActivities();
      setType("");
      setDuration("");
      setCaloriesBurned("");
      setError("");
    } catch (error) {
      console.error("Error submitting activity:", error);
      setError(error.response?.data?.message || "An error occurred.");
      toast.error("Failed to submit activity.", { autoClose: 3000 });
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 my-8">
      <div className="w-full md:w-1/3 flex justify-center">
        <img
          src={motivationalImage}
          alt="Motivational"
          className="w-[250px] h-auto rounded-lg"
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full md:w-1/3 p-8 rounded-lg shadow-2xl bg-white dark:bg-gray-800 transition-all duration-300"
      >
        <h3 className="text-xl font-extrabold mb-4 text-center text-blue-700 dark:text-blue-300">
          {editingActivity ? "Edit Activity" : "Add Activity"}
        </h3>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
            Type:
          </label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Enter activity type"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
            Duration (in minutes):
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            min="1"
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Enter duration"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
            Calories Burned:
          </label>
          <input
            type="number"
            value={caloriesBurned}
            onChange={(e) => setCaloriesBurned(e.target.value)}
            required
            min="0"
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Enter calories burned"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-200"
        >
          {editingActivity ? "Update" : "Add"}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>

      <div className="w-full md:w-1/3 text-center md:text-left p-4">
        <blockquote className="text-lg font-semibold text-gray-700 dark:text-gray-300 italic">
          {motivationalQuotes[currentQuote]}
        </blockquote>
      </div>
    </div>
  );
};

export default ActivityForm;
