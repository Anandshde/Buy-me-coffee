import express from "express";
import { getDashboard } from "../controllers/dashboardController";
import { tokenChecker } from "../middleware/tokenChecker";

const router = express.Router();

router.get("/", tokenChecker, getDashboard);

export default router;
