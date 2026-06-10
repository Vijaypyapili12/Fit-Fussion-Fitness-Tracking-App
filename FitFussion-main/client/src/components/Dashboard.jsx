import React, { useEffect, useState } from "react";
import { getActivities, getGoals } from "../services/api";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

const Dashboard = () => {
  const [activities, setActivities] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [activityRes, goalRes] = await Promise.all([getActivities(), getGoals()]);
        
        // Securely unpack nested object payloads into clean iterable arrays
        const cleanActivities = activityRes.data?.data || activityRes.data || [];
        const cleanGoals = goalRes.data?.data || goalRes.data || [];

        setActivities(cleanActivities);
        setGoals(cleanGoals);
      } catch (error) {
        console.error("Error loading dashboard metrics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Structural metric math calculations
  const totalDuration = activities.reduce((sum, act) => sum + (Number(act.duration) || 0), 0);
  const totalCalories = activities.reduce((sum, act) => sum + (Number(act.caloriesBurned) || 0), 0);
  
  const completedGoals = goals.filter(g => g.completed === true).length;
  const totalGoalsCount = goals.length;
  const goalProgressPercentage = totalGoalsCount > 0 ? Math.round((completedGoals / totalGoalsCount) * 100) : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-xl font-semibold text-blue-500 animate-pulse">Loading Fitness Metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Metrics Header Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Total Workout Duration</h3>
          <p className="text-3xl font-bold mt-2 text-gray-800 dark:text-white">{totalDuration} <span className="text-lg font-normal text-gray-500">mins</span></p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border-l-4 border-orange-500">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Energy Expended</h3>
          <p className="text-3xl font-bold mt-2 text-gray-800 dark:text-white">{totalCalories} <span className="text-lg font-normal text-gray-500">kcal</span></p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Milestones Completed</h3>
          <p className="text-3xl font-bold mt-2 text-gray-800 dark:text-white">{completedGoals} / {totalGoalsCount}</p>
          {/* Progress Bar Component */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${goalProgressPercentage}%` }}></div>
          </div>
          <p className="text-xs text-right mt-1 text-gray-400">{goalProgressPercentage}% Success rate</p>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h3 className="text-lg font-bold mb-4 text-gray-700 dark:text-white">Workout Performance (Duration)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activities}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="type" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="duration" name="Minutes" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h3 className="text-lg font-bold mb-4 text-gray-700 dark:text-white">Caloric Burn History</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activities}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="type" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip />
                <Legend />
                <Bar dataKey="caloriesBurned" name="Calories" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;