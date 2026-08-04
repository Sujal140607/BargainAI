import { createAsyncThunk } from "@reduxjs/toolkit";
import { leaderboardService, gameService } from "../../../services";

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const [stats, latestGames] = await Promise.all([
        leaderboardService.getStats(),
        gameService.getGameHistory(),
      ]);
      return { stats, latestGames };
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "Failed to load dashboard",
      });
    }
  }
);
