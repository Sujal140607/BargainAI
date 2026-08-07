import { Game } from "../models/game.model.js";
import { User } from "../models/user.model.js";
import { Statistics } from "../models/statistics.model.js";

const RANK_SORT = { wins: -1, winRate: -1, gamesPlayed: -1 };

const getLeaderboardAggregation = () => [
  { $match: { status: "COMPLETED" } },
  {
    $group: {
      _id: "$user",
      wins: {
        $sum: { $cond: [{ $eq: ["$result", "WIN"] }, 1, 0] },
      },
      gamesPlayed: { $sum: 1 },
    },
  },
  {
    $project: {
      wins: 1,
      gamesPlayed: 1,
      winRate: {
        $cond: [
          { $gt: ["$gamesPlayed", 0] },
          { $round: [{ $multiply: [{ $divide: ["$wins", "$gamesPlayed"] }, 100] }, 0] },
          0,
        ],
      },
    },
  },
  { $sort: RANK_SORT },
];

const getUserRank = async (userId) => {
  const rows = await Game.aggregate(getLeaderboardAggregation());
  const index = rows.findIndex((row) => String(row._id) === String(userId));
  return index === -1 ? 0 : index + 1;
};

export const getUserStats = async (userId) => {
  const [gameStats] = await Game.aggregate([
    { $match: { user: userId, status: "COMPLETED" } },
    {
      $group: {
        _id: null,
        gamesPlayed: { $sum: 1 },
        wins: {
          $sum: { $cond: [{ $eq: ["$result", "WIN"] }, 1, 0] },
        },
      },
    },
  ]);

  const gamesPlayed = gameStats?.gamesPlayed || 0;
  const wins = gameStats?.wins || 0;
  const winRate =
    gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0;
  const rank = await getUserRank(userId);

  return { gamesPlayed, wins, winRate, rank };
};

export const getUserStatistics = async (userId) => {
  if (!userId) {
    throw new Error("userId is required");
  }

  const [stats, rank] = await Promise.all([
    Statistics.findOne({ user: userId }).lean(),
    getUserRank(userId),
  ]);

  return {
    totalGames: stats?.totalGames ?? 0,
    totalWins: stats?.totalWins ?? 0,
    totalLosses: stats?.totalLosses ?? 0,
    winRate: stats?.winRate ?? 0,
    totalSavings: stats?.totalSavings ?? 0,
    averageSavings: stats?.averageSavings ?? 0,
    bestDeal: stats?.bestDeal ?? 0,
    averageRounds: stats?.averageRounds ?? 0,
    rank,
    highestRank: stats?.highestRank ?? 0,
  };
};

export const getLeaderboard = async (limit = 10) => {
  const rows = await Game.aggregate([
    ...getLeaderboardAggregation(),
    { $limit: limit },
  ]);

  const users = await User.find({ _id: { $in: rows.map((row) => row._id) } })
    .select("name avatar")
    .lean();

  const userMap = new Map(users.map((user) => [String(user._id), user]));

  return rows.map((row, index) => {
    const user = userMap.get(String(row._id));
    return {
      rank: index + 1,
      userId: row._id,
      name: user?.name || "Unknown player",
      avatar: user?.avatar || null,
      wins: row.wins,
      gamesPlayed: row.gamesPlayed,
      winRate: row.winRate,
    };
  });
};
