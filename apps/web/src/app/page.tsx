"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/hooks/useGame";
import { UsernameModal } from "@/components/UsernameModal";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { ExitButton } from "@/components/ExitButton";
import { ResetGridButton } from "@/components/ResetGridButton";
import { Grid } from "@/components/Grid";
import { Sidebar } from "@/components/Sidebar";

export default function Home() {
  const {
    grid,
    users,
    currentUser,
    isJoined,
    isConnected,
    isConnecting,
    joinGame,
    claimCell,
    unclaimCell,
    resetGrid,
    exitGame,
    isOnCooldown,
  } = useGame();

  const [isJoining, setIsJoining] = useState(false);

  const handleJoinGame = async (username: string) => {
    setIsJoining(true);
    try {
      const success = await joinGame(username);
      if (!success) {
        console.error("Failed to join game");
      }
    } catch (error) {
      console.error("Error joining game:", error);
    } finally {
      setIsJoining(false);
    }
  };

  const handleCellClaim = async (cellId: string) => {
    const result = await claimCell(cellId);
    if (!result.success && result.error) {
      console.log("Claim failed:", result.error);
    }
  };

  const handleCellUnclaim = async (cellId: string) => {
    const result = await unclaimCell(cellId);
    if (!result.success && result.error) {
      console.log("Unclaim failed:", result.error);
    }
  };

  const handleResetGrid = async () => {
    const result = await resetGrid();
    if (!result.success && result.error) {
      console.log("Reset failed:", result.error);
    }
  };

  const handleExit = () => {
    exitGame();
  };

  return (
    <main className="min-h-screen bg-[#F5E6D3]">
      {/* Username Modal */}
      <UsernameModal
        isOpen={!isJoined}
        isLoading={isJoining || isConnecting}
        onSubmit={handleJoinGame}
      />

      {/* Main Game UI (shown after joining) */}
      {isJoined && (
        <div className="h-screen flex flex-col">
          {/* Header */}
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="shrink-0 border-b-2 border-[#2D2A26] bg-[#FFFEF9]"
            style={{ boxShadow: "0 4px 0 #2D2A26" }}
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              {/* Left: Logo */}
              <div className="flex items-center gap-3">
                <motion.span
                  className="text-2xl sm:text-3xl"
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  🎮
                </motion.span>
                <h1
                  className="text-xl sm:text-2xl font-black text-[#2D2A26] uppercase tracking-tight"
                  style={{ textShadow: "2px 2px 0px #D4C4B0" }}
                >
                  Grid Clash
                </h1>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-3">
                <ConnectionStatus
                  isConnected={isConnected}
                  isConnecting={isConnecting}
                />
                <ResetGridButton onReset={handleResetGrid} />
                <ExitButton onExit={handleExit} />
              </div>
            </div>
          </motion.header>

          {/* Game Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Grid Area */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-auto">
              {grid ? (
                <Grid
                  grid={grid}
                  currentUser={currentUser}
                  isOnCooldown={isOnCooldown}
                  onCellClaim={handleCellClaim}
                  onCellUnclaim={handleCellUnclaim}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="text-4xl mb-4"
                  >
                    ⏳
                  </motion.div>
                  <p className="text-[#8B8078] font-semibold">
                    Loading grid...
                  </p>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <Sidebar
              currentUser={currentUser}
              users={users}
              isOnCooldown={isOnCooldown}
            />
          </div>

          {/* Mobile Stats Bar (visible on small screens) */}
          <div className="md:hidden border-t-2 border-[#2D2A26] bg-[#FFFEF9] p-3">
            <div className="flex items-center justify-between">
              {currentUser && (
                <>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 border-2 border-[#2D2A26] flex items-center justify-center text-white text-xs font-bold"
                      style={{
                        backgroundColor: currentUser.color,
                        boxShadow: "2px 2px 0px #2D2A26",
                      }}
                    >
                      {currentUser.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-[#2D2A26]">
                      {currentUser.username}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-[#8B8078]">
                      <span className="font-black text-[#2D2A26]">
                        {currentUser.blockCount}
                      </span>{" "}
                      blocks
                    </span>
                    <span className="text-[#8B8078]">
                      <span className="font-black text-[#2D2A26]">
                        {users.length}
                      </span>{" "}
                      online
                    </span>
                  </div>
                </>
              )}
            </div>
            {isOnCooldown && (
              <div className="mt-2 text-center text-sm text-[#F59E0B] font-bold">
                ⏳ Cooldown active...
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
