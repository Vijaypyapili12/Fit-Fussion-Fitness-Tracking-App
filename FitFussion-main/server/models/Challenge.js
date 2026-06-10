import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true, // This must match the frontend payload key exactly!
  },
  duration: {
    type: Number, 
    required: true,
  },
  difficulty: {
    type: String, 
    required: true,
  }
}, { timestamps: true });

const Challenge = mongoose.model("Challenge", challengeSchema);
export default Challenge;