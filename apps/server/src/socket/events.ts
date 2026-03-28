// Socket event names - keeps everything consistent
export const SOCKET_EVENTS = {
  // Client -> Server
  USER_JOIN: "user:join",
  GRID_CLAIM_CELL: "grid:claim-cell",

  // Server -> Client
  GAME_INIT: "game:init",
  GRID_CELL_CLAIMED: "grid:cell-claimed",
  USER_JOINED: "user:joined",
  USER_LEFT: "user:left",
  USERS_UPDATE: "users:update",
  ERROR: "error",
} as const;
