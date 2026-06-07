// src/components/ActivityList.jsx
import { useState, useEffect } from "react";
import { getActivities, deleteActivity } from "../services/api";
import ActivityForm from "./ActivityForm";
import { toast, ToastContainer } from "react-toastify";
import { FaBurn, FaClock, FaEdit, FaTrash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);
  const [error, setError] = useState("");

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
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4"
          >
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {activity.type}
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mt-2 flex items-center">
              <FaClock className="mr-2 text-blue-500" /> Duration:{" "}
              {activity.duration} mins
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-2 flex items-center">
              <FaBurn className="mr-2 text-red-500" /> Calories Burned:{" "}
              {activity.caloriesBurned}
            </p>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setEditingActivity(activity)}
                className="bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded-lg transition flex items-center"
              >
                <FaEdit className="mr-1" /> Edit
              </button>
              <button
                onClick={() => handleDelete(activity._id)}
                className="bg-red-500 dark:bg-red-600 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-lg transition flex items-center"
              >
                <FaTrash className="mr-1" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityList;
