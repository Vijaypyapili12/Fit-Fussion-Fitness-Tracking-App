import express from "express";
import activityRoutes from "./activityRoutes.js";
import goalRoutes from "./goalRoutes.js";
import authRoutes from "./authRoutes.js";
import { protect } from "../middleware/authMiddleware.js"; 
import { createMessage } from "../controllers/messageController.js"; // 🌟 Moved to the top imports block

const router = express.Router();

// 1. Map the contact post endpoint directly into the hub matrix
router.post("/messages", createMessage);

// 2. Publicly exposed registration pipelines
router.use("/auth", authRoutes);

// 3. Secured Resource Pipelines (Requires valid Bearer token from frontend)
router.use("/activities", protect, activityRoutes);
router.use("/goals", protect, goalRoutes);

export default router;