import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import challengeRoutes from "./routes/challengeRoutes.js"; 
import { createMessage } from "./controllers/messageController.js"; 

// 1. Load environment variables from your .env file
dotenv.config();

// 2. Connect to MongoDB Atlas
connectDB();

// 3. INITIALIZE EXPRESS APPLICATION ENGINE
const app = express();

// 4. ESSENTIAL BODY PARSERS & MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CLEAN PRODUCTION CORS CONFIGURATION
const allowedOrigins = [
  "http://localhost:5173", 
  "https://fit-fussion-fitness-tracking-app.vercel.app" // 🌟 Fixed: Removed the trailing slash "/"
];

// 🌟 Fixed: Combined into a single, comprehensive CORS middleware configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS Blocked: The origin ${origin} is not explicitly white-listed.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Secondary Production Shield Middlewares
app.use(morgan("dev"));
app.use(helmet({
  contentSecurityPolicy: false,
}));

// Rate Limiter Setup 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, 
});
app.use(limiter);

// ==========================================
// 5. OPERATIONAL ROUTING BINDERS
// ==========================================

// Operational Base Target Routing
app.get("/", (req, res) => {
  res.send("Server is running perfectly.");
});

// Community Challenge Global Endpoint Pipeline Route
app.use("/api/challenges", challengeRoutes); 

// Master API Hub Router Binding (for Users, Activities, Goals, etc.)
app.use("/api", routes);

// ==========================================
// 6. ERROR HANDLING & LIFECYCLE
// ==========================================

// Global Interception Error Catchment Handler
app.use((err, req, res, next) => {
  console.error("Global captured stack trace error:", err.message);
  res.status(500).json({ 
    success: false, 
    message: "An unexpected backend error occurred.",
    error: err.message 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Security-Aligned Server running on port ${PORT}`));