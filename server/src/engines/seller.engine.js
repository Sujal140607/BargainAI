const EMOTIONS = ["neutral", "happy", "annoyed", "frustrated", "pleased"];

class Seller {
  constructor({
    originalPrice,
    minimumPrice,
    targetPrice,
    trustScore = 50,
    patience = 100,
    maximumRounds = 10,
    emotion = "neutral",
  }) {
    if (typeof originalPrice !== "number" || originalPrice <= 0) {
      throw new Error("originalPrice must be a positive number");
    }

    if (typeof minimumPrice !== "number" || minimumPrice < 0) {
      throw new Error("minimumPrice must be a non-negative number");
    }

    if (typeof targetPrice !== "number" || targetPrice < 0) {
      throw new Error("targetPrice must be a non-negative number");
    }

    if (minimumPrice > originalPrice) {
      throw new Error("minimumPrice cannot exceed originalPrice");
    }

    if (!EMOTIONS.includes(emotion)) {
      throw new Error(`emotion must be one of: ${EMOTIONS.join(", ")}`);
    }

    this.originalPrice = originalPrice;
    this.currentPrice = originalPrice;
    this.minimumPrice = minimumPrice;
    this.targetPrice = targetPrice;
    this.trustScore = trustScore;
    this.patience = patience;
    this.roundsPlayed = 0;
    this.maximumRounds = maximumRounds;
    this.emotion = emotion;
  }

  get hasRoundsLeft() {
    return this.roundsPlayed < this.maximumRounds;
  }

  toJSON() {
    return {
      originalPrice: this.originalPrice,
      currentPrice: this.currentPrice,
      minimumPrice: this.minimumPrice,
      targetPrice: this.targetPrice,
      trustScore: this.trustScore,
      patience: this.patience,
      roundsPlayed: this.roundsPlayed,
      maximumRounds: this.maximumRounds,
      emotion: this.emotion,
    };
  }
}

export { Seller };
