import express from "express";
import { createProfile, getProfile } from "../controllers/profileController";
import { tokenChecker } from "../middleware/tokenChecker";
import { upload } from "../middleware/upload";

const CreateRouter = express.Router();

CreateRouter.post(
  "/create",
  tokenChecker,
  upload.fields([
    { name: "avatarImage", maxCount: 1 },
    { name: "backgroundImage", maxCount: 1 },
  ]),
  createProfile
);

CreateRouter.get("/me", tokenChecker, getProfile);

export default CreateRouter;
