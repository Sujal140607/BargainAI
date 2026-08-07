import { configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../features/auth/redux/authSlice";
import dashboardReducer from "../features/dashboard/redux/dashboardSlice";
import gameReducer from "../features/game/redux/gameSlice";
import negotiationReducer from "../features/negotiation/redux/negotiationSlice";
import leaderboardReducer from "../features/leaderboard/redux/leaderboardSlice";
import { leaderboardApi } from "../features/leaderboard/api/leaderboardApi";
import { statisticsApi } from "../features/statistics/api/statisticsApi";
import { analyticsApi } from "../features/analytics/api/analyticsApi";
import profileReducer from "../features/profile/redux/profileSlice";

const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["user"],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    dashboard: dashboardReducer,
    game: gameReducer,
    negotiation: negotiationReducer,
    leaderboard: leaderboardReducer,
    profile: profileReducer,
    [leaderboardApi.reducerPath]: leaderboardApi.reducer,
    [statisticsApi.reducerPath]: statisticsApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(leaderboardApi.middleware)
      .concat(statisticsApi.middleware)
      .concat(analyticsApi.middleware),
});

export const persistor = persistStore(store);
