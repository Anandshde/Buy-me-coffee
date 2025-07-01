import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
