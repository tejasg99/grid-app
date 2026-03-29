"use client";

import { motion } from "framer-motion";

interface CooldownIndicatorProps {
  isActive: boolean;
}

export function CooldownIndicator({ isActive }: CooldownIndicatorProps) {
  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-[#F59E0B] border-3 border-[#2D2A26] p-3 text-center"
      style={{ 
        boxShadow: "4px 4px 0px #2D2A26, 0 0 20px rgba(245, 158, 11, 0.4)",
        borderWidth: "3px",
      }}
    >
      <div className="flex items-center justify-center gap-2">
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-lg"
        >
          ⏳
        </motion.span>
        <span className="font-bold text-[#2D2A26] text-sm uppercase tracking-wide">
          Cooldown Active
        </span>
      </div>
    </motion.div>
  );
}