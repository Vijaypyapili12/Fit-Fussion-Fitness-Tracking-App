import mongoose from "mongoose";

const userChallengeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Challenge",
    required: true,
  },
  daysCompleted: {
    type: Number,
    default: 0,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  stakedAmount: {
    type: Number,
    default: 0, // Stores the simulated entry fee paid by the user
  }
}, { timestamps: true });

const UserChallenge = mongoose.model("UserChallenge", userChallengeSchema);
export default UserChallenge;