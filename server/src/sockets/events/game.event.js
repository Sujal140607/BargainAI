import redisClient from "../../config/redis.js";
import { SERVER_EVENTS } from "./server.events.js";
import { gameRoomName } from "../rooms/index.js";

const GAME_KEY_PREFIX = "game:";
const STATUS_KEY_PREFIX = "gameStatus:";
const gameKey = (gameId) => `${GAME_KEY_PREFIX}${gameId}`;
const statusKey = (gameId) => `${STATUS_KEY_PREFIX}${gameId}`;

export const emitGameUpdate = async (io, gameId) => {
  const [rawState, rawStatus] = await Promise.all([
    redisClient.get(gameKey(gameId)),
    redisClient.get(statusKey(gameId)),
  ]);

  if (!rawState) {
    return;
  }

  const state = JSON.parse(rawState);

  io.to(gameRoomName(gameId)).emit(SERVER_EVENTS.GAME_UPDATE, {
    currentPrice: state.currentPrice,
    trustScore: state.trustScore,
    patience: state.patience,
    round: state.roundsPlayed,
    emotion: state.emotion,
    status: rawStatus,
  });
};
