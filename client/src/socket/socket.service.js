import { io } from "socket.io-client";
import { getAccessToken } from "../services/tokenRegistry";
import { SOCKET_EVENTS } from "./events";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

class SocketService {
  constructor() {
    this.socket = null;
    this.activeGameId = null;
    this.reconnectHandler = () => this.rejoinGame();
  }

  connect() {
    if (this.socket) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token: getAccessToken() },
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    this.socket.on(SOCKET_EVENTS.CONNECT, this.reconnectHandler);
    this.socket.connect();

    return this.socket;
  }

  authenticate(token) {
    if (this.socket) {
      this.socket.auth = { token };
    }
  }

  disconnect() {
    if (!this.socket) {
      return;
    }

    this.socket.off(SOCKET_EVENTS.CONNECT, this.reconnectHandler);
    this.socket.disconnect();
    this.socket = null;
    this.activeGameId = null;
  }

  isConnected() {
    return Boolean(this.socket?.connected);
  }

  joinGame(gameId) {
    this.activeGameId = gameId;
    this.socket?.emit(SOCKET_EVENTS.JOIN_GAME, { gameId });
  }

  leaveGame(gameId) {
    if (this.activeGameId === gameId) {
      this.activeGameId = null;
    }
    this.socket?.emit(SOCKET_EVENTS.LEAVE_GAME, { gameId });
  }

  rejoinGame() {
    if (this.activeGameId) {
      this.socket?.emit(SOCKET_EVENTS.JOIN_GAME, { gameId: this.activeGameId });
    }
  }

  sendOffer(gameId, offer) {
    this.socket?.emit(SOCKET_EVENTS.OFFER_SEND, { gameId, offer });
  }

  onSellerUpdate(handler) {
    return this.on(SOCKET_EVENTS.SELLER_UPDATE, handler);
  }

  onGameUpdate(handler) {
    return this.on(SOCKET_EVENTS.GAME_UPDATE, handler);
  }

  onSellerTyping(handler) {
    return this.on(SOCKET_EVENTS.SELLER_TYPING, handler);
  }

  onSellerStopTyping(handler) {
    return this.on(SOCKET_EVENTS.SELLER_STOP_TYPING, handler);
  }

  onError(handler) {
    return this.on(SOCKET_EVENTS.ERROR, handler);
  }

  onConnect(handler) {
    return this.on(SOCKET_EVENTS.CONNECT, handler);
  }

  onDisconnect(handler) {
    return this.on(SOCKET_EVENTS.DISCONNECT, handler);
  }

  on(event, handler) {
    this.socket?.on(event, handler);
    return this;
  }

  off(event, handler) {
    this.socket?.off(event, handler);
    return this;
  }
}

export const socketService = new SocketService();
