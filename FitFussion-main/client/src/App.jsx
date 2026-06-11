import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import axios from "axios"; // 🌟 Added Axios import for API communication
import Home from "./pages/Home";
import Dashboard from "./components/Dashboard"; 
import Activities from "./pages/Activities";
import Goals from "./pages/Goals";
import LogWorkout from "./pages/LogWorkout";
import Challenge from "./pages/Challenge";
import Login from "./pages/Login";   
import Signup from "./pages/Signup"; 
import ProtectedRoute from "./components/ProtectedRoute"; 
import DarkModeToggle from "./components/DarkModeToggle";
import { HelmetProvider, Helmet } from "react-helmet-async"; 
import { ToastContainer } from "react-toastify";  
import "react-toastify/dist/ReactToastify.css";  
import ContactForm from "./pages/ContactForm"; 

const App = () => {
  const [email, setEmail] = useState("");
  
  // Dynamic Authentication Evaluator
  const isAuthenticated = !!localStorage.getItem("userInfo");

  // 🌟 Updated: Asynchronous Newsletter Storage Pipeline
  const handleSubscribe = async (event) => {
    event.preventDefault();

    try {
      // Pipes the input value straight to your newly declared Render route
      const response = await axios.post(
        "https://fit-fussion-fitness-tracking-app.onrender.com/api/subscribe", 
        { email },
        { withCredentials: true }
      );

      if (response.data.success) {
        alert("Thank you for subscribing!");
        setEmail(""); // Clears the layout form input
      }
    } catch (error) {
      console.error("Subscription pipeline error:", error);
      // Grabs the error message from the backend if email is already registered
      const errorMsg = error.response?.data?.message || "Subscription encounter faulted. Please try again.";
      alert(errorMsg);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    window.location.href = "/login"; 
  };

  return (
    <HelmetProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
          
          {/* ToastContainer for Notifications */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover={false}
            draggable={false}
          />

          {/* Header */}
          <header className="bg-gradient-to-r from-blue-600 to-blue-400 dark:from-gray-700 dark:to-gray-900 text-white shadow-lg py-4">
            <div className="container mx-auto flex justify-between items-center px-6">
              <h1 className="text-2xl font-extrabold tracking-wide">
                <Link to="/" className="hover:text-yellow-300 transition duration-200">
                  FitFussion
                </Link>
              </h1>
              <nav className="flex items-center space-x-6">
                <ul className="flex space-x-6 text-lg font-medium items-center">
                  <li>
                    <Link to="/" className="hover:text-yellow-300 transition duration-200">
                      Home
                    </Link>
                  </li>
                  
                  {/* Dynamic Visibility Layout Switchboard */}
                  {isAuthenticated ? (
                    <>
                      <li>
                        <Link to="/dashboard" className="hover:text-yellow-300 transition duration-200">
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link to="/activities" className="hover:text-yellow-300 transition duration-200">
                          Activities
                        </Link>
                      </li>
                      <li>
                        <Link to="/goals" className="hover:text-yellow-300 transition duration-200">
                          Goals
                        </Link>
                      </li>
                      <li>
                        <Link to="/log-workout" className="hover:text-yellow-300 transition duration-200">
                          Log Workout
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-xl font-bold shadow-md transition duration-200"
                        >
                          Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link to="/login" className="hover:text-yellow-300 transition duration-200">
                          Sign In
                        </Link>
                      </li>
                      <li>
                        <Link to="/signup" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm px-4 py-2 rounded-xl transition shadow font-bold">
                          Join Us
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
                {/* Dark Mode Toggle */}
                <DarkModeToggle />
              </nav>
            </div>
          </header>

          {/* Main Content Space Routing Switchboard */}
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              {/* PUBLIC ENTRY ENDPOINTS */}
              <Route path="/" element={
                <>
                  <Helmet>
                    <title>Home | FitFusion</title>
                    <meta name="description" content="Track your fitness journey with FitFusion" />
                  </Helmet>
                  <Home />
                </>
              } />
              <Route path="/login" element={
                <>
                  <Helmet>
                    <title>Sign In | FitFusion</title>
                  </Helmet>
                  <Login />
                </>
              } />
              <Route path="/signup" element={
                <>
                  <Helmet>
                    <title>Create Account | FitFusion</title>
                  </Helmet>
                  <Signup />
                </>
              } />

              {/* SECURED CORE PLATFORM CHANNELS */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Helmet>
                    <title>Dashboard | FitFusion</title>
                    <meta name="description" content="View your fitness dashboard" />
                  </Helmet>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/activities" element={
                <ProtectedRoute>
                  <Helmet>
                    <title>Activities | FitFusion</title>
                    <meta name="description" content="Track and monitor your daily activities" />
                  </Helmet>
                  <Activities />
                </ProtectedRoute>
              } />
              <Route path="/goals" element={
                <ProtectedRoute>
                  <Helmet>
                    <title>Goals | FitFusion</title>
                    <meta name="description" content="Set and achieve your fitness goals" />
                  </Helmet>
                  <Goals />
                </ProtectedRoute>
              } />
              <Route path="/log-workout" element={
                <ProtectedRoute>
                  <Helmet>
                    <title>Log Workout | FitFusion</title>
                    <meta name="description" content="Log your daily workout" />
                  </Helmet>
                  <LogWorkout />
                </ProtectedRoute>
              } />
              <Route path="/challenge" element={
                <ProtectedRoute>
                  <Helmet>
                    <title>Challenge | FitFusion</title>
                    <meta name="description" content="Join fitness challenges and push your limits" />
                  </Helmet>
                  <Challenge />
                </ProtectedRoute>
              } />

              {/* AUTOMATIC CATCH-ALL REDIRECTION COUPLING */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-gradient-to-r from-gray-900 to-gray-900 text-white py-10 transition-all duration-300 ease-in-out border-t border-gray-700 shadow-md">
            <div className="container mx-auto px-6 text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Quick Links Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li><Link to="/" className="hover:text-blue-400 transition-colors duration-300">Home</Link></li>
                    <li><Link to="/about" className="hover:text-blue-400 transition-colors duration-300">About Us</Link></li>
                    <li><Link to="/services" className="hover:text-blue-400 transition-colors duration-300">Services</Link></li>
                    <li><Link to="/contact" className="hover:text-blue-400 transition-colors duration-300">Contact Us</Link></li>
                    <li><Link to="/faq" className="hover:text-blue-400 transition-colors duration-300">FAQ</Link></li>
                  </ul>
                </div>

                {/* Contact Information Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                  <p className="text-gray-400 mb-2">SRM University AP</p>
                  <p className="text-gray-400 mb-2">
                    Email:{" "}
                    <a href="mailto:pyapilivijaykumar2244@gmail.com" className="hover:text-blue-400 transition-colors duration-300">
                      pyapilivijaykumar2244@gmail.com
                    </a>
                  </p>
                  <p className="text-gray-400">
                    Phone:{" "}
                    <a href="tel:6300810621" className="hover:text-blue-400 transition-colors duration-300">
                      6300810621
                    </a>
                  </p>
                </div>

                {/* Newsletter Subscription Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
                  <p className="text-gray-400 mb-4">
                    Subscribe to our newsletter for the latest updates and offers.
                  </p>
                  <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your Email"
                      className="w-full md:w-auto px-4 py-2 rounded-lg text-gray-800 bg-gray-200 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 border-2 border-gray-400 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
                      required
                    />
                    <button type="submit" className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out">
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>

              {/* Centered Social Media and Credits */}
              <div className="mt-10 text-center">
                <div className="flex justify-center space-x-8 mb-6">
                  <a href="" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition duration-300 transform hover:scale-110">
                    <FaTwitter className="text-3xl" />
                  </a>
                  <a href="https://www.instagram.com/vijay_pyapili/?hl=en" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition duration-300 transform hover:scale-110">
                    <FaInstagram className="text-3xl" />
                  </a>
                  <a href="https://www.linkedin.com/in/vijay-kumar-pyapili-0aa53729b/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition duration-300 transform hover:scale-110">
                    <FaLinkedin className="text-3xl" />
                  </a>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  &copy; {new Date().getFullYear()} FitFusion. All Rights Reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;