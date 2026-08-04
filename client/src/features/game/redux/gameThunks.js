import { createAsyncThunk } from "@reduxjs/toolkit";
import { gameService } from "../../../services";

export const createGame = createAsyncThunk(
  "game/createGame",
  async (product, { rejectWithValue }) => {
    try {
      return await gameService.startGame(product);
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "Failed to start the game. Please try again.",
      });
    }
  }
);

export const fetchGame = createAsyncThunk(
  "game/fetchGame",
  async (gameId, { rejectWithValue }) => {
    try {
      return await gameService.getGame(gameId);
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "Failed to load the game.",
      });
    }
  }
);
