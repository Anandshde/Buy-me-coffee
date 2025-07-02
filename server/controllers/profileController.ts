import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary (or import from a config file)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const createProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized: missing userId" });
      return;
    }

    const { name, about, socialMediaURL, successMessage } = req.body;
    const files = req.files as Record<string, Express.Multer.File[]>;

    const avatarFile = files["avatarImage"]?.[0];
    const backgroundFile = files["backgroundImage"]?.[0];

    if (!avatarFile) {
      res.status(400).json({ message: "Profile image is required." });
      return;
    }

    // Upload to Cloudinary
    const uploadImage = async (file: Express.Multer.File) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "food-delivery",
      });
      return result.secure_url;
    };

    const avatarImage = await uploadImage(avatarFile);
    const backgroundImage = backgroundFile
      ? await uploadImage(backgroundFile)
      : "";

    const profile = await prisma.profile.create({
      data: {
        name,
        about,
        socialMediaURL,
        successMessage,
        avatarImage,
        backgroundImage,
        userId,
      },
    });

    res.status(201).json({ message: "Profile created", profile });
  } catch (err) {
    console.error("❌ Error creating profile:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const profile = await prisma.profile.findUnique({ where: { userId } });

    if (!profile) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    res.status(200).json({ profile });
  } catch (err) {
    console.error("❌ Error fetching profile:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
