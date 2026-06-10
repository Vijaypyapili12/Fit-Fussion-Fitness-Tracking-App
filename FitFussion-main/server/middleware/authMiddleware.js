import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  // Read the token from the standard Authorization Bearer header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract token out of the "Bearer <token>" string format
      token = req.headers.authorization.split(" ")[1];

      // Decode and verify the cryptographic signature using your environment secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user data profile from MongoDB and attach it to the request object (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      return next(); // Session valid, proceed to the target controller
    } catch (error) {
      console.error("Token Authentication Validation Failure:", error.message);
      return res.status(401).json({ success: false, message: "Not authorized, token validation failed." });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no session token provided." });
  }
};