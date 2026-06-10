import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  type: {
    type: String,
    required: true,
  },
  target: {
    type: Number,
    required: true,
  },
  targetLeft: {
    type: Number,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  }
});

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;