import { createSlice } from "@reduxjs/toolkit";
import { login, register, logout, bootstrapSession } from "./authThunks";

const initialState = {
  user: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    sessionExpired: (state) => {
      state.user = null;
      state.status = "unauthenticated";
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "authenticated";
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "unauthenticated";
        state.error = action.payload || "Something went wrong";
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "authenticated";
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "unauthenticated";
        state.error = action.payload || "Something went wrong";
      })
      .addCase(logout.pending, (state) => {
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = "unauthenticated";
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.status = "unauthenticated";
        state.error = null;
      })
      .addCase(bootstrapSession.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(bootstrapSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "authenticated";
        state.error = null;
      })
      .addCase(bootstrapSession.rejected, (state) => {
        state.user = null;
        state.status = "unauthenticated";
        state.error = null;
      });
  },
});

export const { sessionExpired, clearError } = authSlice.actions;

export default authSlice.reducer;
