"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { User } from "@grid-app/shared";

interface OnlineUsersProps {
  users: User[];
  currentUserId: string | undefined;
}

export function OnlineUsers({ users, currentUserId }: OnlineUsersProps) {
  // Sort by block count descending
  const sortedUsers = [...users].sort((a, b) => b.blockCount - a.blockCount);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-[#FFFEF9] border-3 border-[#2D2A26] p-4"
      style={{
        boxShadow: "5px 5px 0px #2D2A26",
        borderWidth: "3px",
      }}
    >
      <h2 className="text-xs font-bold text-[#8B8078] uppercase tracking-widest mb-4 flex items-center justify-between">
        <span>Players Online</span>
        <span
          className="bg-[#2D2A26] text-white px-2 py-0.5 text-xs font-bold"
          style={{ boxShadow: "2px 2px 0px #8B8078" }}
        >
          {users.length}
        </span>
      </h2>

      <ul className="space-y-2 max-h-75 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {sortedUsers.map((user, index) => (
            <motion.li
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className={`
                flex items-center gap-3 p-2 border-2 border-[#2D2A26]
                ${user.id === currentUserId ? "bg-[#F5E6D3]" : "bg-white"}
              `}
              style={{ boxShadow: "2px 2px 0px #2D2A26" }}
            >
              {/* Rank */}
              <span className="text-xs font-bold text-[#8B8078] w-4">
                #{index + 1}
              </span>

              {/* Color indicator */}
              <div
                className="w-4 h-4 border-2 border-[#2D2A26] shrink-0"
                style={{
                  backgroundColor: user.color,
                  boxShadow: `0 0 8px ${user.color}80`,
                }}
              />

              {/* Name */}
              <span
                className={`flex-1 font-semibold truncate ${
                  user.id === currentUserId
                    ? "text-[#2D2A26]"
                    : "text-[#4A4640]"
                }`}
              >
                {user.username}
                {user.id === currentUserId && (
                  <span className="text-[#8B8078] font-normal ml-1">(you)</span>
                )}
              </span>

              {/* Block count */}
              <span
                className="font-black text-sm px-2 py-0.5 bg-[#2D2A26] text-white"
                style={{ boxShadow: "1px 1px 0px #8B8078" }}
              >
                {user.blockCount}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>

        {users.length === 0 && (
          <li className="text-[#8B8078] text-sm text-center py-4">
            No players online
          </li>
        )}
      </ul>
    </motion.div>
  );
}
