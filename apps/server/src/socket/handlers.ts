import { Server, Socket } from "socket.io";
import { gridService } from "../services/grid.service.js";
import { userService } from "../services/user.service.js";
import { SOCKET_EVENTS } from "./events.js";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  User,
} from "../types/shared.js";

type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
type TypedServer = Server<ClientToServerEvents, ServerToClientEvents>;

export function setupSocketHandlers(io: TypedServer): void {
  io.on("connection", (socket: TypedSocket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Handle user joining the game
    socket.on(SOCKET_EVENTS.USER_JOIN, async (username, callback) => {
      try {
        console.log(`📝 User attempting to join: ${username} (${socket.id})`);

        // Create user
        const user = await userService.createUser(socket.id, username);

        // Get current game state
        const grid = await gridService.getGridState();

        // Get all users EXCEPT the current user for the users list
        // (current user will be sent separately as currentUser)
        const allUsers = await userService.getAllUsers();

        // Calculate user's block count from grid
        let blockCount = 0;
        for (const cell of Object.values(grid.cells)) {
          if (cell.ownerId === socket.id) {
            blockCount++;
          }
        }
        user.blockCount = blockCount;

        // Update user with the current block count
        await userService.updateUser(user);

        // Send init data to the joining user
        socket.emit(SOCKET_EVENTS.GAME_INIT, {
          grid,
          users: allUsers,
          currentUser: user,
        });

        // Broadcast to others that a new user joined (not to self)
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
        console.log(`🎯 Cell claim attempt: ${cellId} by ${socket.id}`);

        const user = await userService.getUser(socket.id);

        if (!user) {
          console.log(`❌ User not found: ${socket.id}`);
          callback({ success: false, error: "User not found. Please refresh." });
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
          console.log(`❌ Claim failed: ${result.error}`);
          callback({ success: false, error: result.error });
          return;
        }

        // Update user's block count
        const updatedUser = await userService.updateBlockCount(socket.id, 1);

        if (result.cell && updatedUser) {
          console.log(`✅ Cell ${cellId} claimed by ${user.username}. New block count: ${updatedUser.blockCount}`);

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
      } catch (error) {
        console.error("Error in grid:claim-cell:", error);
        callback({ success: false, error: "Failed to claim cell" });
      }
    });

    // Handle cell unclaim (toggle off)
    socket.on("grid:unclaim-cell", async (cellId, callback) => {
      try {
        console.log(`🔄 Cell unclaim attempt: ${cellId} by ${socket.id}`);
        
        const user = await userService.getUser(socket.id);
        
        if (!user) {
          console.log(`❌ User not found: ${socket.id}`);
          callback({ success: false, error: "User not found. Please refresh." });
          return;
        }

        // Attempt to unclaim the cell
        const result = await gridService.unclaimCell(cellId, user.id);

        if (!result.success) {
          console.log(`❌ Unclaim failed: ${result.error}`);
          callback({ success: false, error: result.error });
          return;
        }

        // Update user's block count (decrement)
        const updatedUser = await userService.updateBlockCount(socket.id, -1);

        if (result.cell && updatedUser) {
          console.log(`✅ Cell ${cellId} unclaimed by ${user.username}. New block count: ${updatedUser.blockCount}`);
          
          // Broadcast to ALL clients (including sender)
          io.emit("grid:cell-unclaimed", {
            cell: result.cell,
            user: updatedUser,
          });

          // Send updated users list to everyone
          const allUsers = await userService.getAllUsers();
          io.emit(SOCKET_EVENTS.USERS_UPDATE, allUsers);
        }

        callback({ success: true });
      } catch (error) {
        console.error("Error in grid:unclaim-cell:", error);
        callback({ success: false, error: "Failed to unclaim cell" });
      }
    });

    // Handle grid reset
    socket.on("grid:reset-request", async (callback) => {
      try {
        console.log(`🔄 Grid reset requested by ${socket.id}`);
        
        // Reset the grid
        const grid = await gridService.resetGrid();
        
        // Reset all users' block counts
        const allUsers = await userService.getAllUsers();
        for (const user of allUsers) {
          user.blockCount = 0;
          await userService.updateUser(user);
        }
        
        // Get updated users list
        const updatedUsers = await userService.getAllUsers();
        
        // Broadcast to ALL clients
        io.emit("grid:reset-complete", {
          grid,
          users: updatedUsers,
        });

        callback({ success: true });
        console.log(`✅ Grid reset complete`);
      } catch (error) {
        console.error("Error in grid:reset:", error);
        callback({ success: false, error: "Failed to reset grid" });
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
