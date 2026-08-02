export const validateOffer = (offer, { currentPrice, minimumPrice }) => {
  const errors = [];

  if (!Number.isFinite(offer)) {
    errors.push("Offer must be a valid number");
  }

  if (Number.isFinite(offer)) {
    if (offer < 0) {
      errors.push("Offer cannot be negative");
    }

    if (offer === 0) {
      errors.push("Offer cannot be zero");
    }

    if (offer > currentPrice) {
      errors.push("Offer cannot exceed the seller's current price");
    }

    if (offer < minimumPrice) {
      errors.push("Offer cannot be below the seller's minimum price");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    offer: Number.isFinite(offer) ? offer : null,
  };
};
