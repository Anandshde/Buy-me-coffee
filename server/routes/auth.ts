import express from "express";
import { signIn, signUp } from "../controllers/authController";
import { verifyToken } from "../utils/jwt";

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
import { Request, Response } from "express";

router.post("/verify", (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) {
    res.status(400).json({ error: "Token missing" });
    return;
  }

  try {
    const destructToken = verifyToken(token);
    res.status(200).json({ destructToken });
    return;
  } catch (err) {
    res.status(401).json({ error: "Invalid token", details: err });
    return;
  }
});

export default router;
