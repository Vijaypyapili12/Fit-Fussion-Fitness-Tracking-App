// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { getActivities, getGoals } from "../services/api";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { FaRunning, FaClock, FaBurn, FaFire } from "react-icons/fa";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [activities, setActivities] = useState([]);
  const [goals, setGoals] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");
  const [activitySummary, setActivitySummary] = useState({
    totalActivities: 0,
    totalDuration: 0,
    totalCalories: 0,
  });

  useEffect(() => {
    fetchActivities();
    fetchGoals();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await getActivities();
      const activitiesData = response.data.data;
      setActivities(activitiesData);
      setActivitySummary({
        totalActivities: activitiesData.length,
        totalDuration: activitiesData.reduce(
          (sum, activity) => sum + activity.duration,
          0
        ),
        totalCalories: activitiesData.reduce(
          (sum, activity) => sum + activity.caloriesBurned,
          0
        ),
      });
      setLastUpdated(moment().format("LLL"));
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const fetchGoals = async () => {
    try {
      const response = await getGoals();
      setGoals(response.data.data);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  // Generate motivational tips based on activity data
  const getMotivationalTip = () => {
    if (activitySummary.totalDuration < 100) {
      return "Keep it up! Aim for at least 150 minutes of activity per week for a healthier you!";
    } else if (activitySummary.totalCalories < 500) {
      return "Great start! Consider increasing the intensity to burn more calories.";
    }
    return "You're doing amazing! Stay consistent and keep reaching for your goals!";
  };

  const calculateStreak = () => {
    return activities.length > 0
      ? `${activities.length} day(s) of activity!`
      : "No activity yet";
  };

  const getFireIcons = (percentage) => {
    const fullFires = Math.floor(percentage / 20);
    const halfFire = percentage % 20 >= 10;
    return (
      <>
        {[...Array(fullFires)].map((_, i) => (
          <FaFire key={i} className="text-yellow-500" />
        ))}
        {halfFire && <FaFire className="text-yellow-300 opacity-50" />}
        {[...Array(5 - fullFires - (halfFire ? 1 : 0))].map((_, i) => (
          <FaFire key={fullFires + i + 1} className="text-gray-400" />
        ))}
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 dark:bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Header Section */}
      <div className="mt-4 flex justify-between items-center px-4">
        <h2 className="text-3xl font-bold my-4 bg-gradient-to-r from-teal-500 to-blue-500 text-transparent bg-clip-text">
          Dashboard
        </h2>
        <div className="bg-blue-500 text-white py-2 px-4 rounded-full shadow-lg flex items-center space-x-2">
          <span role="img" aria-label="fire">
            🔥
          </span>
          <span>Streak: {calculateStreak()}</span>
        </div>
      </div>

      {/* Motivational Tip */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 rounded-lg shadow-lg mb-8 text-center text-lg font-semibold dark:from-blue-700 dark:to-green-700">
        {getMotivationalTip()}
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Summary Cards */}
      </div>

      {/* Line Chart - Activity Duration Over Time */}
      <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Activity Duration Over Time
        </h3>
        <div className="h-[300px] overflow-hidden">
          <Line
            data={{
              labels: activities.map((activity) =>
                new Date(activity.date).toLocaleDateString()
              ),
              datasets: [
                {
                  label: "Activity Duration (mins)",
                  data: activities.map((activity) => activity.duration),
                  backgroundColor: "rgba(34, 197, 94, 0.5)",
                  borderColor: "rgba(34, 197, 94, 1)",
                  tension: 0.1,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: { title: { display: true, text: "Date" } },
                y: { title: { display: true, text: "Duration (mins)" } },
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => {
                      const activity = activities[tooltipItem.dataIndex];
                      return `Activity: ${activity.type}, Duration: ${activity.duration} mins`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Bar Chart - Calories Burned Over Time */}
      <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Calories Burned Over Time
        </h3>
        <div className="h-[300px] overflow-hidden">
          <Bar
            data={{
              labels: activities.map((activity) =>
                new Date(activity.date).toLocaleDateString()
              ),
              datasets: [
                {
                  label: "Calories Burned",
                  data: activities.map((activity) => activity.caloriesBurned),
                  backgroundColor: "rgba(59, 130, 246, 0.5)",
                  borderColor: "rgba(59, 130, 246, 1)",
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: { title: { display: true, text: "Date" } },
                y: { title: { display: true, text: "Calories Burned" } },
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => {
                      const activity = activities[tooltipItem.dataIndex];
                      return `Activity: ${activity.type}, Calories: ${activity.caloriesBurned}`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Goals Progress */}
      <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Goals Progress
        </h3>
        <ul className="space-y-4">
          {goals.map((goal) => {
            const progressPercentage = Math.min(
              ((goal.target - goal.targetLeft) / goal.target) * 100,
              100
            );
            return (
              <li
                key={goal._id}
                className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg flex flex-col"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                    {goal.type}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {goal.completed ? "Completed" : "In Progress"}
                  </p>
                </div>
                <div className="flex items-center mb-2">
                  {getFireIcons(progressPercentage)}
                </div>
                <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-4">
                  <div
                    className="bg-blue-500 dark:bg-blue-400 h-4 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {progressPercentage.toFixed(2)}% completed
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
