import { SERVER_EVENTS } from "./server.events.js";
import { gameRoomName } from "../rooms/index.js";

export const emitSellerTyping = (io, gameId) => {
  io.to(gameRoomName(gameId)).emit(SERVER_EVENTS.SELLER_TYPING, { gameId });
};

export const emitSellerStopTyping = (io, gameId) => {
  io.to(gameRoomName(gameId)).emit(SERVER_EVENTS.SELLER_STOP_TYPING, { gameId });
};
