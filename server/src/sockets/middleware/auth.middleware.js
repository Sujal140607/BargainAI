import { verifyAccessToken } from "../../utils/jwt.js";

export const socketAuthMiddleware = (socket, next) => {
  const token =
    socket.handshake.auth?.token ||
    socket.handshake.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return next(new Error("Unauthorized: No token provided"));
  }

  try {
    const decoded = verifyAccessToken(token);
    socket.data.user = { userId: decoded.userId, role: decoded.role };
    return next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Unauthorized: Token expired"
        : "Unauthorized: Invalid token";
    return next(new Error(message));
  }
};
