import { NegotiationEngine } from "../engines/negotiation.engine.js";
import { getGameById } from "../services/game.service.js";

const negotiationEngine = new NegotiationEngine();
const lastOffers = new Map();

export const registerGameSocketHandlers = (io, socket) => {
  socket.on("join-game", ({ gameId }) => {
    socket.join(`game:${gameId}`);
  });

  socket.on("leave-game", ({ gameId }) => {
    socket.leave(`game:${gameId}`);
  });

  socket.on("offer-price", async ({ gameId, offer }) => {
    try {
      let seller = await negotiationEngine.loadSeller(gameId);

      if (!seller) {
        const game = await getGameById(gameId);
        seller = await negotiationEngine.initializeGame(gameId, {
          originalPrice: game.product.marketPrice,
          minimumPrice: game.product.minPrice ?? 0,
          targetPrice: game.product.marketPrice,
        });
      }

      const previousOffer = lastOffers.get(gameId) ?? null;
      const decision = await negotiationEngine.processOffer({
        gameId,
        seller,
        offer,
        previousOffer,
      });

      lastOffers.set(gameId, offer);

      io.to(`game:${gameId}`).emit("seller-response", { gameId, ...decision });

      io.to(`game:${gameId}`).emit("round-update", {
        gameId,
        currentRound: decision.currentRound,
        seller: decision.seller,
      });

      if (decision.status === "ACCEPTED" || decision.status === "WALK_AWAY") {
        io.to(`game:${gameId}`).emit("game-over", { gameId, ...decision });
      }
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });
};
