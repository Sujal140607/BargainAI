const DEFAULT_WEIGHTS = {
  winRate: 0.4,
  averageSavings: 0.3,
  totalGames: 0.15,
  bestDeal: 0.15,
};

const FACTORS = Object.keys(DEFAULT_WEIGHTS);

const percentageNormalizer = (value) => value;

const minMaxNormalizer = (value, poolValues) => {
  const values = poolValues.filter((entry) => Number.isFinite(entry));
  if (values.length === 0) {
    return 0;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) {
    return 0;
  }

  return ((value - min) / (max - min)) * 100;
};

const DEFAULT_NORMALIZERS = {
  winRate: percentageNormalizer,
  averageSavings: minMaxNormalizer,
  totalGames: minMaxNormalizer,
  bestDeal: minMaxNormalizer,
};

const roundTo = (value, decimals) => {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
};

const toFiniteNumber = (value) => (Number.isFinite(value) ? value : 0);

const normalizeWeights = (weights) => {
  const total = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  if (total <= 0) {
    throw new Error("Weights must sum to a positive value");
  }

  return Object.fromEntries(
    Object.entries(weights).map(([factor, weight]) => [factor, weight / total])
  );
};

class RankingEngine {
  constructor({ weights = {}, normalizers = {} } = {}) {
    this.weights = normalizeWeights({ ...DEFAULT_WEIGHTS, ...weights });
    this.normalizers = { ...DEFAULT_NORMALIZERS, ...normalizers };
  }

  normalizeFactors(player, pool) {
    const poolValues = {};
    for (const factor of FACTORS) {
      poolValues[factor] = pool.map((entry) => toFiniteNumber(entry?.[factor]));
    }

    const normalized = {};
    for (const factor of FACTORS) {
      const value = toFiniteNumber(player?.[factor]);
      const normalizer = this.normalizers[factor] ?? minMaxNormalizer;
      normalized[factor] = Math.max(
        0,
        Math.min(100, normalizer(value, poolValues[factor]))
      );
    }

    return normalized;
  }

  calculateScore(player, pool = [player]) {
    if (!player || typeof player !== "object") {
      throw new Error("A player is required");
    }

    if (!Array.isArray(pool) || pool.length === 0) {
      throw new Error("A non-empty pool is required");
    }

    const normalized = this.normalizeFactors(player, pool);

    return FACTORS.reduce(
      (score, factor) => score + this.weights[factor] * normalized[factor],
      0
    );
  }

  calculateRank(players) {
    if (!Array.isArray(players) || players.length === 0) {
      throw new Error("A non-empty list of players is required");
    }

    const scored = players
      .map((player) => ({
        ...player,
        score: roundTo(this.calculateScore(player, players), 2),
      }))
      .sort((a, b) => b.score - a.score);

    let rank = 0;
    let previousScore = null;

    return scored.map((entry, index) => {
      if (index === 0 || entry.score !== previousScore) {
        rank = index + 1;
      }
      previousScore = entry.score;
      return { ...entry, rank };
    });
  }
}

const rankingEngine = new RankingEngine();

export { RankingEngine, rankingEngine };
