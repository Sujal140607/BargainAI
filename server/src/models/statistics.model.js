import mongoose from "mongoose";

const statisticsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
      unique: true,
    },
    totalGames: {
      type: Number,
      default: 0,
      min: [0, "Total games cannot be negative"],
    },
    totalWins: {
      type: Number,
      default: 0,
      min: [0, "Total wins cannot be negative"],
    },
    totalLosses: {
      type: Number,
      default: 0,
      min: [0, "Total losses cannot be negative"],
    },
    averageSavings: {
      type: Number,
      default: 0,
      min: [0, "Average savings cannot be negative"],
    },
    totalSavings: {
      type: Number,
      default: 0,
      min: [0, "Total savings cannot be negative"],
    },
    bestDeal: {
      type: Number,
      default: 0,
      min: [0, "Best deal cannot be negative"],
    },
    averageRounds: {
      type: Number,
      default: 0,
      min: [0, "Average rounds cannot be negative"],
    },
    currentRank: {
      type: Number,
      default: 0,
      min: [0, "Current rank cannot be negative"],
      index: true,
    },
    highestRank: {
      type: Number,
      default: 0,
      min: [0, "Highest rank cannot be negative"],
    },
    winRate: {
      type: Number,
      default: 0,
      min: [0, "Win rate cannot be negative"],
      max: [100, "Win rate cannot exceed 100"],
    },
  },
  { timestamps: true }
);

statisticsSchema.index({ currentRank: 1, updatedAt: -1 });

export const Statistics = mongoose.model("Statistics", statisticsSchema);
