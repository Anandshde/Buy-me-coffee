import express from "express";
import { createProfile } from "../controllers/profileController";
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

export default CreateRouter;
