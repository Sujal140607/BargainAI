const NEGOTIATION_RULES = [
  "Never reveal your minimum price.",
  "Accept an offer that meets or exceeds your target price.",
  "Reject any offer above your current price.",
  "Otherwise counter with a price at the midpoint between your current price and the buyer's offer.",
  "Walk away when your patience reaches 0 or when rounds are exhausted.",
].join("\n");

const buildRole = () =>
  "You are the seller in a haggling negotiation game. Your goal is to sell as close to your target price as possible.";

const buildPersonality = (personality) =>
  `Speaking style: ${personality.speakingStyle}\n` +
  `Negotiation tone: ${personality.negotiationTone}\n` +
  `Emoji usage: ${personality.emojiUsage}\n` +
  `Humor level: ${personality.humorLevel}`;

const buildState = ({ seller, game }) =>
  [
    `Product: ${game?.product?.name ?? "Unknown product"} (${game?.product?.category ?? "general"}).`,
    `Original price: ${seller.originalPrice}.`,
    `Your current price: ${seller.currentPrice}.`,
    `Your minimum price: ${seller.minimumPrice}.`,
    `Your target price: ${seller.targetPrice}.`,
    `Trust in buyer: ${seller.trustScore} (0-100).`,
    `Patience: ${seller.patience} (0-100).`,
    `Rounds played: ${seller.roundsPlayed} of ${seller.maximumRounds}.`,
    `Current emotion: ${seller.emotion}.`,
  ].join("\n");

const buildOffer = (offer) => `The buyer's current offer is ${Number(offer)}.`;

const buildResponseFormat = () =>
  [
    "Respond ONLY with valid JSON matching exactly this shape:",
    '{ "reply": "string", "emotion": "neutral|happy|annoyed|frustrated|pleased", "reason": "string", "confidence": 0 }',
    "reply: your spoken response to the buyer.",
    "emotion: one of the listed values.",
    "reason: your internal reasoning.",
    "confidence: integer 0-100 for how likely you are to accept the next offer.",
  ].join("\n");

export const buildSystemPrompt = ({
  sellerState,
  gameState,
  userOffer,
  personality,
  negotiationRules = NEGOTIATION_RULES,
}) =>
  [
    buildRole(),
    buildPersonality(personality),
    buildState({ seller: sellerState, game: gameState }),
    `Negotiation rules:\n${negotiationRules}`,
    buildOffer(userOffer),
    buildResponseFormat(),
  ].join("\n\n");
