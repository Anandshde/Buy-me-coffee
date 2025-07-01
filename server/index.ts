import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import dashboardRoutes from "./routes/dashboard";
import cors from "cors";
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/dashboard", dashboardRoutes);

// MongoDB Connection
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/buyme";
mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
