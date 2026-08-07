import { Game } from "../models/game.model.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const MIN_DAYS = 7;
const MAX_DAYS = 90;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const toDayKey = (date) => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

const toLabel = (key) => {
  const [, month, day] = key.split("-").map(Number);
  if (!month || !day) {
    return key;
  }
  return `${MONTHS[month - 1]} ${day}`;
};

const lastNDays = (days) => {
  const now = new Date();
  const range = [];
  for (let i = days - 1; i >= 0; i--) {
    range.push(toDayKey(new Date(now.getTime() - i * DAY_MS)));
  }
  return range;
};

const savingsFor = (game) =>
  Math.max(0, (game.product?.marketPrice ?? 0) - (game.finalPrice ?? 0));

const buildTrends = (userGames, days) => {
  const byDay = new Map();
  for (const game of userGames) {
    const key = toDayKey(game.startedAt);
    const entry = byDay.get(key) ?? { games: 0, wins: 0, savings: 0 };
    entry.games += 1;
    entry.wins += game.result === "WIN" ? 1 : 0;
    entry.savings += savingsFor(game);
    byDay.set(key, entry);
  }

  const runningByDay = new Map();
  let games = 0;
  let wins = 0;
  let savings = 0;
  for (const [key, entry] of byDay) {
    games += entry.games;
    wins += entry.wins;
    savings += entry.savings;
    runningByDay.set(key, { games, wins, savings });
  }

  const keys = [...runningByDay.keys()].sort();

  const snapshotAt = (target) => {
    let snapshot = { games: 0, wins: 0, savings: 0 };
    for (const key of keys) {
      if (key <= target) {
        snapshot = runningByDay.get(key);
      } else {
        break;
      }
    }
    return snapshot;
  };

  const gamesOverTime = [];
  const savingsTrend = [];
  const winRateTrend = [];

  for (const key of lastNDays(days)) {
    const dayGames = byDay.get(key)?.games ?? 0;
    const { games: cumGames, wins: cumWins, savings: cumSavings } =
      snapshotAt(key);

    gamesOverTime.push({ date: key, label: toLabel(key), games: dayGames });
    savingsTrend.push({
      date: key,
      label: toLabel(key),
      savings: Math.round(cumSavings * 100) / 100,
    });
    winRateTrend.push({
      date: key,
      label: toLabel(key),
      winRate: cumGames > 0 ? Math.round((cumWins / cumGames) * 100) : 0,
    });
  }

  return { gamesOverTime, savingsTrend, winRateTrend };
};

const isBetter = (candidate, challenger) => {
  const candidateWinRate =
    candidate.gamesPlayed > 0 ? (candidate.wins / candidate.gamesPlayed) * 100 : 0;
  const challengerWinRate =
    challenger.gamesPlayed > 0 ? (challenger.wins / challenger.gamesPlayed) * 100 : 0;

  if (challenger.wins !== candidate.wins) {
    return challenger.wins > candidate.wins;
  }
  if (challengerWinRate !== candidateWinRate) {
    return challengerWinRate > candidateWinRate;
  }
  return challenger.gamesPlayed > candidate.gamesPlayed;
};

const computeRankProgression = async (userId) => {
  const games = await Game.find({ status: "COMPLETED" })
    .sort({ startedAt: 1 })
    .select("user result startedAt")
    .lean();

  const tallies = new Map();
  const progression = [];

  for (const game of games) {
    const key = String(game.user);
    const tally = tallies.get(key) ?? { wins: 0, gamesPlayed: 0 };
    tally.wins += game.result === "WIN" ? 1 : 0;
    tally.gamesPlayed += 1;
    tallies.set(key, tally);

    if (key === String(userId)) {
      let rank = 1;
      for (const [otherKey, other] of tallies) {
        if (otherKey === key) {
          continue;
        }
        if (isBetter(tally, other)) {
          rank += 1;
        }
      }
      progression.push({ date: toDayKey(game.startedAt), label: toLabel(toDayKey(game.startedAt)), rank });
    }
  }

  return progression;
};

export const getUserAnalytics = async (userId, { days = 14 } = {}) => {
  if (!userId) {
    throw new Error("userId is required");
  }

  const safeDays = Math.min(Math.max(Number(days) || 14, MIN_DAYS), MAX_DAYS);

  const userGames = await Game.find({ user: userId, status: "COMPLETED" })
    .sort({ startedAt: 1 })
    .lean();

  const trends = buildTrends(userGames, safeDays);
  const rankProgression = await computeRankProgression(userId);

  return { ...trends, rankProgression };
};
