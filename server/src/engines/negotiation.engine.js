import { Seller } from "./seller.engine.js";
import { validateOffer } from "./offer.engine.js";
import { RoundTracker } from "./round.engine.js";
import { updateTrust } from "./trust.engine.js";
import { updatePatience } from "./patience.engine.js";
import redisClient from "../config/redis.js";
import { parseSellerResponse } from "../ai/parsers/response.parser.js";

const DECISION_REJECTED = "REJECTED";
const DECISION_COUNTER = "COUNTER";
const DECISION_ACCEPTED = "ACCEPTED";
const DECISION_WALK_AWAY = "WALK_AWAY";

const GAME_KEY_PREFIX = "game:";
const GAME_TTL_SECONDS = 24 * 60 * 60;

const resolveEmotion = (trustDelta, patience) => {
  if (patience <= 20) return "frustrated";
  if (patience <= 50) return "annoyed";
  if (trustDelta > 0) return "happy";
  if (trustDelta < 0) return "annoyed";
  return "neutral";
};

class NegotiationEngine {
  constructor(redis = redisClient, aiEngine = null) {
    this.redis = redis;
    this.aiEngine = aiEngine;
  }

  gameKey(gameId) {
    return `${GAME_KEY_PREFIX}${gameId}`;
  }

  async loadSeller(gameId) {
    const raw = await this.redis.get(this.gameKey(gameId));
    if (!raw) {
      return null;
    }

    const state = JSON.parse(raw);
    const seller = new Seller({
      originalPrice: state.originalPrice,
      minimumPrice: state.minimumPrice,
      targetPrice: state.targetPrice,
      trustScore: state.trustScore,
      patience: state.patience,
      maximumRounds: state.maximumRounds,
      emotion: state.emotion,
    });
    seller.currentPrice = state.currentPrice;
    seller.roundsPlayed = state.roundsPlayed;
    return seller;
  }

  async saveSeller(gameId, seller) {
    await this.redis.set(this.gameKey(gameId), JSON.stringify(seller.toJSON()), {
      EX: GAME_TTL_SECONDS,
    });
  }

  async initializeGame(gameId, { originalPrice, minimumPrice, targetPrice, maximumRounds }) {
    const seller = new Seller({
      originalPrice,
      minimumPrice,
      targetPrice,
      maximumRounds,
    });

    await this.saveSeller(gameId, seller);
    return seller;
  }

  async attachAiReply(decision, seller, offer, gameState) {
    if (!this.aiEngine) {
      return { ...decision, reply: decision.message };
    }

    let rawResponse;
    try {
      rawResponse = await this.aiEngine.respond({
        sellerState: seller.toJSON(),
        gameState,
        userOffer: offer,
      });
    } catch (error) {
      return { ...decision, reply: decision.message, ai: null, aiFallback: true };
    }

    const parsed = parseSellerResponse(rawResponse);

    if (!parsed.success) {
      return { ...decision, reply: decision.message, ai: null, aiFallback: true };
    }

    return {
      ...decision,
      reply: parsed.data.reply,
      ai: {
        emotion: parsed.data.emotion,
        confidence: parsed.data.confidence,
      },
    };
  }

  async processOffer({ gameId, seller, offer, previousOffer = null, spam = false, gameState = null }) {
    if (gameId && !seller) {
      seller = await this.loadSeller(gameId);
    }

    if (!(seller instanceof Seller)) {
      throw new Error("seller must be an instance of Seller");
    }

    if (!seller.hasRoundsLeft) {
      return this.attachAiReply(
        {
          status: DECISION_WALK_AWAY,
          offer,
          counterPrice: null,
          finalPrice: null,
          currentRound: seller.roundsPlayed,
          seller: seller.toJSON(),
          reasons: ["maximum rounds reached"],
          message: "Seller walked away",
        },
        seller,
        offer,
        gameState
      );
    }

    const validation = validateOffer(offer, {
      currentPrice: seller.currentPrice,
      minimumPrice: seller.minimumPrice,
    });

    if (!validation.valid) {
      return {
        status: DECISION_REJECTED,
        offer,
        counterPrice: null,
        finalPrice: null,
        currentRound: seller.roundsPlayed,
        seller: seller.toJSON(),
        reasons: validation.errors,
        message: "Offer rejected",
      };
    }

    const rounds = new RoundTracker({ maximumRounds: seller.maximumRounds });
    rounds.currentRound = seller.roundsPlayed + 1;
    rounds.advanceRound();
    seller.roundsPlayed = rounds.currentRound - 1;

    const trustUpdate = updateTrust({
      trust: seller.trustScore,
      offer,
      currentPrice: seller.currentPrice,
      minimumPrice: seller.minimumPrice,
      previousOffer,
      spam,
    });
    seller.trustScore = trustUpdate.trust;

    const patienceUpdate = updatePatience({
      patience: seller.patience,
      offer,
      currentPrice: seller.currentPrice,
      minimumPrice: seller.minimumPrice,
    });
    seller.patience = patienceUpdate.patience;

    seller.emotion = resolveEmotion(trustUpdate.delta, seller.patience);

    if (rounds.isGameOver || patienceUpdate.walkAway) {
      return this.attachAiReply(
        {
          status: DECISION_WALK_AWAY,
          offer,
          counterPrice: null,
          finalPrice: null,
          currentRound: seller.roundsPlayed,
          seller: seller.toJSON(),
          reasons: patienceUpdate.walkAway
            ? ["seller patience exhausted"]
            : ["maximum rounds reached"],
          message: "Seller walked away",
        },
        seller,
        offer,
        gameState
      );
    }

    if (offer >= seller.targetPrice) {
      return this.attachAiReply(
        {
          status: DECISION_ACCEPTED,
          offer,
          counterPrice: null,
          finalPrice: offer,
          currentRound: seller.roundsPlayed,
          seller: seller.toJSON(),
          reasons: ["offer meets target price"],
          message: "Offer accepted",
        },
        seller,
        offer,
        gameState
      );
    }

    const counterPrice = Math.max(
      seller.minimumPrice,
      Math.round((seller.currentPrice + offer) / 2)
    );
    seller.currentPrice = counterPrice;

    const decision = {
      status: DECISION_COUNTER,
      offer,
      counterPrice,
      finalPrice: null,
      currentRound: seller.roundsPlayed,
      seller: seller.toJSON(),
      reasons: ["offer below target price"],
      message: "Seller countered",
    };

    if (gameId) {
      try {
        await this.saveSeller(gameId, seller);
      } catch (error) {
        console.warn(`Failed to persist seller state for game ${gameId}:`, error.message);
      }
    }

    return this.attachAiReply(decision, seller, offer, gameState);
  }
}

export { NegotiationEngine };
