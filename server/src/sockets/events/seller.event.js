import { SERVER_EVENTS } from "./server.events.js";
import { gameRoomName } from "../rooms/index.js";

export const emitSellerUpdate = (io, gameId, payload) => {
  io.to(gameRoomName(gameId)).emit(SERVER_EVENTS.SELLER_UPDATE, {
    reply: payload.reply,
    counterOffer: payload.counterOffer,
    emotion: payload.emotion,
    trustScore: payload.trustScore,
    patience: payload.patience,
    currentRound: payload.currentRound,
    gameOver: payload.gameOver,
  });
};
