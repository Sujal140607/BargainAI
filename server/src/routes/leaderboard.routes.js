import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getLeaderboardController } from "../controllers/stats.controller.js";

const leaderboardRouter = Router();

leaderboardRouter.get("/", authMiddleware, getLeaderboardController);

export default leaderboardRouter;
