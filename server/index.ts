import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth";
import CreateRouter from "./routes/profile";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Log every incoming request
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", CreateRouter);

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
