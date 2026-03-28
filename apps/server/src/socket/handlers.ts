import { Server, Socket } from "socket.io";
import { gridService } from "../services/grid.service.js";
import { userService } from "../services/user.service.js";
import { SOCKET_EVENTS } from "./events.js";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  User,
} from "@grid-app/shared";

type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
type TypedServer = Server<ClientToServerEvents, ServerToClientEvents>;

export function setupSocketHandlers(io: TypedServer): void {
  io.on("connection", (socket: TypedSocket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Handle user joining the game
    socket.on(SOCKET_EVENTS.USER_JOIN, async (username, callback) => {
      try {
        // Create user
        const user = await userService.createUser(socket.id, username);

        // Get current game state
        const grid = await gridService.getGridState();
        const users = await userService.getAllUsers();

        // Calculate user's block count from grid
        let blockCount = 0;
        for (const cell of Object.values(grid.cells)) {
          if (cell.ownerId === socket.id) {
            blockCount++;
          }
        }
        user.blockCount = blockCount;

        // Send init data to the joining user
        socket.emit(SOCKET_EVENTS.GAME_INIT, {
          grid,
          users,
          currentUser: user,
        });

        // Broadcast to others that a new user joined
        socket.broadcast.emit(SOCKET_EVENTS.USER_JOINED, user);

        // Callback with success
        callback({ success: true, user });

        console.log(`👤 User joined: ${user.username} (${user.color})`);
      } catch (error) {
        console.error("Error in user:join:", error);
        callback({ success: false, error: "Failed to join game" });
      }
    });

    // Handle cell claim
    socket.on(SOCKET_EVENTS.GRID_CLAIM_CELL, async (cellId, callback) => {
      try {
        const user = await userService.getUser(socket.id);

        if (!user) {
          callback({
            success: false,
            error: "User not found. Please refresh.",
          });
          return;
        }

        // Attempt to claim the cell
        const result = await gridService.claimCell(
          cellId,
          user.id,
          user.username,
          user.color,
        );

        if (!result.success) {
          callback({ success: false, error: result.error });
          return;
        }

        // Update user's block count
        const updatedUser = await userService.updateBlockCount(socket.id, 1);

        if (result.cell && updatedUser) {
          // Broadcast to ALL clients (including sender)
          io.emit(SOCKET_EVENTS.GRID_CELL_CLAIMED, {
            cell: result.cell,
            user: updatedUser,
          });

          // Send updated users list to everyone
          const allUsers = await userService.getAllUsers();
          io.emit(SOCKET_EVENTS.USERS_UPDATE, allUsers);
        }

        callback({ success: true });
        console.log(`🎯 Cell ${cellId} claimed by ${user.username}`);
      } catch (error) {
        console.error("Error in grid:claim-cell:", error);
        callback({ success: false, error: "Failed to claim cell" });
      }
    });

    // Handle disconnection
    socket.on("disconnect", async () => {
      try {
        const user = await userService.getUser(socket.id);

        if (user) {
          await userService.removeUser(socket.id);

          // Broadcast to others that user left
          socket.broadcast.emit(SOCKET_EVENTS.USER_LEFT, socket.id);

          // Send updated users list
          const allUsers = await userService.getAllUsers();
          socket.broadcast.emit(SOCKET_EVENTS.USERS_UPDATE, allUsers);

          console.log(`👋 User disconnected: ${user.username}`);
        }
      } catch (error) {
        console.error("Error in disconnect:", error);
      }
    });
  });
}
