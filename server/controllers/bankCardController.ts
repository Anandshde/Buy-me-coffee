import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export const addBankCard = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId; // fix type if middleware doesn't extend Request

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const {
      country,
      firstName,
      lastName,
      cardNumber,
      expiryDate, // should be ISO string
    }: {
      country: string;
      firstName: string;
      lastName: string;
      cardNumber: string;
      expiryDate: string;
    } = req.body;

    const existingCard = await prisma.bankCard.findUnique({ where: { userId } });

    const bankCard = await prisma.bankCard.upsert({
      where: { userId },
      create: {
        country,
        firstName,
        lastName,
        cardNumber,
        expiryDate: new Date(expiryDate),
        userId,
      },
      update: {
        country,
        firstName,
        lastName,
        cardNumber,
        expiryDate: new Date(expiryDate),
      },
    });

    res.status(existingCard ? 200 : 201).json({
      message: existingCard ? "Bank card updated" : "Bank card added",
      bankCard,
    });
  } catch (err) {
    console.error("❌ Error saving card:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const getBankCard = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const bankCard = await prisma.bankCard.findUnique({
      where: { userId },
    });

    if (!bankCard) {
      res.status(404).json({ message: "No bank card found" });
      return;
    }

    res.status(200).json({ bankCard });
  } catch (err) {
    console.error("❌ Error fetching bank card:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
