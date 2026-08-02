class RoundTracker {
  constructor({ maximumRounds }) {
    if (!Number.isInteger(maximumRounds) || maximumRounds < 1) {
      throw new Error("maximumRounds must be a positive integer");
    }

    this.maximumRounds = maximumRounds;
    this.currentRound = 1;
  }

  get isGameOver() {
    return this.currentRound > this.maximumRounds;
  }

  get hasRoundsLeft() {
    return !this.isGameOver;
  }

  advanceRound() {
    if (this.isGameOver) {
      throw new Error("Game is already over");
    }

    this.currentRound += 1;
    return this.currentRound;
  }

  toJSON() {
    return {
      currentRound: this.currentRound,
      maximumRounds: this.maximumRounds,
      isGameOver: this.isGameOver,
    };
  }
}

export { RoundTracker };
