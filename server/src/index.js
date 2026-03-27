import express from "express";
import http from "http";
import cors from "cors";

import { initSocket } from "../src/config/socket.js";
import healthRoute from "./routes/health.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/", healthRoute);

// Http server
const server = http.createServer(app);

// Attach socket
initSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});