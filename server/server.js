import http from "http";
import dns from "node:dns/promises";
import dotenv from "dotenv";

import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { initializeSocket } from "./src/sockets/index.js";

dotenv.config();

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});