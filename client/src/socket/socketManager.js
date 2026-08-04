import { socket } from "./socket";
import { SOCKET_EVENTS } from "./events";

class GameSocketManager {
  constructor() {
    this.socket = socket;
    this.activeGameId = null;
    this.connectHandler = () => this.rejoinGame();
    this.socket.on(SOCKET_EVENTS.CONNECT, this.connectHandler);
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  isConnected() {
    return this.socket.connected;
  }

  joinGame(gameId) {
    this.activeGameId = gameId;
    this.socket.emit(SOCKET_EVENTS.JOIN_GAME, { gameId });
  }

  leaveGame(gameId) {
    if (this.activeGameId === gameId) {
      this.activeGameId = null;
    }
    this.socket.emit(SOCKET_EVENTS.LEAVE_GAME, { gameId });
  }

  rejoinGame() {
    if (this.activeGameId) {
      this.socket.emit(SOCKET_EVENTS.JOIN_GAME, {
        gameId: this.activeGameId,
      });
    }
  }

  sendOffer(gameId, offer) {
    this.socket.emit(SOCKET_EVENTS.OFFER_PRICE, { gameId, offer });
  }

  on(event, handler) {
    this.socket.on(event, handler);
    return this;
  }

  off(event, handler) {
    this.socket.off(event, handler);
    return this;
  }
}

export const gameSocket = new GameSocketManager();
