class ConversationMemory {
  constructor() {
    this.entries = [];
  }

  addEntry({ userOffer, sellerReply, round } = {}) {
    if (!Number.isFinite(userOffer)) {
      throw new Error("userOffer must be a valid number");
    }
    if (typeof sellerReply !== "string" || sellerReply.trim() === "") {
      throw new Error("sellerReply must be a non-empty string");
    }
    if (round !== undefined && (!Number.isInteger(round) || round < 1)) {
      throw new Error("round must be a positive integer");
    }

    const currentRound =
      round ??
      (this.entries.length === 0 ? 1 : this.entries[this.entries.length - 1].round + 1);

    this.entries.push({ round: currentRound, userOffer, sellerReply });
    return this;
  }

  getHistory() {
    return this.entries.flatMap(({ userOffer, sellerReply }) => [
      { role: "user", content: `The buyer offers ${userOffer}.` },
      { role: "assistant", content: sellerReply },
    ]);
  }

  getEntries() {
    return this.entries;
  }

  get size() {
    return this.entries.length;
  }

  get isEmpty() {
    return this.entries.length === 0;
  }

  clear() {
    this.entries = [];
  }
}

export { ConversationMemory };
