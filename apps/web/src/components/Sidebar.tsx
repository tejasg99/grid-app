"use client";

import { motion } from "framer-motion";
import type { User } from "@grid-app/shared";
import { UserStats } from "./UserStats";
import { OnlineUsers } from "./OnlineUsers";
import { CooldownIndicator } from "./CooldownIndicator";

interface SidebarProps {
  currentUser: User | null;
  users: User[];
  isOnCooldown: boolean;
}

export function Sidebar({ currentUser, users, isOnCooldown }: SidebarProps) {
  // Calculate some stats
  const totalCells = 100; // 10x10 grid
  const claimedCells = users.reduce((sum, u) => sum + u.blockCount, 0);
  const remainingCells = totalCells - claimedCells;

  return (
    <aside className="w-80 shrink-0 border-l-4 border-[#2D2A26] bg-[#FDF6E3] p-5 overflow-y-auto hidden md:flex flex-col gap-5">
      {/* User Stats */}
      {currentUser && <UserStats user={currentUser} />}

      {/* Cooldown Indicator */}
      <CooldownIndicator isActive={isOnCooldown} />

      {/* Grid Stats */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-[#FFFEF9] border-3 border-[#2D2A26] p-4"
        style={{
          boxShadow: "5px 5px 0px #2D2A26",
          borderWidth: "3px",
        }}
      >
        <h2 className="text-xs font-bold text-[#8B8078] uppercase tracking-widest mb-3">
          Grid Status
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-[#FDF6E3] border-2 border-[#D4C4B0]">
            <div className="text-2xl font-black text-[#22C55E]">
              {remainingCells}
            </div>
            <div className="text-xs text-[#8B8078] font-medium">Available</div>
          </div>
          <div className="text-center p-2 bg-[#FDF6E3] border-2 border-[#D4C4B0]">
            <div className="text-2xl font-black text-[#3B82F6]">
              {claimedCells}
            </div>
            <div className="text-xs text-[#8B8078] font-medium">Claimed</div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-3 bg-[#E8DCC8] border-2 border-[#2D2A26] overflow-hidden">
          <motion.div
            className="h-full bg-linear-to-r from-[#3B82F6] to-[#22C55E]"
            initial={{ width: 0 }}
            animate={{ width: `${(claimedCells / totalCells) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Online Users */}
      <OnlineUsers users={users} currentUserId={currentUser?.id} />

      {/* Game Info */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#FFFEF9] border-3 border-[#2D2A26] p-4 mt-auto"
        style={{
          boxShadow: "5px 5px 0px #2D2A26",
          borderWidth: "3px",
        }}
      >
        <h2 className="text-xs font-bold text-[#8B8078] uppercase tracking-widest mb-2">
          How to Play
        </h2>
        <ul className="text-sm text-[#4A4640] space-y-1.5">
          <li className="flex items-start gap-2">
            <span className="text-[#3B82F6]">▸</span>
            Click empty cells to claim
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#F59E0B]">▸</span>1 second cooldown between
            claims
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#EF4444]">▸</span>
            Claimed cells can&apos;t be stolen
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#22C55E]">▸</span>
            Compete for the most cells!
          </li>
        </ul>
      </motion.div>
    </aside>
  );
}
