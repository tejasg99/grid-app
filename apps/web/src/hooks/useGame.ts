"use client";

import { useEffect, useState, useCallback } from "react";
import { useSocket } from "./useSocket";
import type {
  GridState,
  User,
  GameInitData,
  CellClaimedData,
} from "@grid-app/shared";

interface GameState {
  grid: GridState | null;
  users: User[];
  currentUser: User | null;
  isJoined: boolean;
}

interface UseGameReturn extends GameState {
  isConnected: boolean;
  isConnecting: boolean;
  joinGame: (username: string) => Promise<boolean>;
  claimCell: (cellId: string) => Promise<{ success: boolean; error?: string }>;
  isOnCooldown: boolean;
}

export function useGame(): UseGameReturn {
  const { socket, isConnected, isConnecting, connect } = useSocket();

  const [gameState, setGameState] = useState<GameState>({
    grid: null,
    users: [],
    currentUser: null,
    isJoined: false,
  });

  const [isOnCooldown, setIsOnCooldown] = useState(false);

  // Setup socket event listeners
  useEffect(() => {
    // Handle game initialization
    function handleGameInit(data: GameInitData) {
      console.log("🎮 Game initialized:", data);
      setGameState({
        grid: data.grid,
        users: data.users,
        currentUser: data.currentUser,
        isJoined: true,
      });
    }

    // Handle cell claimed by any user
    function handleCellClaimed(data: CellClaimedData) {
      console.log("🎯 Cell claimed:", data);
      setGameState((prev) => {
        if (!prev.grid) return prev;

        // Update the cell in grid
        const updatedCells = {
          ...prev.grid.cells,
          [data.cell.id]: data.cell,
        };

        // Update user in users list
        const updatedUsers = prev.users.map((u) =>
          u.id === data.user.id ? data.user : u,
        );

        // Update current user if it's them
        const updatedCurrentUser =
          prev.currentUser?.id === data.user.id ? data.user : prev.currentUser;

        return {
          ...prev,
          grid: { ...prev.grid, cells: updatedCells },
          users: updatedUsers,
          currentUser: updatedCurrentUser,
        };
      });
    }

    // Handle new user joining
    function handleUserJoined(user: User) {
      console.log("👤 User joined:", user);
      setGameState((prev) => ({
        ...prev,
        users: [...prev.users.filter((u) => u.id !== user.id), user],
      }));
    }

    // Handle user leaving
    function handleUserLeft(userId: string) {
      console.log("👋 User left:", userId);
      setGameState((prev) => ({
        ...prev,
        users: prev.users.filter((u) => u.id !== userId),
      }));
    }

    // Handle users list update
    function handleUsersUpdate(users: User[]) {
      setGameState((prev) => ({
        ...prev,
        users,
        currentUser: prev.currentUser
          ? users.find((u) => u.id === prev.currentUser?.id) || prev.currentUser
          : null,
      }));
    }

    // Handle errors
    function handleError(message: string) {
      console.error("🔴 Socket error:", message);
    }

    socket.on("game:init", handleGameInit);
    socket.on("grid:cell-claimed", handleCellClaimed);
    socket.on("user:joined", handleUserJoined);
    socket.on("user:left", handleUserLeft);
    socket.on("users:update", handleUsersUpdate);
    socket.on("error", handleError);

    return () => {
      socket.off("game:init", handleGameInit);
      socket.off("grid:cell-claimed", handleCellClaimed);
      socket.off("user:joined", handleUserJoined);
      socket.off("user:left", handleUserLeft);
      socket.off("users:update", handleUsersUpdate);
      socket.off("error", handleError);
    };
  }, [socket]);

  // Join game with username
  const joinGame = useCallback(
    async (username: string): Promise<boolean> => {
      return new Promise((resolve) => {
        // If not connected, connect first then join
        if (!socket.connected) {
          const handleConnect = () => {
            socket.off("connect", handleConnect);
            socket.emit(
              "user:join",
              username,
              (response: { success: boolean; user?: User; error?: string }) => {
                if (response.success) {
                  console.log("✅ Joined game successfully");
                } else {
                  console.error("❌ Failed to join:", response.error);
                }
                resolve(response.success);
              },
            );
          };
          socket.on("connect", handleConnect);
          connect();
          return;
        }
        // Already connected, emit join directly
        socket.emit(
          "user:join",
          username,
          (response: { success: boolean; user?: User; error?: string }) => {
            if (response.success) {
              console.log("✅ Joined game successfully");
            } else {
              console.error("❌ Failed to join:", response.error);
            }
            resolve(response.success);
          },
        );
      });
    },
    [socket, connect],
  );

  // Claim a cell
  const claimCell = useCallback(
    async (cellId: string): Promise<{ success: boolean; error?: string }> => {
      return new Promise((resolve) => {
        if (!socket.connected) {
          resolve({ success: false, error: "Not connected" });
          return;
        }

        if (isOnCooldown) {
          resolve({
            success: false,
            error: "Please wait before claiming another cell",
          });
          return;
        }

        socket.emit(
          "grid:claim-cell",
          cellId,
          (response: { success: boolean; error?: string }) => {
            if (response.success) {
              // Start cooldown
              setIsOnCooldown(true);
              setTimeout(() => setIsOnCooldown(false), 1000);
            }
            resolve(response);
          },
        );
      });
    },
    [socket, isOnCooldown],
  );

  return {
    ...gameState,
    isConnected,
    isConnecting,
    joinGame,
    claimCell,
    isOnCooldown,
  };
}
