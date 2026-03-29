"use client";

import { useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Cell } from "./Cell";
import type { GridState, User } from "@grid-app/shared";

interface GridProps {
  grid: GridState;
  currentUser: User | null;
  isOnCooldown: boolean;
  onCellClaim: (cellId: string) => void;
  onCellUnclaim: (cellId: string) => void;
}

export function Grid({
  grid,
  currentUser,
  isOnCooldown,
  onCellClaim, 
  onCellUnclaim
}: GridProps) {
  const { rows, cols } = grid.config;

  // Memoize the sorted cells array
  const sortedCells = useMemo(() => {
    const cells = Object.values(grid.cells);
    // Sort by row then column for consistent rendering
    return cells.sort((a, b) => {
      const [aRow, aCol] = a.id.split("-").map(Number);
      const [bRow, bCol] = b.id.split("-").map(Number);
      if (aRow !== bRow) return aRow - bRow;
      return aCol - bCol;
    });
  }, [grid.cells]);

  // Memoized claim unclaim handlers
  const handleClaim = useCallback(
    (cellId: string) => {
      onCellClaim(cellId);
    },
    [onCellClaim]
  );

  const handleUnclaim = useCallback(
    (cellId: string) => {
      onCellUnclaim(cellId);
    },
    [onCellUnclaim]
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center gap-6 w-full h-full justify-center"
    >
      {/* Grid Container */}
      <div
        className="p-3 sm:p-4 md:p-6 bg-[#FFFEF9] border-3 border-[#323130] rounded-sm"
        style={{
          boxShadow: "6px 6px 8px #323130",
        }}
      >
        <div
          className="grid gap-1 sm:gap-1.5 md:gap-2"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            // Make cells fill available space - each cell is 40-60px
            width: "min(70vw, 600px)",
            height: "min(70vw, 600px)",
          }}
        >
          {sortedCells.map((cell) => (
            <Cell
              key={cell.id}
              cell={cell}
              isOwn={cell.ownerId === currentUser?.id}
              isOnCooldown={isOnCooldown}
              onClaim={handleClaim}
              onUnclaim={handleUnclaim}
            />
          ))}
        </div>
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center space-y-1"
      >
        <p className="text-[#4A4640] font-medium text-sm sm:text-base">
          Click {" "}
          <span
            className="inline-block w-5 h-5 rounded-sm bg-[#FFFEF9] border-2 border-[#2D2A26] align-middle mx-1"
            style={{ boxShadow: "2px 2px 0px #2D2A26" }}
          />
          {" "}to claim • Click your own cell to unclaim
        </p>
      </motion.div>
    </motion.div>
  );
}
