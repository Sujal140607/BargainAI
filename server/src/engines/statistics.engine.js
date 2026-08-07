import { Statistics } from "../models/statistics.model.js";

const VALID_RESULTS = ["WIN", "LOSS", "WALK_AWAY"];

const roundTo = (value, decimals) => {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
};

class StatisticsEngine {
  async updateAfterGame(game) {
    if (!game || typeof game !== "object") {
      throw new Error("A completed game is required");
    }

    const userId = game.user;
    const marketPrice = game.product?.marketPrice;
    const finalPrice = game.finalPrice;
    const result = game.result;
    const rounds = game.currentRound ?? 0;

    if (!userId) {
      throw new Error("userId is required");
    }

    if (typeof marketPrice !== "number" || !Number.isFinite(marketPrice)) {
      throw new Error("marketPrice must be a valid number");
    }

    if (typeof finalPrice !== "number" || !Number.isFinite(finalPrice)) {
      throw new Error("finalPrice must be a valid number");
    }

    if (!VALID_RESULTS.includes(result)) {
      throw new Error(`result must be one of: ${VALID_RESULTS.join(", ")}`);
    }

    if (!Number.isInteger(rounds) || rounds < 1) {
      throw new Error("rounds must be a positive integer");
    }

    const savings = Math.max(0, marketPrice - finalPrice);
    const isWin = result === "WIN";

    let stats = await Statistics.findOne({ user: userId });
    if (!stats) {
      stats = new Statistics({ user: userId });
    }

    const previousGames = stats.totalGames;
    const previousAverageRounds = stats.averageRounds;
    const previousTotalSavings = stats.totalSavings;

    stats.totalGames += 1;
    stats.totalWins += isWin ? 1 : 0;
    stats.totalLosses += result === "LOSS" ? 1 : 0;
    stats.totalSavings = roundTo(previousTotalSavings + savings, 2);
    stats.bestDeal = roundTo(Math.max(stats.bestDeal, savings), 2);
    stats.averageSavings = roundTo(stats.totalSavings / stats.totalGames, 2);
    stats.averageRounds = roundTo(
      (previousAverageRounds * previousGames + rounds) / stats.totalGames,
      2
    );
    stats.winRate = Math.round((stats.totalWins / stats.totalGames) * 100);

    await stats.save();
    return stats;
  }
}

const statisticsEngine = new StatisticsEngine();

export { StatisticsEngine, statisticsEngine };
