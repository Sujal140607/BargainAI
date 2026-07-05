import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const accessSecret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

export const generateAccessToken = (payload) => {
  if (!accessSecret) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign(payload, accessSecret, { expiresIn: "7d" });
};

export const generateRefreshToken = (payload) => {
  if (!refreshSecret) {
    throw new Error("JWT_REFRESH_SECRET is not defined");
  }
  return jwt.sign(payload, refreshSecret, { expiresIn: "7d" });
};

export const verifyAccessToken = (token) => {
  if (!accessSecret) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.verify(token, accessSecret);
};

export const verifyRefreshToken = (token) => {
  if (!refreshSecret) {
    throw new Error("JWT_REFRESH_SECRET is not defined");
  }
  return jwt.verify(token, refreshSecret);
};
