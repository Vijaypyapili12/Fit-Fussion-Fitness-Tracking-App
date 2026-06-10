import React, { useState } from "react";
import { sendContactMessage } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      return toast.warn("Please completely fill in all inputs before sending.");
    }

    try {
      setLoading(true);
      
      // Hits your updated express service hub route securely
      await sendContactMessage({ name, email, message });

      toast.success("Message transmitted successfully! We'll stay in touch.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error("Contact submit error details:", err);
      toast.error("Failed to transmit contact information. Error sending message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm mt-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Connect With Us</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
          Share your details, and we'll keep you updated with the latest news.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          disabled={loading}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
        />

        <input
          type="email"
          value={email}
          disabled={loading}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email"
          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
        />

        <textarea
          rows="4"
          value={message}
          disabled={loading}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your Message"
          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm transition resize-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 text-sm"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;