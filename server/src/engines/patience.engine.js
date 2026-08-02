const PATIENCE_MIN = 0;
const PATIENCE_MAX = 100;

const clampPatience = (value) => Math.min(PATIENCE_MAX, Math.max(PATIENCE_MIN, value));

export const updatePatience = ({
  patience,
  offer,
  currentPrice,
  minimumPrice,
}) => {
  const reasons = [];
  let delta = -5;

  if (typeof patience !== "number" || !Number.isFinite(patience)) {
    throw new Error("patience must be a valid number");
  }

  if (!Number.isFinite(offer)) {
    throw new Error("offer must be a valid number");
  }

  reasons.push("long negotiation");

  if (offer < minimumPrice) {
    reasons.push("unrealistic offer");
    delta -= 20;
  } else if (currentPrice !== minimumPrice) {
    const discountRatio = (currentPrice - offer) / (currentPrice - minimumPrice);

    if (discountRatio > 0.6) {
      reasons.push("lowball offer");
      delta -= 10;
    }
  }

  const updatedPatience = clampPatience(patience + delta);

  return {
    patience: updatedPatience,
    delta,
    reasons,
    walkAway: updatedPatience === 0,
  };
};
