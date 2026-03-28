"use client";

import { useState } from "react";
import { useGame } from "@/hooks/useGame";
import { UsernameModal } from "@/components/UsernameModal";
import { ConnectionStatus } from "@/components/ConnectionStatus";

export default function Home() {
  const {
    grid,
    users,
    currentUser,
    isJoined,
    isConnected,
    isConnecting,
    joinGame,
    // claimCell,
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

  return (
    <main className="min-h-screen bg-slate-900">
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
          <header className="shrink-0 border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎮</span>
                <h1 className="text-xl font-bold text-white">Grid Clash</h1>
              </div>
              <ConnectionStatus
                isConnected={isConnected}
                isConnecting={isConnecting}
              />
            </div>
          </header>

          {/* Game Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Grid Area */}
            <div className="flex-1 flex items-center justify-center p-4 md:p-8">
              <div className="text-center">
                <p className="text-slate-400 mb-4">
                  Grid will be rendered here
                </p>
                <p className="text-slate-500 text-sm">
                  {grid
                    ? `${Object.keys(grid.cells).length} cells loaded`
                    : "Loading grid..."}
                </p>
                {currentUser && (
                  <p className="text-slate-400 mt-4">
                    Playing as:{" "}
                    <span
                      className="font-semibold"
                      style={{ color: currentUser.color }}
                    >
                      {currentUser.username}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="w-72 shrink-0 border-l border-slate-700 bg-slate-800/30 p-4 overflow-y-auto hidden md:block">
              {/* User Stats */}
              <div className="bg-slate-800 rounded-xl p-4 mb-4 border border-slate-700">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Your Stats
                </h2>
                {currentUser && (
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: currentUser.color }}
                    >
                      {currentUser.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {currentUser.username}
                      </p>
                      <p className="text-sm text-slate-400">
                        {currentUser.blockCount} blocks claimed
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Online Users */}
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Online ({users.length})
                </h2>
                <ul className="space-y-2">
                  {users.map((user) => (
                    <li
                      key={user.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: user.color }}
                      />
                      <span
                        className={
                          user.id === currentUser?.id
                            ? "text-white font-medium"
                            : "text-slate-300"
                        }
                      >
                        {user.username}
                        {user.id === currentUser?.id && (
                          <span className="text-slate-500 ml-1">(you)</span>
                        )}
                      </span>
                      <span className="text-slate-500 ml-auto">
                        {user.blockCount}
                      </span>
                    </li>
                  ))}
                  {users.length === 0 && (
                    <li className="text-slate-500 text-sm">No users online</li>
                  )}
                </ul>
              </div>

              {/* Cooldown Indicator */}
              {isOnCooldown && (
                <div className="mt-4 bg-amber-500/20 border border-amber-500/50 rounded-xl p-3 text-center">
                  <p className="text-amber-400 text-sm">
                    ⏳ Cooldown active...
                  </p>
                </div>
              )}
            </aside>
          </div>
        </div>
      )}
    </main>
  );
}
