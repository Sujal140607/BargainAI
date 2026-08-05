import { z } from "zod";
import redisClient from "../../config/redis.js";
import { AIEngine } from "../../ai/ai.engine.js";
import { NegotiationEngine } from "../../engines/negotiation.engine.js";
import { getGameById } from "../../services/game.service.js";
import {
  emitSellerUpdate,
  emitSellerTyping,
  emitSellerStopTyping,
  SERVER_EVENTS,
} from "../events/index.js";

const DECISION_ACCEPTED = "ACCEPTED";
const DECISION_WALK_AWAY = "WALK_AWAY";

const negotiationEngine = new NegotiationEngine(redisClient, new AIEngine());

const offerPayloadSchema = z.object({
  gameId: z.string().min(1, "gameId is required"),
  offer: z.number().positive("offer must be a positive number"),
});

const LAST_OFFER_KEY_PREFIX = "lastOffer:";
const lastOfferKey = (gameId) => `${LAST_OFFER_KEY_PREFIX}${gameId}`;

const getLastOffer = async (gameId) => {
  const raw = await redisClient.get(lastOfferKey(gameId));
  return raw ? Number(raw) : null;
};

const setLastOffer = async (gameId, offer) => {
  await redisClient.set(lastOfferKey(gameId), String(offer));
};

const loadSeller = async (gameId) => {
  let seller = await negotiationEngine.loadSeller(gameId);

  if (seller) {
    return seller;
  }

  const game = await getGameById(gameId);
  return negotiationEngine.initializeGame(gameId, {
    originalPrice: game.product.marketPrice,
    minimumPrice: game.product.minPrice ?? 0,
    targetPrice: game.product.marketPrice,
  });
};

export const handleOfferSend = async (io, socket, payload) => {
  const parsed = offerPayloadSchema.safeParse(payload);

  if (!parsed.success) {
    return socket.emit(SERVER_EVENTS.ERROR, {
      message: "Invalid offer payload",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const { gameId, offer } = parsed.data;

  try {
    const seller = await loadSeller(gameId);
    const previousOffer = await getLastOffer(gameId);

    emitSellerTyping(io, gameId);

    const decision = await negotiationEngine.processOffer({
      gameId,
      seller,
      offer,
      previousOffer,
    });

    await negotiationEngine.saveSeller(gameId, seller);
    await setLastOffer(gameId, offer);

    const sellerState = decision.seller;
    emitSellerUpdate(io, gameId, {
      reply: decision.reply,
      counterOffer: decision.counterPrice ?? null,
      emotion: decision.ai?.emotion ?? sellerState.emotion,
      trustScore: sellerState.trustScore,
      patience: sellerState.patience,
      currentRound: decision.currentRound,
      gameOver:
        decision.status === DECISION_ACCEPTED || decision.status === DECISION_WALK_AWAY,
    });

    emitSellerStopTyping(io, gameId);
  } catch (error) {
    socket.emit(SERVER_EVENTS.ERROR, { message: error.message });
  }
};
