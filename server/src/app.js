import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import gameRoutes from "./routes/game.routes.js";
import statsRoutes from "./routes/stats.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "Server is running" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/game", gameRoutes);
app.use("/api/v1/stats", statsRoutes);
app.use("/api/v1/leaderboard", leaderboardRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorMiddleware);

export default app;