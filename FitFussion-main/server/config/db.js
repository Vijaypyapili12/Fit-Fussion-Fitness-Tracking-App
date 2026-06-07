// server/config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  // Clear error logging to prevent Mongoose from crashing blindly if the string is empty
  if (!process.env.MONGO_URI) {
    console.error("❌ DB ERROR: process.env.MONGO_URI is undefined.");
    console.error("👉 Please verify that your .env file exists inside the server directory and contains the MONGO_URI variable.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📡 MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;