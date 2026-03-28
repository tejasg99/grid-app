import { redis, REDIS_KEYS } from "../config/redis.js";
import { User, USER_COLORS } from "@grid-app/shared";

export class UserService {
  private colorIndex = 0;

  // Get next color (cycles through available colors)
  private getNextColor(): string {
    const color = USER_COLORS[this.colorIndex % USER_COLORS.length];
    this.colorIndex++;
    return color;
  }

  // Create a new user
  async createUser(socketId: string, username: string): Promise<User> {
    const user: User = {
      id: socketId,
      username: username.trim() || `Player_${socketId.slice(0, 4)}`,
      color: this.getNextColor(),
      blockCount: 0,
    };

    await redis.hset(REDIS_KEYS.ONLINE_USERS, socketId, JSON.stringify(user));

    return user;
  }

  // Get a user by ID
  async getUser(socketId: string): Promise<User | null> {
    const userData = await redis.hget(REDIS_KEYS.ONLINE_USERS, socketId);
    return userData ? JSON.parse(userData) : null;
  }

  // Get all online users
  async getAllUsers(): Promise<User[]> {
    const usersRaw = await redis.hgetall(REDIS_KEYS.ONLINE_USERS);
    return Object.values(usersRaw).map((userData) => JSON.parse(userData));
  }

  // Update user's block count
  async updateBlockCount(
    socketId: string,
    increment: number = 1,
  ): Promise<User | null> {
    const user = await this.getUser(socketId);

    if (!user) return null;

    user.blockCount += increment;
    await redis.hset(REDIS_KEYS.ONLINE_USERS, socketId, JSON.stringify(user));

    return user;
  }

  // Remove user (on disconnect)
  async removeUser(socketId: string): Promise<void> {
    await redis.hdel(REDIS_KEYS.ONLINE_USERS, socketId);
  }

  // Get online user count
  async getOnlineCount(): Promise<number> {
    return await redis.hlen(REDIS_KEYS.ONLINE_USERS);
  }
}

export const userService = new UserService();
