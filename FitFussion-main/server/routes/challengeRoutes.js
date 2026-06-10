import express from "express";
import { 
  createChallenge, 
  getChallenges, 
  updateChallengeProgress, 
  deleteChallenge 
} from "../controllers/challengeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Safeguard security gatekeeper
router.use(protect);

router.post("/", createChallenge);
router.get("/", getChallenges);
router.put("/:id", updateChallengeProgress); // Double check this line
router.delete("/:id", deleteChallenge);

// Append this route right alongside your others in server/routes/challengeRoutes.js:
import { joinChallengeWithPayment } from "../controllers/challengeController.js";

router.post("/:id/join", joinChallengeWithPayment);

export default router;