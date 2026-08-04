import { createSlice } from "@reduxjs/toolkit";
import { fetchLeaderboard } from "./leaderboardThunks";
import { logout } from "../../auth/redux/authThunks";

const initialState = {
  ranking: [],
  stats: null,
  bestDeals: [],
  status: "idle",
  error: null,
};

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState,
  reducers: {
    resetLeaderboard: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.ranking = action.payload.ranking;
        state.stats = action.payload.stats;
        state.bestDeals = action.payload.bestDeals;
        state.status = "succeeded";
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to load leaderboard";
      })
      .addCase(logout.fulfilled, () => initialState)
      .addCase(logout.rejected, () => initialState);
  },
});

export const { resetLeaderboard } = leaderboardSlice.actions;

export default leaderboardSlice.reducer;
