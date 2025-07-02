import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

// GET public profile by username
export const getPublicProfile = async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        profile: true,
        receivedDonations: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!user || !user.profile) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({
      name: user.profile.name,
      avatar: user.profile.avatarImage,
      about: user.profile.about,
      socialLink: user.profile.socialMediaURL, // fixed field name
      supporters: user.receivedDonations.map((d) => ({
        amount: d.amount,
        message: d.specialMessage,
        date: d.createdAt,
      })),
    });
    return;
  } catch (err) {
    console.error("❌ Error fetching public profile:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// POST a donation to a creator
export const donate = async (req: Request, res: Response) => {
  const { username } = req.params;
  const { amount, message, socialURL } = req.body; // ✅ include socialURL from body
  const donorId = req.user?.userId;

  try {
    const creator = await prisma.user.findUnique({ where: { username } });

    if (!creator || !donorId) {
      res.status(400).json({ message: "Invalid donation" });
      return;
    }

    const donation = await prisma.donation.create({
      data: {
        amount,
        specialMessage: message,
        socialURLOrBuyMeACoffee: socialURL,
        donorId,
        recipientId: creator.id,
      },
    });

    res.status(201).json({ message: "Donation successful", donation });
  } catch (err) {
    console.error("❌ Error processing donation:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
