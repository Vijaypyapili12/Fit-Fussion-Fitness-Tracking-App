// src/components/GoalList.jsx
import { useState, useEffect } from "react";
import { getGoals, deleteGoal, updateGoal } from "../services/api";
import GoalForm from "./GoalForm";
import { FaWalking, FaRunning, FaBicycle, FaPlus } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GoalList = () => {
  const [goals, setGoals] = useState([]);
  const [editingGoal, setEditingGoal] = useState(null);
  const [error, setError] = useState("");
  const [progressInputs, setProgressInputs] = useState({}); // Tracks independent progress input text values for each card ID

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

  // THE NEW INTERACTIVE PROGRESS ACCUMULATOR ACTION PIPELINE
  const handleProgressSubmit = async (e, goal) => {
    e.preventDefault();
    const inputVal = progressInputs[goal._id];

    if (!inputVal || Number(inputVal) <= 0) {
      return toast.warn("Please type a valid value greater than 0.");
    }

    try {
      // Fires the exact progress made down to your PUT resource endpoint
      await updateGoal(goal._id, { progressMade: Number(inputVal) });
      
      // Clear out the single state register field
      setProgressInputs({ ...progressInputs, [goal._id]: "" });
      fetchGoals();
      toast.success(`Progress successfully recorded for ${goal.type}!`);
    } catch (error) {
      console.error("Error submitting progress metrics:", error);
      toast.error("Failed to append goal progress.");
    }
  };

  const handleInputChange = (goalId, value) => {
    setProgressInputs({
      ...progressInputs,
      [goalId]: value,
    });
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
    if (goal.target <= 0) return 0;
    const computed = (progress / goal.target) * 100;
    return Math.min(100, Math.max(0, computed)); // Bounds checking calculation parameters
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
              className="glass-card p-6 rounded-2xl shadow-lg transition hover:shadow-2xl bg-white dark:bg-gray-800 bg-opacity-20 dark:bg-opacity-80 backdrop-filter backdrop-blur-lg flex flex-col justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <GoalIcon type={goal.type} />
                  <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 capitalize">
                    {goal.type}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <p>Target: <span className="font-semibold text-gray-700 dark:text-gray-200">{goal.target}</span></p>
                  <p>Target Left: <span className="font-semibold text-gray-700 dark:text-gray-200">{goal.targetLeft ?? "N/A"}</span></p>
                </div>

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
              </div>

              <div>
                {/* INLINE ADD PROGRESS INPUT BLOCK PANEL (Replaces Old Edit Field View) */}
                {!goal.completed && (
                  <form 
                    onSubmit={(e) => handleProgressSubmit(e, goal)} 
                    className="flex space-x-2 mb-4 border-t border-gray-100 dark:border-gray-700 pt-4"
                  >
                    <input
                      type="number"
                      value={progressInputs[goal._id] || ""}
                      onChange={(e) => handleInputChange(goal._id, e.target.value)}
                      placeholder="Enter progress value..."
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-md whitespace-nowrap"
                    >
                      <FaPlus className="text-[10px]" /> Progress
                    </button>
                  </form>
                )}

                <div className="flex items-center justify-around gap-2 border-t border-gray-100 dark:border-gray-700 pt-2">
                  <button
                    onClick={() => confirmDelete(goal._id)}
                    className="bg-red-500 dark:bg-red-600 hover:bg-red-600 text-white font-bold py-1.5 px-3 rounded-full shadow transition transform hover:scale-105 flex items-center gap-1 text-xs"
                  >
                    <i className="fas fa-trash-alt"></i> Delete
                  </button>
                  
                  {!goal.completed && (
                    <button
                      onClick={() => markAsComplete(goal)}
                      className="bg-green-500 dark:bg-green-600 hover:bg-green-600 text-white font-bold py-1.5 px-3 rounded-full shadow transition transform hover:scale-105 flex items-center gap-1 text-xs"
                    >
                      <i className="fas fa-check-circle"></i> Complete
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalList;