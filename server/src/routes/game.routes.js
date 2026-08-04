import { Router } from "express";
import {
  createGame,
  getGame,
  endGameController,
  getGameHistoryController,
} from "../controllers/game.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const gamerouter = Router();

gamerouter.post("/games", authMiddleware, createGame);
gamerouter.get("/games/:id", authMiddleware, getGame);
gamerouter.patch("/games/:id/end", authMiddleware, endGameController);
gamerouter.get("/history", authMiddleware, getGameHistoryController);

export default gamerouter;
