import { socketAuthMiddleware } from "./middleware/index.js";
import { CLIENT_EVENTS } from "./events/index.js";
import { handleReconnect, rememberActiveGame } from "./reconnect.js";
import {
  handleOfferSend,
  handleSellerUpdate,
  handleSellerTyping,
  handleSellerStopTyping,
  handleGameUpdate,
  handleDisconnect,
} from "./handlers/index.js";

export const registerSocketManager = (io) => {
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    handleReconnect(io, socket);

    socket.on(CLIENT_EVENTS.OFFER_SEND, (...args) => handleOfferSend(io, socket, ...args));
    socket.on(CLIENT_EVENTS.SELLER_UPDATE, (...args) => handleSellerUpdate(io, socket, ...args));
    socket.on(CLIENT_EVENTS.SELLER_TYPING, (...args) => handleSellerTyping(io, socket, ...args));
    socket.on(CLIENT_EVENTS.SELLER_STOP_TYPING, (...args) =>
      handleSellerStopTyping(io, socket, ...args)
    );
    socket.on(CLIENT_EVENTS.GAME_UPDATE, (...args) => handleGameUpdate(io, socket, ...args));
    socket.on("disconnect", (reason) => {
      rememberActiveGame(socket);
      handleDisconnect(io, socket, reason);
    });
  });

  return io;
};
