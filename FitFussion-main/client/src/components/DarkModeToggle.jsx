// src/components/DarkModeToggle.jsx
import { useState, useEffect } from "react";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 bg-blue-500 dark:bg-gray-800 rounded-full"
    >
      {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
};

export default DarkModeToggle;
