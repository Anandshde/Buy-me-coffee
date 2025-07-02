import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, receivedDonations: true },
    });

    if (!user || !user.profile) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const earnings = user.receivedDonations.reduce(
      (sum, d) => sum + d.amount,
      0
    );

    const transactions = user.receivedDonations
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10)
      .map((d) => ({
        id: d.id,
        name: `Supporter ${d.donorId}`,
        message: d.specialMessage,
        amount: d.amount,
        timeAgo: d.createdAt.toISOString(),
      }));

    res.status(200).json({
      username: user.username,
      avatar: user.profile.avatarImage,
      earnings,
      transactions,
    });
  } catch (err) {
    console.error("\u274c Error fetching dashboard:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
