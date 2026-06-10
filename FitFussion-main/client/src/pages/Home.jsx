// src/pages/Home.jsx
import { Link, useNavigate } from "react-router-dom";
import { FaDumbbell, FaChartLine, FaRunning, FaUsers } from "react-icons/fa";
import fitnessImage from "../assets/fitness-image.jpeg";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendContactMessage } from "../services/api"; // Secure DB service hook

const Home = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");
  const motivationalQuotes = [
    "Push harder than yesterday if you want a different tomorrow.",
    "Your body can stand almost anything. It’s your mind you have to convince.",
    "Success isn’t always about greatness. It’s about consistency.",
  ];
  const [currentQuote, setCurrentQuote] = useState(0);
  const [weeklyChallenge, setWeeklyChallenge] = useState(
    "Complete 5 workouts this week!"
  );
  const [dashboardData, setDashboardData] = useState({
    stepsToday: 8000,
    caloriesBurned: 300,
    weeklyWorkouts: 3,
    dailyGoal: 10000,
  });
  const [friendActivities, setFriendActivities] = useState([
    "Vjoy completed a 5K run today!",
    "Arjun hit her 10,000 step goal!",
    "Preethi joined a yoga class!",
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(
      hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening"
    );

    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 5000);

    return () => clearInterval(quoteInterval);
  }, []);

  const handleJoinChallenge = () => {
    navigate("/challenge");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🌟 FIX: Swapped out EmailJS for your explicit backend MERN pipeline save
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return toast.warn("Please completely fill in all inputs before sending.", {
        position: "bottom-right",
      });
    }

    try {
      setLoading(true);
      
      // Directly posts to http://localhost:5000/api/messages
      await sendContactMessage({
        name: formData.name,
        email: formData.email,
        message: formData.message
      });

      toast.success("Message sent! We’ll get back to you soon.", {
        position: "bottom-right",
      });
      
      // Clear inputs cleanly on completion success
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Database tracking contact crash details:", error);
      toast.error("Error sending message. Please try again.", {
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  // State flag for loading transitions
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Hero Section */}
      <div className="relative text-center py-20 overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-50"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.img
          src={fitnessImage}
          alt="Fitness Motivation"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        />
        <div className="relative z-10 space-y-4 text-white">
          <motion.h1
            className="text-5xl font-extrabold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {greeting}!
          </motion.h1>
          <motion.p
            className="text-xl mt-4 italic cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            key={currentQuote}
          >
            {motivationalQuotes[currentQuote]}
          </motion.p>
        </div>
      </div>

      {/* Why Use Section */}
      <div className="container mx-auto my-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-semibold mb-4 text-teal-600 dark:text-teal-400">
          Why Use Our Fitness Tracker?
        </h2>
        <div className="flex flex-wrap justify-center space-x-4 space-y-4 text-lg text-gray-700 dark:text-gray-300">
          <div className="flex items-center p-4 bg-blue-100 dark:bg-gray-700 rounded-lg">
            <FaDumbbell className="text-blue-600 text-2xl mr-2" />
            Track your activities and progress with ease.
          </div>
          <div className="flex items-center p-4 bg-green-100 dark:bg-gray-700 rounded-lg">
            <FaChartLine className="text-green-600 text-2xl mr-2" />
            Set personalized goals and monitor results.
          </div>
          <div className="flex items-center p-4 bg-purple-100 dark:bg-gray-700 rounded-lg">
            <FaUsers className="text-purple-600 text-2xl mr-2" />
            Connect with friends for shared motivation.
          </div>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="container mx-auto my-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-600 dark:text-indigo-400">
          Your Dashboard Preview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md">
            <FaRunning className="text-blue-600 dark:text-blue-400 text-4xl mb-2" />
            <h3 className="text-xl font-semibold">Today’s Steps</h3>
            <p className="text-lg">
              {dashboardData.stepsToday} / {dashboardData.dailyGoal}
            </p>
            <motion.progress
              value={dashboardData.stepsToday}
              max={dashboardData.dailyGoal}
              className="w-full h-2 mt-2 bg-blue-200 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${
                  (dashboardData.stepsToday / dashboardData.dailyGoal) * 100
                }%`,
              }}
              transition={{ duration: 1.5 }}
            />
          </div>
          <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md">
            <FaChartLine className="text-green-600 dark:text-green-400 text-4xl mb-2" />
            <h3 className="text-xl font-semibold">Calories Burned</h3>
            <p className="text-lg">{dashboardData.caloriesBurned} kcal</p>
            <motion.progress
              value={dashboardData.caloriesBurned}
              max="500"
              className="w-full h-2 mt-2 bg-green-200 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${(dashboardData.caloriesBurned / 500) * 100}%`,
              }}
              transition={{ duration: 1.5 }}
            />
          </div>
          <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md">
            <FaChartLine className="text-orange-600 dark:text-orange-400 text-4xl mb-2" />
            <h3 className="text-xl font-semibold">Weekly Workouts</h3>
            <p className="text-lg">{dashboardData.weeklyWorkouts} / 5</p>
            <motion.progress
              value={dashboardData.weeklyWorkouts}
              max="5"
              className="w-full h-2 mt-2 bg-orange-200 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${(dashboardData.weeklyWorkouts / 5) * 100}%`,
              }}
              transition={{ duration: 1.5 }}
            />
          </div>
        </div>
      </div>

      {/* Weekly Challenge Section */}
      <div className="container mx-auto my-8 p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-lg text-center relative">
        <motion.div
          className="absolute -top-8 left-0 right-0 flex justify-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <FaDumbbell className="text-6xl text-indigo-200" />
        </motion.div>
        <h2 className="text-2xl font-semibold mb-4">Weekly Challenge</h2>
        <p className="text-lg">{weeklyChallenge}</p>
        <button
          onClick={handleJoinChallenge}
          className="mt-4 px-6 py-2 bg-white text-indigo-600 rounded-full shadow-lg hover:bg-indigo-50 transition"
        >
          Join Challenge
        </button>
      </div>

      {/* Friend Activity Feed */}
      <div className="container mx-auto my-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
          Friend Activity Feed
        </h2>
        <ul className="space-y-4">
          {friendActivities.map((activity, index) => (
            <motion.li
              key={index}
              className="flex items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.2 }}
            >
              <FaUsers className="text-blue-500 dark:text-blue-400 mr-2 text-2xl" />
              <span>{activity}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Quick Links for Common Actions */}
      <div className="container mx-auto flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 my-10">
        <motion.div whileHover={{ scale: 1.05, y: -5 }}>
          <Link
            to="/dashboard"
            className="flex items-center px-8 py-4 bg-blue-500 text-white rounded-lg font-semibold shadow-lg hover:bg-blue-600 transition ease-in-out duration-200"
          >
            <FaRunning className="mr-3 text-2xl" /> View Progress
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05, y: -5 }}>
          <Link
            to="/goals"
            className="flex items-center px-8 py-4 bg-green-500 text-white rounded-lg font-semibold shadow-lg hover:bg-green-600 transition ease-in-out duration-200"
          >
            <FaChartLine className="mr-3 text-2xl" /> Set Goal
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05, y: -5 }}>
          <Link
            to="/log-workout"
            className="flex items-center px-8 py-4 bg-orange-500 text-white rounded-lg font-semibold shadow-lg hover:bg-orange-600 transition ease-in-out duration-200"
          >
            <FaDumbbell className="mr-3 text-2xl" /> Log Workout
          </Link>
        </motion.div>
      </div>

      {/* Connect With Us Section */}
      <div className="container mx-auto my-8 p-8 bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg text-center">
        <h2 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Connect With Us
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Share your details, and we'll keep you updated with the latest news.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-6"
        >
          <input
            type="text"
            name="name"
            value={formData.name}
            disabled={loading}
            onChange={handleInputChange}
            placeholder="Your Name"
            className="w-full md:w-1/2 px-6 py-3 rounded-lg text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 transition-all duration-300 ease-in-out"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled={loading}
            onChange={handleInputChange}
            placeholder="Your Email"
            className="w-full md:w-1/2 px-6 py-3 rounded-lg text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 transition-all duration-300 ease-in-out"
            required
          />
          <textarea
            name="message"
            value={formData.message}
            disabled={loading}
            onChange={handleInputChange}
            placeholder="Your Message"
            className="w-full md:w-1/2 px-6 py-3 rounded-lg text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 transition-all duration-300 ease-in-out"
            rows="4"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 font-semibold rounded-lg shadow-md transition duration-300 ease-in-out
             bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600
             focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;