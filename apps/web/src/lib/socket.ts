import { io, Socket } from "socket.io-client";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from "@grid-app/shared";

// Typed socket instance
export type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

// Socket URL from environment
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

// Singleton socket instance
let socket: TypedSocket | null = null;

export function getSocket(): TypedSocket {
  if (!socket) {
    console.log("🔌 Creating new socket connection to:", SOCKET_URL);
    socket = io(SOCKET_URL, {
      autoConnect: false, // We'll connect manually after username is set
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });
  }
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    console.log("🔌 Disconnecting socket...");
    socket.disconnect();
    socket = null; // Clear the instance so a new one is created on reconnect
  }
}