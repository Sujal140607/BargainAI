import api from "./axios";

export const gameService = {
  async startGame(payload) {
    const envelope = await api.post("/game/games", payload);
    return envelope.data;
  },

  async getGame(gameId) {
    const envelope = await api.get(`/game/games/${gameId}`);
    return envelope.data;
  },

  async endGame(gameId) {
    const envelope = await api.patch(`/game/games/${gameId}/end`);
    return envelope.data;
  },

  async getGameHistory(limit) {
    const envelope = await api.get("/game/history", {
      params: limit ? { limit } : undefined,
    });
    return envelope.data;
  },
};
