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
    // First check if user already exists (reconnection case)
    const existingUser = await this.getUser(socketId);
    if (existingUser) {
      console.log(`User ${socketId} already exists, returning existing user`);
      return existingUser;
    }

    const user: User = {
      id: socketId,
      username: username.trim() || `Player_${socketId.slice(0, 4)}`,
      color: this.getNextColor(),
      blockCount: 0,
    };

    await redis.hset(REDIS_KEYS.ONLINE_USERS, socketId, JSON.stringify(user));
    console.log(`Created new user: ${user.username} (${socketId})`);

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

  // Update a user
  async updateUser(user: User): Promise<void> {
    await redis.hset(REDIS_KEYS.ONLINE_USERS, user.id, JSON.stringify(user));
  }

  // Update user's block count
  async updateBlockCount(
    socketId: string,
    increment: number = 1,
  ): Promise<User | null> {
    const user = await this.getUser(socketId);

    if (!user) {
      console.log(`Cannot update block count: user ${socketId} not found`);
      return null;
    }

    user.blockCount += increment;
    await redis.hset(REDIS_KEYS.ONLINE_USERS, socketId, JSON.stringify(user));
    console.log(`Updated block count for ${user.username}: ${user.blockCount}`);

    return user;
  }

  // Remove user (on disconnect)
  async removeUser(socketId: string): Promise<void> {
    await redis.hdel(REDIS_KEYS.ONLINE_USERS, socketId);
    console.log(`Removed user: ${socketId}`);
  }

  // Clear all users (on server start or reset)
  async clearAllUsers(): Promise<void> {
    await redis.del(REDIS_KEYS.ONLINE_USERS);
    this.colorIndex = 0; // Reset color index
    console.log("Cleared all users");
  }

  // Get online user count
  async getOnlineCount(): Promise<number> {
    return await redis.hlen(REDIS_KEYS.ONLINE_USERS);
  }
}

export const userService = new UserService();
