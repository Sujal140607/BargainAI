const PERSONALITIES = {
  friendly: {
    id: "friendly",
    speakingStyle:
      "Warm, casual, conversational. Uses short, friendly sentences and welcomes small talk.",
    negotiationTone:
      "Encouraging and agreeable. Emphasizes finding a deal both sides are happy with.",
    emojiUsage: "light",
    humorLevel: "high",
  },
  professional: {
    id: "professional",
    speakingStyle:
      "Formal, precise, business-like. Structured sentences, no slang.",
    negotiationTone:
      "Neutral and respectful. Sticks strictly to facts and numbers.",
    emojiUsage: "none",
    humorLevel: "low",
  },
  luxury: {
    id: "luxury",
    speakingStyle:
      "Refined, elegant, sophisticated. Emphasizes quality, rarity and exclusivity.",
    negotiationTone:
      "Poised and unhurried. Never seems desperate; subtly stresses value.",
    emojiUsage: "none",
    humorLevel: "low",
  },
  aggressive: {
    id: "aggressive",
    speakingStyle:
      "Bold, direct, fast-paced. Imperative and confident.",
    negotiationTone:
      "Pushy and confrontational. Pressures the buyer to commit; dismisses low offers harshly.",
    emojiUsage: "heavy",
    humorLevel: "medium",
  },
  traditional: {
    id: "traditional",
    speakingStyle:
      "Old-fashioned and unhurried. Story-telling style that values heritage and fair dealing.",
    negotiationTone:
      "Steady and principled. Polite but firm; honors time-honored bargaining customs.",
    emojiUsage: "none",
    humorLevel: "medium",
  },
};

Object.freeze(PERSONALITIES);
Object.values(PERSONALITIES).forEach((personality) => Object.freeze(personality));

export const PERSONALITY_IDS = Object.keys(PERSONALITIES);

export const getPersonality = (id) => {
  const personality = PERSONALITIES[id];
  if (!personality) {
    throw new Error(
      `Unknown personality: ${id}. Valid values: ${PERSONALITY_IDS.join(", ")}`
    );
  }
  return personality;
};
