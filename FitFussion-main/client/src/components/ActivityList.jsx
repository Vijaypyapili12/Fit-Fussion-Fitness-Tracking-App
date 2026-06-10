// src/components/ActivityList.jsx
import { useState, useEffect } from "react";
import { getActivities, deleteActivity, updateActivity } from "../services/api";
import ActivityForm from "./ActivityForm";
import { toast, ToastContainer } from "react-toastify";
import { FaBurn, FaClock, FaTrash, FaRunning, FaPlus } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);
  const [error, setError] = useState("");
  
  // Tracks independent entry values for both fields per card ID
  const [progressInputs, setProgressInputs] = useState({}); 

  const fetchActivities = async () => {
    try {
      const response = await getActivities();
      setActivities(response.data.data);
      setError("");
    } catch (error) {
      console.error("Error fetching activities:", error);
      setError("Failed to fetch activities.");
      toast.error("Failed to fetch activities.");
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        await deleteActivity(id);
        fetchActivities();
        toast.success("Activity deleted successfully.");
      } catch (error) {
        console.error("Error deleting activity:", error);
        setError("Failed to delete activity.");
        toast.error("Failed to delete activity.");
      }
    }
  };

  const handleProgressSubmit = async (e, activity) => {
    e.preventDefault();
    const cardInput = progressInputs[activity._id] || {};
    const addedMinutes = cardInput.minutes;
    let addedCalories = cardInput.calories;

    if (!addedMinutes || Number(addedMinutes) <= 0) {
      return toast.warn("Please enter a valid duration greater than 0.");
    }

    const minsNum = Number(addedMinutes);
    
    // HYBRID CHECK: If the user didn't specify custom calories, run the proportional fallback calculation
    if (!addedCalories || Number(addedCalories) < 0) {
      const calorieRatio = activity.caloriesBurned / activity.duration;
      addedCalories = Math.round(minsNum * (calorieRatio || 5));
    } else {
      addedCalories = Number(addedCalories);
    }

    try {
      // Fire payload down to your PUT resource endpoint
      await updateActivity(activity._id, {
        additionalDuration: minsNum,
        additionalCalories: addedCalories,
      });

      // Evaporate input state register cleanly
      setProgressInputs({
        ...progressInputs,
        [activity._id]: { minutes: "", calories: "" }
      });
      fetchActivities();
      toast.success(`Logged progress to your ${activity.type} workout!`);
    } catch (error) {
      console.error("Error updating incremental activity progress:", error);
      toast.error("Failed to append activity metrics.");
    }
  };

  const handleInputChange = (activityId, field, value) => {
    setProgressInputs({
      ...progressInputs,
      [activityId]: {
        ...(progressInputs[activityId] || { minutes: "", calories: "" }),
        [field]: value
      }
    });
  };

  return (
    <div className="container mx-auto px-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <h2 className="text-3xl font-bold my-4 bg-gradient-to-r from-teal-500 to-blue-500 text-transparent bg-clip-text">
        Activities
      </h2>

      <ActivityForm
        fetchActivities={fetchActivities}
        editingActivity={editingActivity}
        setEditingActivity={setEditingActivity}
      />

      <hr className="my-8 border-t-2 border-gray-300 dark:border-gray-600 w-3/4 mx-auto" />

      <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-300">
        Your Activities
      </h3>

      {error && <p className="text-red-500 dark:text-red-400">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {activities.map((activity) => (
          <div
            key={activity._id}
            className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-5 border border-gray-100 dark:border-gray-700/60 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 capitalize">
                  {activity.type}
                </h3>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-gray-700 dark:text-gray-300 flex items-center text-sm">
                  <FaClock className="mr-2 text-blue-500" /> Duration:{" "}
                  <span className="font-semibold ml-1">{activity.duration} mins</span>
                </p>
                <p className="text-gray-700 dark:text-gray-300 flex items-center text-sm">
                  <FaBurn className="mr-2 text-red-500" /> Calories Burned:{" "}
                  <span className="font-semibold ml-1">{activity.caloriesBurned} kcal</span>
                </p>
              </div>
            </div>

            <div>
              {/* THE ENHANCED HYBRID PROGRESS LOGGING INLINE FORM */}
              <form 
                onSubmit={(e) => handleProgressSubmit(e, activity)} 
                className="space-y-2 mb-4 border-t border-gray-100 dark:border-gray-700/60 pt-4"
              >
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 mb-0.5">Add Mins</label>
                    <input
                      type="number"
                      value={progressInputs[activity._id]?.minutes || ""}
                      onChange={(e) => handleInputChange(activity._id, "minutes", e.target.value)}
                      placeholder="Minutes"
                      className="w-full px-3 py-1.5规范 text-xs rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 mb-0.5">Add Kcal (Opt)</label>
                    <input
                      type="number"
                      value={progressInputs[activity._id]?.calories || ""}
                      onChange={(e) => handleInputChange(activity._id, "calories", e.target.value)}
                      placeholder="Auto-calc if blank"
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2 rounded-xl transition flex items-center justify-center gap-1 shadow-md"
                >
                  <FaPlus className="text-[10px]" /> Update Workout Progress
                </button>
              </form>

              <div className="flex justify-end border-t border-gray-100 dark:border-gray-700/60 pt-2">
                <button
                  onClick={() => handleDelete(activity._id)}
                  className="bg-red-550 dark:bg-red-900/30 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 font-bold py-1.5 px-3 rounded-xl transition flex items-center text-xs"
                >
                  <FaTrash className="mr-1 text-[10px]" /> Remove Log
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityList;