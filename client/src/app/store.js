import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/services/authApi";
import authReducer from "../features/auth/redux/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});
