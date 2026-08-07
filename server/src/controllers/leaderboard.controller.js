import asyncHandler from "../utils/asyncHandler.js";
import {
  getGlobalLeaderboard,
  getTopPlayers,
  getUserLeaderboardEntry,
} from "../services/leaderboard.service.js";
import { getUserStatistics } from "../services/stats.service.js";
import { getUserAnalytics } from "../services/analytics.service.js";

export const getLeaderboard = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  const players = await getGlobalLeaderboard({ limit, page });

  res
    .status(200)
    .json({ data: players, message: "Leaderboard fetched successfully" });
});

export const getTopPlayersController = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 3;

  const players = await getTopPlayers(limit);

  res
    .status(200)
    .json({ data: players, message: "Top players fetched successfully" });
});

export const getMyRank = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const entry = await getUserLeaderboardEntry(userId);

  res.status(200).json({
    data: entry ?? { rank: 0, userId, wins: 0, gamesPlayed: 0, winRate: 0 },
    message: "My rank fetched successfully",
  });
});

export const getMyStatistics = asyncHandler(async (req, res) => {
  const stats = await getUserStatistics(req.user.userId);

  res
    .status(200)
    .json({ data: stats, message: "Statistics fetched successfully" });
});

export const getMyAnalytics = asyncHandler(async (req, res) => {
  const days = Number(req.query.days) || 14;

  const analytics = await getUserAnalytics(req.user.userId, { days });

  res
    .status(200)
    .json({ data: analytics, message: "Analytics fetched successfully" });
});
