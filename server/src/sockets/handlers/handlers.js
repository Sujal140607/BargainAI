import { leaveGame } from "../rooms/index.js";

export const handleSellerUpdate = (io, socket) => {};

export const handleSellerTyping = (io, socket) => {};

export const handleSellerStopTyping = (io, socket) => {};

export const handleGameUpdate = (io, socket) => {};

export const handleDisconnect = (io, socket, reason) => {
  const { user, currentGameId } = socket.data;

  console.log(
    `Socket Disconnected: ${socket.id} (user: ${user?.userId ?? "unknown"}, reason: ${reason})`
  );

  if (currentGameId) {
    leaveGame(socket, { gameId: currentGameId });
  }
};
