"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ExitButtonProps {
  onExit: () => void;
}

export function ExitButton({ onExit }: ExitButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleExitClick = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    onExit();
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <>
      {/* Exit Button */}
      <motion.button
        onClick={handleExitClick}
        className="flex items-center gap-2 px-3 py-1.5 bg-[#EF4444] text-white font-bold text-sm uppercase tracking-wide border-2 border-[#2D2A26]"
        style={{ boxShadow: "3px 3px 0px #2D2A26" }}
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
        <span>🚪</span>
        <span className="hidden sm:inline">Exit</span>
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
                className="bg-[#FFFEF9] border-4 border-[#2D2A26] overflow-hidden"
                style={{ boxShadow: "8px 8px 0px #2D2A26" }}
              >
                {/* Header */}
                <div 
                  className="bg-[#EF4444] px-6 py-4 text-center border-b-4 border-[#2D2A26]"
                >
                  <span className="text-3xl">⚠️</span>
                  <h2 
                    className="text-xl font-black text-white uppercase tracking-tight mt-2"
                    style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.2)" }}
                  >
                    Leave Game?
                  </h2>
                </div>

                {/* Content */}
                <div className="p-6 bg-[#FDF6E3]">
                  <p className="text-[#4A4640] text-center mb-6">
                    Are you sure you want to exit? Your claimed cells will remain, but you&apos;ll need to rejoin to continue playing.
                  </p>

                  <div className="flex gap-3">
                    {/* Cancel Button */}
                    <motion.button
                      onClick={handleCancel}
                      className="flex-1 py-3 px-4 bg-[#FFFEF9] border-3 border-[#2D2A26]
                               text-[#2D2A26] font-bold uppercase tracking-wide"
                      style={{ 
                        boxShadow: "4px 4px 0px #2D2A26",
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
                      Stay
                    </motion.button>

                    {/* Confirm Exit Button */}
                    <motion.button
                      onClick={handleConfirm}
                      className="flex-1 py-3 px-4 bg-[#EF4444] border-3 border-[#2D2A26]
                               text-white font-bold uppercase tracking-wide"
                      style={{ 
                        boxShadow: "4px 4px 0px #2D2A26",
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
                      Exit
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