import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../../services";

const toPayload = (error) => ({
  message: error?.message || "Something went wrong. Please try again.",
  errors: error?.errors || [],
});

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      return data.user;
    } catch (error) {
      return rejectWithValue(toPayload(error));
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.register(credentials);
      return data.user;
    } catch (error) {
      return rejectWithValue(toPayload(error));
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

export const bootstrapSession = createAsyncThunk(
  "auth/bootstrapSession",
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getCurrentUser();
    } catch (error) {
      return rejectWithValue(toPayload(error));
    }
  }
);
