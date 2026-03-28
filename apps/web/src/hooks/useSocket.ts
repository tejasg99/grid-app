"use client";

import { useEffect, useState, useCallback } from "react";
import { getSocket, disconnectSocket, type TypedSocket } from "@/lib/socket";

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
      setIsConnected(true);
      setIsConnecting(false);
    }

    function onDisconnect() {
      setIsConnected(false);
      setIsConnecting(false);
    }

    function onConnectError() {
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
    disconnectSocket();
    setIsConnected(false);
  }, []);

  return {
    socket,
    isConnected,
    isConnecting,
    connect,
    disconnect,
  };
}
