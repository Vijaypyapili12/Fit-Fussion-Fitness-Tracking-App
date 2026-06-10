import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash password before saving to the database collection
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare incoming password for login verification
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// THE CRUCIAL FIX: Changed from module.exports to named default ES Module export
const User = mongoose.model("User", userSchema);
export default User;