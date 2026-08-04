import { createAsyncThunk } from "@reduxjs/toolkit";
import { leaderboardService, gameService } from "../../../services";

export const fetchLeaderboard = createAsyncThunk(
  "leaderboard/fetchLeaderboard",
  async (_, { rejectWithValue }) => {
    try {
      const [ranking, stats, history] = await Promise.all([
        leaderboardService.getLeaderboard({ limit: 100 }),
        leaderboardService.getStats(),
        gameService.getGameHistory(100),
      ]);

      const bestDeals = history
        .filter(
          (game) =>
            game.result === "WIN" &&
            game.finalPrice != null &&
            game.marketPrice != null
        )
        .map((game) => ({
          ...game,
          savings: Math.max(0, game.marketPrice - game.finalPrice),
        }))
        .sort((a, b) => b.savings - a.savings)
        .slice(0, 3);

      return { ranking, stats, bestDeals };
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "Failed to load leaderboard",
      });
    }
  }
);
