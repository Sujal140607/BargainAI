const GAME_ROOM_PREFIX = "game:";

export const gameRoomName = (gameId) => `${GAME_ROOM_PREFIX}${gameId}`;

export const joinGame = (socket, { gameId }) => {
  if (!socket.data?.user) {
    throw new Error("Unauthorized: Socket is not authenticated");
  }

  const previousGameId = socket.data.currentGameId;

  if (previousGameId && previousGameId !== gameId) {
    leaveGame(socket, { gameId: previousGameId });
  }

  socket.join(gameRoomName(gameId));
  socket.data.currentGameId = gameId;
};

export const leaveGame = (socket, { gameId }) => {
  socket.leave(gameRoomName(gameId));

  if (socket.data.currentGameId === gameId) {
    delete socket.data.currentGameId;
  }
};
