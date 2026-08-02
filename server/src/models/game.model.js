import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    marketPrice: {
      type: Number,
      required: [true, "Market price is required"],
      min: [0, "Market price cannot be negative"],
    },
    minPrice: {
      type: Number,
      min: [0, "Minimum price cannot be negative"],
    },
  },
  { _id: false }
);

const gameSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    product: {
      type: productSchema,
      required: [true, "Product is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["ACTIVE", "COMPLETED", "CANCELLED"],
        message: "Status must be ACTIVE, COMPLETED or CANCELLED",
      },
      default: "ACTIVE",
    },
    currentRound: {
      type: Number,
      default: 1,
      min: [1, "Current round must be at least 1"],
    },
    finalPrice: {
      type: Number,
      min: [0, "Final price cannot be negative"],
      default: null,
    },
    result: {
      type: String,
      enum: {
        values: ["WIN", "LOSS", "WALK_AWAY"],
        message: "Result must be WIN, LOSS or WALK_AWAY",
      },
      default: null,
    },
    startedAt: {
      type: Date,
      default: Date.now,
      required: [true, "Started at is required"],
    },
    endedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

gameSchema.index({ status: 1, startedAt: -1 });

export const Game = mongoose.model("Game", gameSchema);
