"use client";

import { motion } from "framer-motion";

interface ConnectionStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
}

export function ConnectionStatus({
  isConnected,
  isConnecting,
}: ConnectionStatusProps) {
  const statusConfig = {
    connected: {
      color: "#22C55E",
      text: "Connected",
      shadow: "0 0 10px rgba(34, 197, 94, 0.5)",
    },
    connecting: {
      color: "#F59E0B",
      text: "Connecting...",
      shadow: "0 0 10px rgba(245, 158, 11, 0.5)",
    },
    disconnected: {
      color: "#EF4444",
      text: "Disconnected",
      shadow: "0 0 10px rgba(239, 68, 68, 0.5)",
    },
  };

  const status = isConnected
    ? "connected"
    : isConnecting
      ? "connecting"
      : "disconnected";

  const config = statusConfig[status];

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 bg-[#FFFEF9] border-2 border-[#2D2A26]"
      style={{ boxShadow: "3px 3px 0px #2D2A26" }}
    >
      <motion.div
        className="w-3 h-3 rounded-full"
        style={{
          backgroundColor: config.color,
          boxShadow: config.shadow,
        }}
        animate={
          isConnecting
            ? { scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }
            : { scale: 1 }
        }
        transition={
          isConnecting ? { duration: 1, repeat: Infinity } : { duration: 0.2 }
        }
      />
      <span className="text-sm font-semibold text-[#2D2A26]">
        {config.text}
      </span>
    </div>
  );
}
