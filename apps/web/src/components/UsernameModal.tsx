"use client";

import { useState, SubmitEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UsernameModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onSubmit: (username: string) => void;
}

export function UsernameModal({
  isOpen,
  isLoading,
  onSubmit,
}: UsernameModalProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError("Please enter a username");
      return;
    }

    if (trimmedUsername.length < 2) {
      setError("Username must be at least 2 characters");
      return;
    }

    if (trimmedUsername.length > 20) {
      setError("Username must be less than 20 characters");
      return;
    }

    setError("");
    onSubmit(trimmedUsername);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-neutral-200 backdrop-blur-sm p-2"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20, rotate: -2 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="w-full max-w-md"
          >
            <div
              className="bg-[#e0e0e0] border-2 rounded-lg border-[#2D2A26] overflow-hidden"
              style={{ boxShadow: "2px 4px 0px #2D2A26" }}
            >
              {/* Header */}
              <div
                className="bg-[#3B82F6] px-6 py-10 text-center border-b-2 border-[#2D2A26]"
                style={{ boxShadow: "inset 0 4px 0 rgba(0,0,0,0.1)" }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", damping: 10 }}
                  className="text-5xl mb-3"
                >
                  🎮
                </motion.div>
                <h1
                  className="text-3xl font-black text-white uppercase tracking-tight leading-none"
                  style={{ textShadow: "3px 3px 0px rgba(0,0,0,0.2)" }}
                >
                  Grid Clash
                </h1>
                <p className="text-blue-100 mt-2 font-medium tracking-wider">
                  Claim cells. Compete in real-time!
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="p-8 flex flex-col bg-[#FDF6E3] gap-2.5"
              >
                <div className="flex flex-col gap-3">
                  <label
                    htmlFor="username"
                    className="text-sm font-bold text-[#2D2A26] tracking-wide"
                  >
                    Choose your name
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter your name..."
                    disabled={isLoading}
                    autoFocus
                    className="w-full px-4 py-3 rounded-sm bg-[#FFFEF9] border-3 border-[#2D2A26] text-[#2D2A26] placeholder-[#8B8078] font-semibold focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-100"
                    style={{
                      boxShadow: "2px 2px 0px #2D2A26",
                      borderWidth: "2px",
                    }}
                    maxLength={20}
                  />
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[#EF4444] text-sm mt-2 font-semibold flex items-center gap-1"
                    >
                      <span>⚠️</span> {error}
                    </motion.p>
                  )}
                </div>
                <div className="flex justify-center">
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#22C55E] border-3 rounded-sm border-[#2D2A26] text-white font-black text-lg uppercase  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-100 cursor-pointer"
                    style={{
                      boxShadow: "2px 2px 1px #2D2A26",
                      borderWidth: "1px",
                      textShadow: "2px 2px 0px rgba(0,0,0,0.2)",
                    }}
                    whileHover={{
                      x: -2,
                      y: -2,
                      boxShadow: "7px 7px 0px #2D2A26",
                    }}
                    whileTap={{
                      x: 2,
                      y: 2,
                      boxShadow: "3px 3px 0px #2D2A26",
                    }}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-3">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="inline-block text-xl"
                        >
                          ⚡
                        </motion.span>
                        Joining...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Join Game
                        <span className="text-xl">🚀</span>
                      </span>
                    )}
                  </motion.button>                  
                </div>


                <div className="flex justify-center items-center text-xs text-neutral-600 h-6">
                  💡 Click empty cells to claim them. First come, first served!
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
