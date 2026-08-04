import { createSlice } from "@reduxjs/toolkit";
import { createGame, fetchGame } from "./gameThunks";
import { logout } from "../../auth/redux/authThunks";

const initialState = {
  currentGame: null,
  status: "idle",
  error: null,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    resetGame: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGame.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createGame.fulfilled, (state, action) => {
        state.currentGame = action.payload;
        state.status = "succeeded";
      })
      .addCase(createGame.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to start the game";
      })
      .addCase(fetchGame.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchGame.fulfilled, (state, action) => {
        state.currentGame = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchGame.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to load the game";
      })
      .addCase(logout.fulfilled, () => initialState)
      .addCase(logout.rejected, () => initialState);
  },
});

export const { resetGame } = gameSlice.actions;

export default gameSlice.reducer;
