import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import dashboardRoutes from "./routes/dashboard";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/dashboard", dashboardRoutes);

// Test route
app.get("/", (req: Request, res: Response) => {
  res.send("🚀 Buy Me Coffee server is running!");
});

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
