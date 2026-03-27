import { Server } from "socket.io";
import { handleConnection } from "../handlers/gridHandler.js";

export const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*", // frontend restriction to be added later
        },
    });

    io.on("connection", (socket) => {
        handleConnection(io, socket);
    });

    return io;
}