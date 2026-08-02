import { Server } from "socket.io";
import { registerGameSocketHandlers } from "./game.socket.js";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client Connected: ${socket.id}`);

    registerGameSocketHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log(`Client Disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized.");
  }

  return io;
};