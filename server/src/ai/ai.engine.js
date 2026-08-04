import { buildSystemPrompt } from "./prompts/prompt.builder.js";
import { getPersonality } from "./personalities/personality.js";
import { ConversationMemory } from "./memory/memory.manager.js";
import { NegotiationChain } from "./langchain/chain.js";

class AIEngine {
  constructor({ chain, provider, personalityId } = {}) {
    this.chain = chain ?? new NegotiationChain();
    this.provider = provider ?? null;
    this.memory = new ConversationMemory();
    this.personalityId = personalityId ?? "friendly";
  }

  async respond({ sellerState, gameState, userOffer }) {
    const personality = getPersonality(this.personalityId);
    const systemPrompt = buildSystemPrompt({
      sellerState,
      gameState,
      userOffer,
      personality,
    });
    const history = this.memory.getHistory();

    const runner = this.chain ?? this.provider;
    if (!runner) {
      throw new Error("AIEngine requires either a chain or a provider");
    }
    return runner.run({ systemPrompt, history });
  }

  record({ userOffer, sellerReply, round }) {
    this.memory.addEntry({ userOffer, sellerReply, round });
    return this;
  }
}

export { AIEngine };
