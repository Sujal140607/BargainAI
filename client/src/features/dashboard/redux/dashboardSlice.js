import { createSlice } from "@reduxjs/toolkit";
import { fetchDashboard } from "./dashboardThunks";
import { logout } from "../../auth/redux/authThunks";

const initialState = {
  stats: null,
  latestGames: [],
  status: "idle",
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    resetDashboard: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.stats = action.payload.stats;
        state.latestGames = action.payload.latestGames;
        state.status = "succeeded";
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to load dashboard";
      })
      .addCase(logout.fulfilled, () => initialState)
      .addCase(logout.rejected, () => initialState);
  },
});

export const { resetDashboard } = dashboardSlice.actions;

export default dashboardSlice.reducer;
