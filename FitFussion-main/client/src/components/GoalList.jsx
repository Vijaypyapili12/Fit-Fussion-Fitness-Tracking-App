// src/components/GoalList.jsx
import { useState, useEffect } from "react";
import { getGoals, deleteGoal, updateGoal } from "../services/api";
import GoalForm from "./GoalForm";
import { FaWalking, FaRunning, FaBicycle } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GoalList = () => {
  const [goals, setGoals] = useState([]);
  const [editingGoal, setEditingGoal] = useState(null);
  const [error, setError] = useState("");

  const fetchGoals = async () => {
    try {
      const response = await getGoals();
      setGoals(response.data.data);
      setError("");
    } catch (error) {
      console.error("Error fetching goals:", error);
      setError("Failed to fetch goals.");
      toast.error("Failed to fetch goals.");
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const confirmDelete = (id) => {
    toast.info(
      <div>
        Are you sure you want to delete this goal?
        <div className="flex justify-end space-x-2 mt-2">
          <button
            onClick={() => handleDelete(id)}
            className="bg-red-500 text-white px-3 py-1 rounded-md"
          >
            Confirm
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-300 dark:bg-gray-600 dark:text-gray-200 text-black px-3 py-1 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: 5000 }
    );
  };

  const handleDelete = async (id) => {
    try {
      await deleteGoal(id);
      fetchGoals();
      toast.success("Goal deleted successfully.");
    } catch (error) {
      console.error("Error deleting goal:", error);
      setError("Failed to delete goal.");
      toast.error("Failed to delete goal.");
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
  };

  const markAsComplete = async (goal) => {
    const updatedGoal = { ...goal, targetLeft: 0 };
    try {
      await updateGoal(goal._id, updatedGoal);
      fetchGoals();
      toast.success("Goal marked as complete!");
    } catch (error) {
      console.error("Error marking goal as complete:", error);
      setError("Failed to update goal status.");
      toast.error("Failed to mark goal as complete.");
    }
  };

  const calculatePercentage = (goal) => {
    const progress = goal.target - goal.targetLeft;
    return (progress / goal.target) * 100;
  };

  const getMotivationalMessage = (percentage) => {
    if (percentage >= 100) return "Goal Achieved! Great Job!";
    if (percentage >= 75) return "Almost There! Keep Pushing!";
    if (percentage >= 50) return "You're Halfway There!";
    return "Stay Consistent!";
  };

  const GoalIcon = ({ type }) => {
    switch (type.toLowerCase()) {
      case "walking":
        return (
          <FaWalking className="text-blue-500 dark:text-blue-400 w-6 h-6" />
        );
      case "running":
        return <FaRunning className="text-red-500 dark:text-red-400 w-6 h-6" />;
      case "cycling":
        return (
          <FaBicycle className="text-green-500 dark:text-green-400 w-6 h-6" />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 bg-white dark:bg-gray-900 dark:text-gray-100 shadow-md rounded-lg p-6">
      <h2 className="text-3xl font-bold my-4 bg-gradient-to-r from-teal-500 to-blue-500 text-transparent bg-clip-text">
        Challenge Yourself
      </h2>

      <GoalForm
        fetchGoals={fetchGoals}
        editingGoal={editingGoal}
        setEditingGoal={setEditingGoal}
      />

      <hr className="my-8 border-t-2 border-gray-300 dark:border-gray-700 w-3/4 mx-auto" />

      <h2 className="text-2xl font-extrabold mb-6 bg-gradient-to-r from-teal-500 to-blue-500 text-transparent bg-clip-text text-center">
        Your Goals
      </h2>
      {error && (
        <p className="text-red-500 dark:text-red-400 text-center">{error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {goals.map((goal) => {
          const percentage = calculatePercentage(goal);

          return (
            <motion.div
              key={goal._id}
              className="glass-card p-6 rounded-2xl shadow-lg transition hover:shadow-2xl bg-white dark:bg-gray-800 bg-opacity-20 dark:bg-opacity-80 backdrop-filter backdrop-blur-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <GoalIcon type={goal.type} />
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">
                  {goal.type}
                </h3>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Target: {goal.target}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Target Left: {goal.targetLeft || "N/A"}
              </p>

              <div className="w-20 h-20 mx-auto mb-4">
                <CircularProgressbar
                  value={percentage}
                  text={`${Math.round(percentage)}%`}
                  styles={buildStyles({
                    pathColor: percentage === 100 ? "#3b82f6" : "#34d399",
                    textColor: "#374151",
                    trailColor: "#d1d5db",
                  })}
                />
              </div>

              <p className="text-sm italic text-gray-500 dark:text-gray-400 text-center mb-4">
                {getMotivationalMessage(percentage)}
              </p>

              <div className="flex items-center justify-around mt-4">
                <button
                  onClick={() => handleEdit(goal)}
                  className="bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded-full shadow-lg transition transform hover:scale-105 flex items-center gap-1"
                >
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button
                  onClick={() => confirmDelete(goal._id)}
                  className="bg-red-500 dark:bg-red-600 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-full shadow-lg transition transform hover:scale-105 flex items-center gap-1"
                >
                  <i className="fas fa-trash-alt"></i> Delete
                </button>
                <button
                  onClick={() => markAsComplete(goal)}
                  className="bg-green-500 dark:bg-green-600 hover:bg-green-600 text-white font-bold py-1 px-2 rounded-full shadow-lg transition transform hover:scale-105 flex items-center gap-1"
                >
                  <i className="fas fa-check-circle"></i> Complete
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalList;
