import { redis, REDIS_KEYS } from "../config/redis.js";
import { Cell, GridState, GRID_CONFIG, COOLDOWN_MS } from "../types/shared.js";

export class GridService {
  // Initialize empty grid in Redis if doesnt exist already
  async initializeGrid(): Promise<void> {
    const exists = await redis.exists(REDIS_KEYS.GRID_CELLS);

    if (!exists) {
      console.log("🎮 Initializing new grid...");
      await this.createEmptyGrid();
    } else {
      console.log("✅ Grid already exists in Redis");
    }
  }

  // Create an empty grid
  private async createEmptyGrid(): Promise<void> {
    const cells: Record<string, string> = {};

    for (let row = 0; row < GRID_CONFIG.rows; row++) {
      for (let col = 0; col < GRID_CONFIG.cols; col++) {
        const cellId = `${row}-${col}`;
        const cell: Cell = {
          id: cellId,
          ownerId: null,
          ownerColor: null,
          ownerName: null,
          claimedAt: null,
        };
        cells[cellId] = JSON.stringify(cell);
      }
    }

    await redis.hset(REDIS_KEYS.GRID_CELLS, cells);
    console.log(
      `✅ Grid initialized with ${GRID_CONFIG.rows * GRID_CONFIG.cols} cells`,
    );
  }

  // Get complete grid state
  async getGridState(): Promise<GridState> {
    const cellsRaw = await redis.hgetall(REDIS_KEYS.GRID_CELLS);
    const cells: Record<string, Cell> = {};

    for (const [cellId, cellData] of Object.entries(cellsRaw)) {
      cells[cellId] = JSON.parse(cellData);
    }

    return {
      cells,
      config: GRID_CONFIG,
    };
  }

  // Get a single cell
  async getCell(cellId: string): Promise<Cell | null> {
    const cellData = await redis.hget(REDIS_KEYS.GRID_CELLS, cellId);
    return cellData ? JSON.parse(cellData) : null;
  }

  // Claim a cell for a user
  async claimCell(
    cellId: string,
    userId: string,
    username: string,
    color: string,
  ): Promise<{ success: boolean; cell?: Cell; error?: string }> {
    // Check if cell exists
    const existingCell = await this.getCell(cellId);

    if (!existingCell) {
      return { success: false, error: "Cell does not exist" };
    }

    // Check if cell is already claimed
    if (existingCell.ownerId !== null) {
      return { success: false, error: "Cell is already claimed" };
    }

    // Check cooldown
    const cooldownKey = REDIS_KEYS.USER_COOLDOWN(userId);
    const isOnCooldown = await redis.exists(cooldownKey);

    if (isOnCooldown) {
      return {
        success: false,
        error: "Please wait before claiming another cell",
      };
    }

    // Claim the cell
    const updatedCell: Cell = {
      id: cellId,
      ownerId: userId,
      ownerColor: color,
      ownerName: username,
      claimedAt: Date.now(),
    };

    // Use transaction to ensure atomicity
    const pipeline = redis.pipeline();
    pipeline.hset(REDIS_KEYS.GRID_CELLS, cellId, JSON.stringify(updatedCell));
    pipeline.set(cooldownKey, "1", "PX", COOLDOWN_MS); // Set cooldown with TTL
    await pipeline.exec();

    return { success: true, cell: updatedCell };
  }

  // Unclaim a cell (toggle off)
  async unclaimCell(
    cellId: string,
    userId: string,
  ): Promise<{ success: boolean; cell?: Cell; error?: string }> {
    // Check if cell exists
    const existingCell = await this.getCell(cellId);

    if (!existingCell) {
      return { success: false, error: "Cell does not exist" };
    }

    // Check if cell belongs to this user
    if (existingCell.ownerId !== userId) {
      return { success: false, error: "You can only unclaim your own cells" };
    }

    // Check cooldown
    const cooldownKey = REDIS_KEYS.USER_COOLDOWN(userId);
    const isOnCooldown = await redis.exists(cooldownKey);

    if (isOnCooldown) {
      return { success: false, error: "Please wait before unclaiming" };
    }

    // Unclaim the cell
    const updatedCell: Cell = {
      id: cellId,
      ownerId: null,
      ownerColor: null,
      ownerName: null,
      claimedAt: null,
    };

    // Use transaction to ensure atomicity
    const pipeline = redis.pipeline();
    pipeline.hset(REDIS_KEYS.GRID_CELLS, cellId, JSON.stringify(updatedCell));
    pipeline.set(cooldownKey, "1", "PX", COOLDOWN_MS); // Set cooldown with TTL
    await pipeline.exec();

    return { success: true, cell: updatedCell };
  }

  // Reset grid (clears all claims)
  async resetGrid(): Promise<GridState> {
    console.log("🔄 Resetting grid...");
    await redis.del(REDIS_KEYS.GRID_CELLS);
    await this.createEmptyGrid();
    return this.getGridState();
  }
}

export const gridService = new GridService();
