import express, { Request, Response } from "express";

const router = express.Router();

// GET /api/dashboard
router.get("/", (req: Request, res: Response) => {
  // Mock dashboard data
  const data = {
    username: "JohnDoe",
    avatar: "https://placehold.co/48x48",
    earnings: 125.5,
    transactions: [
      {
        id: "1",
        name: "Alice",
        message: "Great job!",
        amount: 5,
        timeAgo: "2 days ago",
      },
      {
        id: "2",
        name: "Bob",
        message: "Keep it up!",
        amount: 3,
        timeAgo: "5 days ago",
      },
    ],
  };

  res.json(data);
});

export default router;
