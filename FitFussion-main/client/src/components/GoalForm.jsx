// src/components/GoalForm.jsx
import { useState, useEffect } from "react";
import { createGoal, updateGoal } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import runningGif from "../assets/goal.png"; // Replace with actual path
import gymGif from "../assets/gym.gif"; // Replace with actual path

const GoalForm = ({ fetchGoals, editingGoal, setEditingGoal }) => {
  const [type, setType] = useState("");
  const [target, setTarget] = useState("");
  const [targetLeft, setTargetLeft] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingGoal) {
      setType(editingGoal.type);
      setTarget(editingGoal.target);
      setTargetLeft(editingGoal.targetLeft);
    } else {
      setType("");
      setTarget("");
      setTargetLeft("");
    }
  }, [editingGoal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const goalData = {
      type,
      target: Number(target),
      targetLeft: Number(targetLeft),
    };

    try {
      if (goalData.targetLeft > goalData.target) {
        setError("Target Left cannot be greater than Target.");
        return;
      }
      if (editingGoal) {
        await updateGoal(editingGoal._id, goalData);
        setEditingGoal(null);
        toast.success("Goal updated successfully!");
      } else {
        await createGoal(goalData);
        toast.success("Goal added successfully!");
      }
      fetchGoals();
      setType("");
      setTarget("");
      setTargetLeft("");
      setError("");
    } catch (error) {
      console.error("Error submitting goal:", error);
      setError(error.response?.data?.message || "An error occurred.");
      toast.error("Failed to submit goal.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center my-8 md:space-x-8 lg:space-x-12">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Left GIF - Running */}
      <img
        src={runningGif}
        alt="Running GIF"
        className="w-40 h-40 md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] mb-6 md:mb-0"
      />

      {/* Goal Form */}
      <div className="flex flex-col justify-center items-center w-full max-w-xs md:max-w-md lg:max-w-lg">
        <form
          onSubmit={handleSubmit}
          className="glass-card w-full p-6 md:p-8 rounded-xl shadow-2xl backdrop-filter backdrop-blur-md bg-opacity-50 bg-white dark:bg-gray-800"
        >
          <h3 className="text-xl md:text-2xl font-extrabold mb-6 bg-gradient-to-r from-teal-500 to-blue-500 text-transparent bg-clip-text text-center">
            {editingGoal ? "Edit Goal" : "New Goal"}
          </h3>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
              Goal Type:
            </label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="w-full p-3 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-gray-100"
              placeholder="Enter goal type"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
              Target:
            </label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              required
              min="1"
              className="w-full p-3 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-gray-100"
              placeholder="Enter target value"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
              Target Left:
            </label>
            <input
              type="number"
              value={targetLeft}
              onChange={(e) => setTargetLeft(e.target.value)}
              required
              min="0"
              max={target || undefined}
              className="w-full p-3 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-gray-100"
              placeholder="Enter target left"
            />
          </div>

          <div className="flex items-center justify-center mt-6">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold py-3 rounded-lg shadow-lg transition duration-200 hover:from-green-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {editingGoal ? "Update" : "Add"}
            </button>
          </div>

          {error && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-4 text-center">
              {error}
            </p>
          )}
        </form>
      </div>

      {/* Right GIF - Gym */}
      <img
        src={gymGif}
        alt="Gym GIF"
        className="w-40 h-40 md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] mt-6 md:mt-0"
      />
    </div>
  );
};

export default GoalForm;
