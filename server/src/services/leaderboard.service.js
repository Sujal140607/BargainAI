import { Game } from "../models/game.model.js";
import { User } from "../models/user.model.js";
import { Statistics } from "../models/statistics.model.js";
import redisClient from "../config/redis.js";

const RANK_SORT = { totalWins: -1, winRate: -1, totalGames: -1 };

const LEADERBOARD_CACHE_TTL_SECONDS = 300;
const TOP_LEADERBOARD_SIZE = 100;
const TOP_PLAYERS_CACHE_SIZE = 10;

const CACHE_KEYS = {
  global: "leaderboard:global",
  topPlayers: "leaderboard:top10",
  userRank: (userId) => `user:rank:${userId}`,
};

const getRankingAggregation = () => [
  { $match: { status: "COMPLETED" } },
  {
    $group: {
      _id: "$user",
      totalGames: { $sum: 1 },
      totalWins: {
        $sum: { $cond: [{ $eq: ["$result", "WIN"] }, 1, 0] },
      },
      totalSavings: {
        $sum: {
          $max: [{ $subtract: ["$product.marketPrice", "$finalPrice"] }, 0],
        },
      },
      bestDeal: {
        $max: {
          $max: [{ $subtract: ["$product.marketPrice", "$finalPrice"] }, 0],
        },
      },
    },
    $project: {
      totalGames: 1,
      totalWins: 1,
      totalSavings: 1,
      bestDeal: 1,
      winRate: {
        $cond: [
          { $gt: ["$totalGames", 0] },
          {
            $round: [
              { $multiply: [{ $divide: ["$totalWins", "$totalGames"] }, 100] },
              0,
            ],
          },
          0,
        ],
      },
    },
  },
  { $sort: RANK_SORT },
];

const assignRanks = (rows) => {
  let rank = 0;
  let previousKey = null;

  rows.forEach((row, index) => {
    const key = `${row.totalWins}:${row.winRate}:${row.totalGames}`;
    if (index === 0 || key !== previousKey) {
      rank = index + 1;
    }
    row.rank = rank;
    previousKey = key;
  });

  return rows;
};

const computeRankedStats = async () => {
  const rows = await Game.aggregate(getRankingAggregation());
  return assignRanks(rows);
};

const enrichUsers = async (rows) => {
  const users = await User.find({ _id: { $in: rows.map((row) => row._id) } })
    .select("name avatar")
    .lean();

  const userMap = new Map(users.map((user) => [String(user._id), user]));

  return rows.map((row) => {
    const user = userMap.get(String(row._id));
    return {
      rank: row.rank,
      userId: row._id,
      name: user?.name || "Unknown player",
      avatar: user?.avatar || null,
      wins: row.totalWins,
      gamesPlayed: row.totalGames,
      winRate: row.winRate,
      totalSavings: row.totalSavings,
      bestDeal: row.bestDeal,
    };
  });
};

const assertPositiveInteger = (value, name) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${name} must be a positive integer`);
  }
  return parsed;
};

const readCache = async (key) => {
  try {
    const raw = await redisClient.get(key);
    return raw === null ? null : JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

const writeCache = async (key, value) => {
  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: LEADERBOARD_CACHE_TTL_SECONDS,
    });
  } catch (error) {
    console.warn(`Failed to cache leaderboard key ${key}:`, error.message);
  }
};

const computeTopPlayers = async (size) => {
  const rows = await enrichUsers(await computeRankedStats());
  return rows.slice(0, size);
};

export const getGlobalLeaderboard = async ({ limit = 10, page = 1 } = {}) => {
  const safeLimit = assertPositiveInteger(limit, "limit");
  const safePage = assertPositiveInteger(page, "page");

  const offset = (safePage - 1) * safeLimit;
  const end = offset + safeLimit;

  const cached = await readCache(CACHE_KEYS.global);
  if (cached && end <= cached.length) {
    return cached.slice(offset, end);
  }

  const rows = await enrichUsers(await computeRankedStats());
  await writeCache(CACHE_KEYS.global, rows.slice(0, TOP_LEADERBOARD_SIZE));

  return rows.slice(offset, end);
};

export const getTopPlayers = async (limit = 3) => {
  const safeLimit = assertPositiveInteger(limit, "limit");

  if (safeLimit <= TOP_PLAYERS_CACHE_SIZE) {
    let cached = await readCache(CACHE_KEYS.topPlayers);
    if (!cached) {
      cached = await computeTopPlayers(TOP_PLAYERS_CACHE_SIZE);
      await writeCache(CACHE_KEYS.topPlayers, cached);
    }
    return cached.slice(0, safeLimit);
  }

  return computeTopPlayers(safeLimit);
};

export const getUserRank = async (userId) => {
  if (!userId) {
    throw new Error("userId is required");
  }

  const entry = await getUserLeaderboardEntry(userId);
  return entry ? entry.rank : 0;
};

export const getUserLeaderboardEntry = async (userId) => {
  if (!userId) {
    throw new Error("userId is required");
  }

  const cacheKey = CACHE_KEYS.userRank(userId);
  const cached = await readCache(cacheKey);
  if (cached) {
    return cached;
  }

  const rows = await computeRankedStats();
  const row = rows.find((entry) => String(entry._id) === String(userId));

  if (!row) {
    return null;
  }

  const [entry] = await enrichUsers([row]);
  await writeCache(cacheKey, entry);
  return entry;
};

export const getNearbyPlayers = async (userId, radius = 2) => {
  if (!userId) {
    throw new Error("userId is required");
  }
  const safeRadius = assertPositiveInteger(radius, "radius");

  const rows = await enrichUsers(await computeRankedStats());
  const index = rows.findIndex((row) => String(row.userId) === String(userId));

  if (index === -1) {
    return { rank: 0, players: [], hasAbove: false, hasBelow: false };
  }

  const start = Math.max(0, index - safeRadius);
  const end = Math.min(rows.length, index + safeRadius + 1);

  return {
    rank: rows[index].rank,
    players: rows.slice(start, end),
    hasAbove: start > 0,
    hasBelow: end < rows.length,
  };
};

export const clearLeaderboardCache = async (userId) => {
  const keys = [CACHE_KEYS.global, CACHE_KEYS.topPlayers];
  if (userId) {
    keys.push(CACHE_KEYS.userRank(userId));
  }

  try {
    await redisClient.del(keys);
  } catch (error) {
    console.warn("Failed to clear leaderboard cache:", error.message);
  }
};

export const updateRankings = async () => {
  const rows = await computeRankedStats();
  const rankedUserIds = rows.map((row) => row._id);

  await Statistics.bulkWrite(
    rows.map((row) => ({
      updateOne: {
        filter: { user: row._id },
        update: {
          $set: { currentRank: row.rank },
          $min: { highestRank: row.rank },
        },
        upsert: true,
      },
    })),
    { ordered: false }
  );

  await Statistics.updateMany(
    { user: { $nin: rankedUserIds }, currentRank: { $gt: 0 } },
    { $set: { currentRank: 0 } }
  );

  try {
    const keys = [
      CACHE_KEYS.global,
      CACHE_KEYS.topPlayers,
      ...rankedUserIds.map((userId) => CACHE_KEYS.userRank(String(userId))),
    ];
    await redisClient.del(keys);
  } catch (error) {
    console.warn("Failed to clear leaderboard cache:", error.message);
  }

  return { ranked: rows.length, rankings: rows };
};
