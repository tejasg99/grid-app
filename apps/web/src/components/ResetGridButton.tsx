"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ResetGridButtonProps {
  onReset: () => void;
}

export function ResetGridButton({ onReset }: ResetGridButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetClick = () => {
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setIsResetting(true);
    try {
      onReset();
    } finally {
      setIsResetting(false);
      setShowConfirm(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <>
      {/* Reset Button */}
      <motion.button
        onClick={handleResetClick}
        className="flex justify-center items-center gap-2 w-20 bg-[#ffb637] text-white font-bold text-sm uppercase tracking-wide border-2 rounded-sm border-[#2D2A26]"
        style={{ boxShadow: "2px 2px 0px #2D2A26" }}
        whileHover={{ 
          x: -2, 
          y: -2,
          boxShadow: "5px 5px 0px #2D2A26",
        }}
        whileTap={{ 
          x: 1, 
          y: 1,
          boxShadow: "2px 2px 0px #2D2A26",
        }}
      >
        <span>🔄</span>
        <span className="hidden sm:inline">Reset</span>
      </motion.button>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D2A26]/80 backdrop-blur-sm"
            onClick={handleCancel}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="w-full max-w-sm mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className="bg-[#FFFEF9] border-3 rounded-sm border-[#2D2A26] overflow-hidden"
                style={{ boxShadow: "4px 4px 4px #2D2A26" }}
              >
                {/* Header */}
                <div 
                  className="bg-[#F59E0B] px-6 py-4 text-center border-b-4 border-[#2D2A26]"
                >
                  <span className="text-3xl">🔄</span>
                  <h2 
                    className="text-xl font-black text-white uppercase tracking-tight mt-2"
                    style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.2)" }}
                  >
                    Reset Grid?
                  </h2>
                </div>

                {/* Content */}
                <div className="p-6 bg-[#FDF6E3]">
                  <p className="text-[#4A4640] text-center mb-6">
                    This will clear <strong>ALL</strong> claimed cells for <strong>ALL</strong> players. Everyone will start fresh. Are you sure?
                  </p>

                  <div className="flex gap-3">
                    {/* Cancel Button */}
                    <motion.button
                      onClick={handleCancel}
                      disabled={isResetting}
                      className="flex-1 py-3 px-4 bg-[#FFFEF9] border-2 rounded-sm border-[#2D2A26]
                               text-[#2D2A26] font-bold uppercase tracking-wide
                               disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ 
                        boxShadow: "2px 2px 0px #2D2A26",
                        borderWidth: "3px",
                      }}
                      whileHover={{ 
                        x: -2, 
                        y: -2,
                        boxShadow: "6px 6px 0px #2D2A26",
                      }}
                      whileTap={{ 
                        x: 2, 
                        y: 2,
                        boxShadow: "2px 2px 0px #2D2A26",
                      }}
                    >
                      Cancel
                    </motion.button>

                    {/* Confirm Reset Button */}
                    <motion.button
                      onClick={handleConfirm}
                      disabled={isResetting}
                      className="flex-1 py-3 px-4 bg-[#F59E0B] border-2 rounded-sm border-[#2D2A26]
                               text-white font-bold uppercase tracking-wide
                               disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ 
                        boxShadow: "2px 2px 0px #2D2A26",
                        borderWidth: "3px",
                      }}
                      whileHover={{ 
                        x: -2, 
                        y: -2,
                        boxShadow: "6px 6px 0px #2D2A26",
                      }}
                      whileTap={{ 
                        x: 2, 
                        y: 2,
                        boxShadow: "2px 2px 0px #2D2A26",
                      }}
                    >
                      {isResetting ? (
                        <span className="flex items-center justify-center gap-2">
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            🔄
                          </motion.span>
                          Resetting...
                        </span>
                      ) : (
                        "Reset"
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}