// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import Home from "./pages/Home";
import Dashboard from "./components/Dashboard";
import Activities from "./pages/Activities";
import Goals from "./pages/Goals";
import LogWorkout from "./pages/LogWorkout";
import Challenge from "./pages/Challenge";
import DarkModeToggle from "./components/DarkModeToggle";
import { Helmet } from "react-helmet";  
import { ToastContainer } from "react-toastify";  
import "react-toastify/dist/ReactToastify.css";  

const App = () => {
  const [email, setEmail] = useState("");

   
  const handleSubscribe = (event) => {
    event.preventDefault();
    
    console.log("Subscribed with email:", email);
    alert("Thank you for subscribing!");
    setEmail("");  
  };

  return (
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
              <Link
                to="/"
                className="hover:text-yellow-300 transition duration-200"
              >
                FitFusion
              </Link>
            </h1>
            <nav className="flex items-center space-x-6">
              <ul className="flex space-x-6 text-lg font-medium">
                <li>
                  <Link
                    to="/"
                    className="hover:text-yellow-300 transition duration-200"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    className="hover:text-yellow-300 transition duration-200"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/activities"
                    className="hover:text-yellow-300 transition duration-200"
                  >
                    Activities
                  </Link>
                </li>
                <li>
                  <Link
                    to="/goals"
                    className="hover:text-yellow-300 transition duration-200"
                  >
                    Goals
                  </Link>
                </li>
                <li>
                  <Link
                    to="/log-workout"
                    className="hover:text-yellow-300 transition duration-200"
                  >
                    Log Workout
                  </Link>
                </li>
              </ul>
              {/* Dark Mode Toggle */}
              <DarkModeToggle />
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Helmet>
                    <title>Home | FitFusion</title>
                    <meta
                      name="description"
                      content="Track your fitness journey with FitFusion"
                    />
                  </Helmet>
                  <Home />
                </>
              }
            />
            <Route
              path="/dashboard"
              element={
                <>
                  <Helmet>
                    <title>Dashboard | FitFusion</title>
                    <meta
                      name="description"
                      content="View your fitness dashboard"
                    />
                  </Helmet>
                  <Dashboard />
                </>
              }
            />
            <Route
              path="/activities"
              element={
                <>
                  <Helmet>
                    <title>Activities | FitFusion</title>
                    <meta
                      name="description"
                      content="Track and monitor your daily activities"
                    />
                  </Helmet>
                  <Activities />
                </>
              }
            />
            <Route
              path="/goals"
              element={
                <>
                  <Helmet>
                    <title>Goals | FitFusion</title>
                    <meta
                      name="description"
                      content="Set and achieve your fitness goals"
                    />
                  </Helmet>
                  <Goals />
                </>
              }
            />
            <Route
              path="/log-workout"
              element={
                <>
                  <Helmet>
                    <title>Log Workout | FitFusion</title>
                    <meta name="description" content="Log your daily workout" />
                  </Helmet>
                  <LogWorkout />
                </>
              }
            />
            <Route
              path="/challenge"
              element={
                <>
                  <Helmet>
                    <title>Challenge | FitFusion</title>
                    <meta
                      name="description"
                      content="Join fitness challenges and push your limits"
                    />
                  </Helmet>
                  <Challenge />
                </>
              }
            />
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
                  <li>
                    <Link
                      to="/"
                      className="hover:text-blue-400 transition-colors duration-300"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="hover:text-blue-400 transition-colors duration-300"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/services"
                      className="hover:text-blue-400 transition-colors duration-300"
                    >
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="hover:text-blue-400 transition-colors duration-300"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/faq"
                      className="hover:text-blue-400 transition-colors duration-300"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact Information Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                <p className="text-gray-400 mb-2">SRM University AP</p>
                <p className="text-gray-400 mb-2">
                  Email:{" "}
                  <a
                    href="mailto:contact@fitfusion.com"
                    className="hover:text-blue-400 transition-colors duration-300"
                  >
                    pyapilivijaykumar2244@gmail.com
                  </a>
                </p>
                <p className="text-gray-400">
                  Phone:{" "}
                  <a
                    href="tel:+1234567890"
                    className="hover:text-blue-400 transition-colors duration-300"
                  >
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
                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email"
                    className="w-full md:w-auto px-4 py-2 rounded-lg text-gray-800 bg-gray-200 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 border-2 border-gray-400 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            {/* Centered Social Media and Credits */}
            <div className="mt-10 text-center">
              <div className="flex justify-center space-x-8 mb-6">
                
                <a
                  href="https://x.com/singh_harsh3110"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-400 transition duration-300 transform hover:scale-110"
                >
                  <FaTwitter className="text-3xl" />
                </a>
                <a
                  href="https://www.instagram.com/gaharwar_harsh31/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-400 transition duration-300 transform hover:scale-110"
                >
                  <FaInstagram className="text-3xl" />
                </a>
                <a
                  href="https://www.linkedin.com/in/harsh-singh-73758325a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-400 transition duration-300 transform hover:scale-110"
                >
                  <FaLinkedin className="text-3xl" />
                </a>
              </div>
              <p className="text-sm text-gray-400 font-medium">
              </p>
              <p className="text-sm text-gray-400 mt-2">
                &copy; {new Date().getFullYear()} FitFusion. All Rights
                Reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
