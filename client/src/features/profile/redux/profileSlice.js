import { createSlice } from "@reduxjs/toolkit";
import { fetchProfile } from "./profileThunks";
import { logout } from "../../auth/redux/authThunks";

const initialState = {
  stats: null,
  games: [],
  status: "idle",
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfile: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.stats = action.payload.stats;
        state.games = action.payload.games;
        state.status = "succeeded";
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to load profile";
      })
      .addCase(logout.fulfilled, () => initialState)
      .addCase(logout.rejected, () => initialState);
  },
});

export const { resetProfile } = profileSlice.actions;

export default profileSlice.reducer;
