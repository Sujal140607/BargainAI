import api from "./axios";

export const leaderboardService = {
  async getLeaderboard(options = {}) {
    const { limit } = options;
    const envelope = await api.get("/leaderboard", {
      params: limit ? { limit } : undefined,
    });
    return envelope.data;
  },

  async getStats() {
    const envelope = await api.get("/stats");
    return envelope.data;
  },
};
