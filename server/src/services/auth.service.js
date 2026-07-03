import { User } from "../models/user.model.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

export const registerUser = async (data) => {
  const parsed = registerSchema.parse(data);

  const existingUser = await User.findOne({ email: parsed.email });
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const hashedPassword = await hashPassword(parsed.password);

  const user = await User.create({
    name: parsed.name,
    email: parsed.email,
    password: hashedPassword,
  });

  const payload = { userId: user._id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

export const loginUser = async (data) => {
  const parsed = loginSchema.parse(data);

  const user = await User.findOne({ email: parsed.email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await comparePassword(parsed.password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const payload = { userId: user._id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

export const refreshAccessToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new Error("Refresh token is required");
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(incomingRefreshToken);
  } catch {
    throw new Error("Invalid or expired refresh token");
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (user.refreshToken !== incomingRefreshToken) {
    throw new Error("Refresh token is invalid or has been reused");
  }

  const payload = { userId: user._id, role: user.role };
  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  user.refreshToken = newRefreshToken;
  await user.save();

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logoutUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  user.refreshToken = null;
  await user.save();

  return { message: "Logged out successfully" };
};
