import { createAsyncThunk } from "@reduxjs/toolkit";
import { leaderboardService, gameService } from "../../../services";

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const [stats, history] = await Promise.all([
        leaderboardService.getStats(),
        gameService.getGameHistory(100),
      ]);

      const games = history.map((game) => {
        const won =
          game.result === "WIN" &&
          game.finalPrice != null &&
          game.marketPrice != null;
        const savings = won
          ? Math.max(0, game.marketPrice - game.finalPrice)
          : 0;
        const savingsPct =
          won && game.marketPrice > 0
            ? Math.round((savings / game.marketPrice) * 100)
            : 0;
        return { ...game, savings, savingsPct };
      });

      return { stats, games };
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "Failed to load profile",
      });
    }
  }
);
