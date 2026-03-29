// Socket event names - keeps everything consistent
export const SOCKET_EVENTS = {
  // Client -> Server
  USER_JOIN: "user:join",
  GRID_CLAIM_CELL: "grid:claim-cell",
  GRID_UNCLAIM_CELL: "grid:unclaim-cell",
  GRID_RESET_REQUEST: "grid:reset-request",

  // Server -> Client
  GAME_INIT: "game:init",
  GRID_CELL_CLAIMED: "grid:cell-claimed",
  GRID_CELL_UNCLAIMED: "grid:cell-unclaimed",
  GRID_RESET_COMPLETE: "grid:reset-complete",
  USER_JOINED: "user:joined",
  USER_LEFT: "user:left",
  USERS_UPDATE: "users:update",
  ERROR: "error",
} as const;