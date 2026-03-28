import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

import { gridService } from "./services/grid.service.js";
import { setupSocketHandlers } from "./socket/handlers.js";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from "@grid-app/shared";

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());

// Socket.io setup with typed events
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  // Performance optimizations
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API endpoint to reset grid (useful for testing)
app.post("/api/reset-grid", async (req, res) => {
  try {
    await gridService.resetGrid();
    res.json({ success: true, message: "Grid reset successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to reset grid" });
  }
});

// Setup socket handlers
setupSocketHandlers(io);

// Start server
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Initialize grid in Redis
    await gridService.initializeGrid();

    httpServer.listen(PORT, () => {
      console.log(`
🚀 Server is running!
📡 HTTP: http://localhost:${PORT}
🔌 WebSocket: ws://localhost:${PORT}
🏥 Health: http://localhost:${PORT}/health
      `);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
