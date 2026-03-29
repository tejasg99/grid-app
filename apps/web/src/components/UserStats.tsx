"use client";

import { motion } from "framer-motion";
import type { User } from "@grid-app/shared";

interface UserStatsProps {
  user: User;
}

export function UserStats({ user }: UserStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[#FFFEF9] border-3 border-[#2D2A26] p-4"
      style={{
        boxShadow: "5px 5px 0px #2D2A26",
        borderWidth: "3px",
      }}
    >
      <h2 className="text-xs font-bold text-[#8B8078] uppercase tracking-widest mb-4">
        Your Stats
      </h2>

      <div className="flex items-center gap-4">
        {/* Avatar */}
        <motion.div
          className="w-14 h-14 flex items-center justify-center text-white text-xl font-black border-3 border-[#2D2A26]"
          style={{
            backgroundColor: user.color,
            boxShadow: `4px 4px 0px #2D2A26, 0 0 20px ${user.color}60`,
            borderWidth: "3px",
          }}
          whileHover={{ scale: 1.05 }}
        >
          {user.username.charAt(0).toUpperCase()}
        </motion.div>

        {/* Info */}
        <div className="flex-1">
          <p className="font-bold text-lg" style={{ color: user.color }}>
            {user.username}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-black text-[#2D2A26]">
              {user.blockCount}
            </span>
            <span className="text-sm text-[#8B8078] font-medium">
              blocks claimed
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
