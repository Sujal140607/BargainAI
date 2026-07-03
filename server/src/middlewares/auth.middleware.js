import { verifyAccessToken } from "../utils/jwt.js";

export const authMiddleware = (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch {
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }

  req.user = { userId: decoded.userId, role: decoded.role };
  next();
};
