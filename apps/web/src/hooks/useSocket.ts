"use client";

import { useEffect, useState, useCallback} from "react";
import { getSocket, type TypedSocket } from "@/lib/socket";

interface UseSocketReturn {
  socket: TypedSocket;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => void;
  disconnect: () => void;
}

export function useSocket(): UseSocketReturn {
  // 1. Get the socket instance lazily
  const [socket] = useState(() => getSocket());

  // 2. Initialize connection state based on the actual socket status
  // This prevents the need to "sync" inside useEffect on mount.
  const [isConnected, setIsConnected] = useState(() => socket.connected);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // 3. Only define listeners here for FUTURE changes (events)
    function onConnect() {
      console.log("✅ Socket connected:", socket.id);
      setIsConnected(true);
      setIsConnecting(false);
    }

    function onDisconnect(reason: string) {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
      setIsConnecting(false);
    }

    function onConnectError(error: Error) {
      console.error("🔴 Socket connection error:", error.message);
      setIsConnecting(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    // REMOVED: if (socket.connected) setIsConnected(true);
    // Because it's already handled in the useState initializer above.

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
    };
  }, [socket]);

  const connect = useCallback(() => {
    if (!socket.connected) {
      setIsConnecting(true);
      socket.connect();
    }
  }, [socket]);

  const disconnect = useCallback(() => {
    if(socket.connected) {
      socket.disconnect();
    }
    setIsConnected(false);
    setIsConnecting(false);
  }, [socket]);

  return {
    socket,
    isConnected,
    isConnecting,
    connect,
    disconnect,
  };
}
