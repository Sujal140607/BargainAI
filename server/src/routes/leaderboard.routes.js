import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  getLeaderboard,
  getTopPlayersController,
  getMyRank,
  getMyStatistics,
  getMyAnalytics,
} from "../controllers/leaderboard.controller.js";

const leaderboardRouter = Router();

leaderboardRouter.get("/leaderboard", getLeaderboard);
leaderboardRouter.get("/leaderboard/top", getTopPlayersController);
leaderboardRouter.get("/leaderboard/me", authMiddleware, getMyRank);
leaderboardRouter.get("/users/me/statistics", authMiddleware, getMyStatistics);
leaderboardRouter.get("/users/me/analytics", authMiddleware, getMyAnalytics);

export default leaderboardRouter;
