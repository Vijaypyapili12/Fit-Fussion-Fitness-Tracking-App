import express from "express";
import { createMessage } from "../controllers/messageController.js";

const router = express.Router();

// Public route: anyone visiting the site can submit a contact request
router.post("/", createMessage);

export default router;