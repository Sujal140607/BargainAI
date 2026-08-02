const TRUST_MIN = 0;
const TRUST_MAX = 100;

const clampTrust = (value) => Math.min(TRUST_MAX, Math.max(TRUST_MIN, value));

export const updateTrust = ({
  trust,
  offer,
  currentPrice,
  minimumPrice,
  previousOffer = null,
  spam = false,
}) => {
  const reasons = [];
  let delta = 0;

  if (typeof trust !== "number" || !Number.isFinite(trust)) {
    throw new Error("trust must be a valid number");
  }

  if (!Number.isFinite(offer)) {
    throw new Error("offer must be a valid number");
  }

  if (offer > currentPrice) {
    reasons.push("offer exceeds current price");
    delta -= 10;
  } else if (offer < minimumPrice) {
    reasons.push("unrealistic offer");
    delta -= 25;
  } else if (currentPrice === minimumPrice) {
    reasons.push("reasonable offer");
    delta += 10;
  } else {
    const discountRatio = (currentPrice - offer) / (currentPrice - minimumPrice);

    if (discountRatio <= 0.3) {
      reasons.push("reasonable offer");
      delta += 10;
    } else if (discountRatio <= 0.6) {
      reasons.push("fair negotiation");
      delta += 5;
    } else {
      reasons.push("lowball offer");
      delta -= 5;
    }
  }

  if (previousOffer !== null && offer === previousOffer) {
    reasons.push("repeated offer");
    delta -= 10;
  }

  if (spam) {
    reasons.push("buyer spamming");
    delta -= 15;
  }

  const updatedTrust = clampTrust(trust + delta);

  return {
    trust: updatedTrust,
    delta,
    reasons,
  };
};
