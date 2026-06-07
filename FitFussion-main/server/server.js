import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// 1. MUST BE FIRST: Load environment variables from your .env file
dotenv.config();

// 2. MUST BE SECOND: Connect to MongoDB Atlas (Now it can safely read MONGO_URI)
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "https://fit-fussion-gamma.vercel.app", // allow only your frontend
  credentials: true
}));
app.use(morgan("dev"));
app.use(helmet());

// Rate Limiter Setup
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api", routes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);
  res
    .status(500)
    .json({ success: false, message: "An unexpected error occurred." });
});

const PORT = process.env.PORT || 5176;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));