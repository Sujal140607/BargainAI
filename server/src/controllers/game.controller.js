import {
  createGameSession,
  getGameById,
  endGame,
} from "../services/game.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createGame = asyncHandler(async (req, res) => {
  const game = await createGameSession({
    userId: req.user.userId,
    product: req.body.product,
  });

  res.status(201).json({ data: game, message: "Game created successfully" });
});

export const getGame = asyncHandler(async (req, res) => {
  const game = await getGameById(req.params.id);

  res.status(200).json({ data: game, message: "Game fetched successfully" });
});

export const endGameController = asyncHandler(async (req, res) => {
  const game = await endGame({
    gameId: req.params.id,
    status: req.body.status,
    result: req.body.result,
    finalPrice: req.body.finalPrice,
  });

  res.status(200).json({ data: game, message: "Game ended successfully" });
});
