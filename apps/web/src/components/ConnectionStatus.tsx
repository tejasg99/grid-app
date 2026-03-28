"use client";

import { motion } from "framer-motion";

interface ConnectionStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
}

export function ConnectionStatus({ isConnected, isConnecting }: ConnectionStatusProps) {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={`w-2.5 h-2.5 rounded-full ${
          isConnected
            ? "bg-green-500"
            : isConnecting
            ? "bg-yellow-500"
            : "bg-red-500"
        }`}
        animate={
          isConnecting
            ? { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }
            : { scale: 1 }
        }
        transition={
          isConnecting
            ? { duration: 1, repeat: Infinity }
            : { duration: 0.2 }
        }
      />
      <span className="text-sm text-slate-400">
        {isConnected ? "Connected" : isConnecting ? "Connecting..." : "Disconnected"}
      </span>
    </div>
  );
}