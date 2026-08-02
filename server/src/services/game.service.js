import { Game } from "../models/game.model.js";

export const createGameSession = async ({ userId, product }) => {
  if (!userId) {
    throw new Error("userId is required");
  }

  if (!product || typeof product !== "object") {
    throw new Error("Product is required");
  }

  if (!product.name || product.marketPrice === undefined) {
    throw new Error("Product name and marketPrice are required");
  }

  const game = await Game.create({
    user: userId,
    product,
    status: "ACTIVE",
    currentRound: 1,
    startedAt: new Date(),
  });

  return game;
};

export const getGameById = async (gameId) => {
  if (!gameId) {
    throw new Error("Game ID is required");
  }

  const game = await Game.findById(gameId);
  if (!game) {
    throw new Error("Game not found");
  }

  return game;
};

export const endGame = async ({ gameId, status, result, finalPrice }) => {
  if (!gameId) {
    throw new Error("Game ID is required");
  }

  const game = await Game.findById(gameId);
  if (!game) {
    throw new Error("Game not found");
  }

  if (game.status !== "ACTIVE") {
    throw new Error("Only ACTIVE games can be ended");
  }

  if (!["COMPLETED", "CANCELLED"].includes(status)) {
    throw new Error("Status must be COMPLETED or CANCELLED");
  }

  if (status === "COMPLETED") {
    if (!result || !["WIN", "LOSS", "WALK_AWAY"].includes(result)) {
      throw new Error("Result must be WIN, LOSS or WALK_AWAY");
    }
    if (finalPrice === undefined || finalPrice === null) {
      throw new Error("Final price is required when completing a game");
    }
  }

  game.status = status;
  game.endedAt = new Date();
  game.result = status === "COMPLETED" ? result : null;
  game.finalPrice = status === "COMPLETED" ? finalPrice : null;

  await game.save();

  return game;
};
