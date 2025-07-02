import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export const createProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized: missing userId" });
      return;
    }

    const { name, about, socialMediaURL, successMessage } = req.body;

    const files = req.files as Record<string, Express.Multer.File[]>;

    const avatarImage = files["avatarImage"]?.[0]?.path;
    const backgroundImage = files["backgroundImage"]?.[0]?.path;

    if (!avatarImage || !backgroundImage) {
      res.status(400).json({ message: "Both images are required." });
      return;
    }

    const profile = await prisma.profile.create({
      data: {
        name,
        about,
        socialMediaURL,
        successMessage,
        avatarImage: `/uploads/${avatarImage}`,
        backgroundImage: `/uploads/${backgroundImage}`,
        userId,
      },
    });

    res.status(201).json({ message: "Profile created", profile });
  } catch (err) {
    console.error("❌ Error creating profile:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
