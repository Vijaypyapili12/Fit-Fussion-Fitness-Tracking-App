import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(false);

    if (!formData.email || !formData.password) {
      return setError("Please fill in all security fields.");
    }

    try {
      setLoading(true);
      const data = await login(formData);
      
      if (data.success || data.token) {
        localStorage.setItem("userInfo", JSON.stringify(data));
        navigate("/dashboard");
        window.location.reload(); 
      } else {
        setError(data.message || "Invalid email or password combination.");
      }
    } catch (err) {
      console.error("Login Client Intercept Error:", err);
      setError(err.response?.data?.message || "Invalid email or password combination.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center px-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-gray-700">
        <h2 className="text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-400 text-center mb-6">Log into your FitFusion workspace panel</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-500 rounded-lg text-sm font-medium border border-red-100 dark:border-red-800">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="none" // <-- THE FIX: Hard blocks modern browser email auto-fill overlays
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="" // <-- Completely Left Blank
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Account Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password" // <-- THE FIX: Stops browser from entering cached passwords automatically
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="" // <-- Completely Left Blank
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? "Authenticating Identity..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-500 dark:text-gray-400">
          New to the platform?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline font-semibold">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;