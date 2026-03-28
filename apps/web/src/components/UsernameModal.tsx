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
          // Ensure this covers the whole screen and has a high Z-index
          className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-md bg-slate-800 rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
          >
            {/* Header Section */}
            <div className="bg-linear-to-br from-slate-700 to-slate-900 p-8 text-center border-b border-white/5">
              <div className="text-5xl mb-4">🎮</div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Welcome to Grid Clash
              </h1>
              <p className="text-slate-400 mt-2 text-sm">
                Claim cells, compete with others in real-time!
              </p>
            </div>

            {/* Form Section - Switched to Flex for better spacing control */}
            <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="username"
                  className="text-sm font-semibold text-slate-300 ml-1"
                >
                  Choose your username
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
                  className="w-full px-4 py-4 bg-slate-900/50 border border-slate-600 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                  maxLength={20}
                />
                {error && (
                  <p className="text-red-400 text-xs mt-1 ml-1">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
              >
                {isLoading ? "Joining..." : "Join Game 🚀"}
              </button>

              <p className="text-center text-[11px] text-slate-500 uppercase tracking-widest font-medium">
                First come, first served!
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
