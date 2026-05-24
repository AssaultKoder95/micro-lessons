import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import lessonRoutes from "./routes/lessons.js";
import ttsRoutes from "./routes/tts.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// Routes
app.use("/api/lessons", lessonRoutes);
app.use("/api/tts", ttsRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Micro-Lessons API is running" });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/micro-lessons")
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
