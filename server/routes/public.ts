import express from "express";
import { getPublicProfile, donate } from "../controllers/publicController";
import { tokenChecker } from "../middleware/tokenChecker";

const GetRouter = express.Router();

GetRouter.get("/:username", getPublicProfile);
GetRouter.post("/:username/donate", tokenChecker, donate);

export default GetRouter;
