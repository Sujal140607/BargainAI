import { getUserStats, getLeaderboard } from "../services/stats.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getCurrentUserStats = asyncHandler(async (req, res) => {
  const stats = await getUserStats(req.user.userId);
  res.status(200).json({ data: stats, message: "Stats fetched successfully" });
});

export const getLeaderboardController = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const leaderboard = await getLeaderboard(limit);
  res
    .status(200)
    .json({ data: leaderboard, message: "Leaderboard fetched successfully" });
});
