import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();

    console.log("Redis Connected");

  } catch (error) {
    console.error("Redis Connection Failed:", error);
    process.exit(1);
  }
};

export default redisClient;