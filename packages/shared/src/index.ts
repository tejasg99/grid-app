// ============================================
// SHARED TYPES - Used by both frontend & backend
// ============================================

// Grid cell representation
export interface Cell {
  id: string; // "row-col" format, e.g., "0-0", "5-3"
  ownerId: string | null;
  ownerColor: string | null;
  ownerName: string | null;
  claimedAt: number | null;
}

// User representation
export interface User {
  id: string; // Socket ID
  username: string;
  color: string;
  blockCount: number;
}

// Grid configuration
export interface GridConfig {
  rows: number;
  cols: number;
}

// Complete grid state
export interface GridState {
  cells: Record<string, Cell>; // { "0-0": Cell, "0-1": Cell, ... }
  config: GridConfig;
}

// Game initialization data
export interface GameInitData {
  grid: GridState;
  users: User[];
  currentUser: User;
}

// Cell claimed event data
export interface CellClaimedData {
  cell: Cell;
  user: User;
}

// ============================================
// SOCKET EVENT TYPES
// ============================================

export interface ServerToClientEvents {
  "game:init": (data: GameInitData) => void;
  "grid:cell-claimed": (data: CellClaimedData) => void;
  "user:joined": (user: User) => void;
  "user:left": (userId: string) => void;
  "users:update": (users: User[]) => void;
  error: (message: string) => void;
}

export interface ClientToServerEvents {
  "user:join": (
    username: string,
    callback: (response: {
      success: boolean;
      user?: User;
      error?: string;
    }) => void,
  ) => void;
  "grid:claim-cell": (
    cellId: string,
    callback: (response: { success: boolean; error?: string }) => void,
  ) => void;
}

// ============================================
// CONSTANTS
// ============================================

export const GRID_CONFIG: GridConfig = {
  rows: 10,
  cols: 10,
};

export const COOLDOWN_MS = 1000; // 1 second cooldown

export const USER_COLORS = [
  "#3b82f6", // Blue
  "#ef4444", // Red
  "#22c55e", // Green
  "#f59e0b", // Amber
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#6366f1", // Indigo
  "#14b8a6", // Teal
] as const;
