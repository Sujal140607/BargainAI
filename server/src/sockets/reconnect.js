import redisClient from "../config/redis.js";
import { joinGame } from "./rooms/index.js";
import { emitGameUpdate } from "./events/index.js";

const USER_GAME_KEY_PREFIX = "userGame:";
const USER_GAME_TTL_SECONDS = 300;

const userGameKey = (userId) => `${USER_GAME_KEY_PREFIX}${userId}`;

export const rememberActiveGame = async (socket) => {
  const { user, currentGameId } = socket.data;

  if (!user?.userId || !currentGameId) {
    return;
  }

  try {
    await redisClient.set(userGameKey(user.userId), currentGameId, {
      EX: USER_GAME_TTL_SECONDS,
    });
  } catch (error) {
    console.error("Failed to remember active game:", error.message);
  }
};

export const handleReconnect = async (io, socket) => {
  const { user } = socket.data;

  if (!user?.userId) {
    return;
  }

  try {
    const gameId = await redisClient.get(userGameKey(user.userId));

    if (!gameId) {
      return;
    }

    joinGame(socket, { gameId });
    await emitGameUpdate(io, gameId);
  } catch (error) {
    console.error("Reconnect failed:", error.message);
  }
};
