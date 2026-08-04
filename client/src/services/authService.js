import api from "./axios";
import { setAccessToken, clearAccessToken } from "./tokenRegistry";

export const authService = {
  async register(credentials) {
    const envelope = await api.post("/auth/register", credentials);
    setAccessToken(envelope.data?.accessToken);
    return envelope.data;
  },

  async login(credentials) {
    const envelope = await api.post("/auth/login", credentials);
    setAccessToken(envelope.data?.accessToken);
    return envelope.data;
  },

  async logout() {
    try {
      const envelope = await api.post("/auth/logout");
      return envelope.data;
    } finally {
      clearAccessToken();
    }
  },

  async refreshToken() {
    const envelope = await api.post("/auth/refresh-token");
    return envelope.data;
  },

  async getCurrentUser() {
    const envelope = await api.get("/auth/me");
    return envelope.data;
  },
};
