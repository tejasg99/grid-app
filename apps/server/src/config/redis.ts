import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL environment variable is not set");
}

export const redis = new Redis(redisUrl);

redis.on("connect", () => {
  console.log("✅ Connected to Redis (Upstash)");
});

redis.on("error", (err: string) => {
  console.error("❌ Redis connection error:", err);
});

// Redis key prefixes for organization
export const REDIS_KEYS = {
  GRID_CELLS: "grid:cells", // Hash: stores all cell data
  ONLINE_USERS: "grid:online", // Hash: stores online users
  USER_COOLDOWN: (userId: string) => `cooldown:${userId}`, // String with TTL
} as const;
