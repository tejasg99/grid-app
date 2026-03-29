"use client";

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Cell as CellType } from "@grid-app/shared";

interface CellProps {
  cell: CellType;
  isOwn: boolean;
  isOnCooldown: boolean;
  onClaim: (cellId: string) => void;
  onUnclaim: (cellId: string) => void
}

// Memoized to prevent unnecessary re-renders
export const Cell = memo(function Cell({
  cell,
  isOwn,
  isOnCooldown,
  onClaim,
  onUnclaim,
}: CellProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [justChanged, setJustChanged] = useState(false);
  
  const isClaimed = cell.ownerId !== null;
  const canClaim = !isClaimed && !isOnCooldown;
  const canUnclaim = isOwn && !isOnCooldown;

  const handleClick = () => {
    if (canClaim) {
      onClaim(cell.id);
      setJustChanged(true);
      setTimeout(() => setJustChanged(false), 500);
    } else if (canUnclaim) {
      onUnclaim(cell.id);
      setJustChanged(true);
      setTimeout(() => setJustChanged(false), 500);
    }
  };

  // Generate glow shadow based on owner color
  const getGlowShadow = (color: string) => {
    return `0 0 15px ${color}90, 0 0 25px ${color}50`;
  };

  const isClickable = canClaim || canUnclaim;

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative w-full h-full
        border-2 rounded-md border-[#2D2A26]
        transition-colors duration-150
        ${isClickable
          ? "cursor-pointer" 
          : isClaimed 
            ? "cursor-not-allowed" 
            : "cursor-not-allowed opacity-60"
        }
        ${!isClaimed ? "bg-[#FFFEF9]" : ""}
      `}
      style={{
        backgroundColor: isClaimed ? cell.ownerColor || undefined : undefined,
        boxShadow: isClaimed 
          ? `${getGlowShadow(cell.ownerColor!)}, 3px 3px 0px #2D2A26`
          : isHovered && canClaim 
            ? "5px 5px 0px #2D2A26" 
            : "3px 3px 0px #2D2A26",
      }}
      animate={{
        x: isHovered && isClickable ? -3 : 0,
        y: isHovered && isClickable ? -3 : 0,
        scale: justChanged ? [1, 1.2, 1] : 1,
      }}
      transition={{
        duration: 0.15,
        scale: { duration: 0.3 }
      }}
      whileTap={isClickable ? { 
        x: 2, 
        y: 2,
        scale: 0.95,
      } : {}}
      aria-label={
        isClaimed 
          ? isOwn 
            ? `Your cell - click to unclaim`
            : `Claimed by ${cell.ownerName}`
          : isOnCooldown
            ? "Cooldown active"
            : `Click to claim cell ${cell.id}`
      }
    >
      {/* Own cell indicator with unclaim hint */}
      <AnimatePresence>
        {isClaimed && isOwn && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            {isHovered ? (
              // Show X on hover to indicate unclaim
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                className="text-white/80 font-bold text-lg"
                style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
              >
                ✕
              </motion.div>
            ) : (
              // Show dot when not hovered
              <motion.div 
                className="w-3 h-3 bg-white/60 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 0.8, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action animation burst */}
      <AnimatePresence>
        {justChanged && (
          <motion.div
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-white rounded-full pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Hover tooltip */}
      <AnimatePresence>
        {isClaimed && isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 z-30
                       bg-[#2D2A26] text-white text-xs px-3 py-1.5 
                       whitespace-nowrap border-2 border-[#2D2A26]
                       font-bold pointer-events-none"
            style={{
              boxShadow: "3px 3px 0px rgba(0,0,0,0.3)",
            }}
          >
            <span 
              className="inline-block w-2 h-2 rounded-full mr-1.5"
              style={{ backgroundColor: cell.ownerColor || "#888" }}
            />
            {isOwn ? (
              <span>Click to unclaim</span>
            ) : (
              <span>{cell.ownerName}</span>
            )}
            {/* Arrow */}
            <div 
              className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-0 h-0
                         border-l-[6px] border-l-transparent
                         border-r-[6px] border-r-transparent
                         border-t-[6px] border-t-[#2D2A26]"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
});
