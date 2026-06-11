import express from "express";
import activityRoutes from "./activityRoutes.js";
import goalRoutes from "./goalRoutes.js";
import authRoutes from "./authRoutes.js";
import { protect } from "../middleware/authMiddleware.js"; 
import { createMessage } from "../controllers/messageController.js"; 
import Subscriber from "../models/Subscriber.js"; // 🌟 Imported the new subscriber collection model

const router = express.Router();

// 1. Map the contact post endpoint directly into the hub matrix
router.post("/messages", createMessage);

// 2. 🌟 NEW: Newsletter Subscription Pipeline Route
router.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required." });
  }

  try {
    // Prevent duplicate entries in your cluster
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ success: false, message: "This email is already subscribed!" });
    }

    // Initialize and save profile data block
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    res.status(201).json({ success: true, message: "Successfully subscribed to the newsletter!" });
  } catch (error) {
    console.error("Newsletter error:", error.message);
    res.status(500).json({ success: false, message: "Backend error saving subscriber parameters." });
  }
});

// 3. Publicly exposed registration pipelines
router.use("/auth", authRoutes);

// 4. Secured Resource Pipelines (Requires valid Bearer token from frontend)
router.use("/activities", protect, activityRoutes);
router.use("/goals", protect, goalRoutes);

export default router;