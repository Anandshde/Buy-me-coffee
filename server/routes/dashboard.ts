import express from "express";
import { getDashboard } from "../controllers/dashboardController";
import { tokenChecker } from "../middleware/tokenChecker";

const dashboardRouter = express.Router();

dashboardRouter.get("/", tokenChecker, getDashboard);

export default dashboardRouter;
