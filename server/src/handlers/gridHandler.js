import { grid, claimCell } from "../store/gridStore.js";

export const handleConnection = (io, socket) => {
    console.log("User Connected: ", socket.id);

    // Send current grid state
    socket.emit("init", grid);

    // Handle claim event
    socket.on("claim", ({ cellId, userId, color }) => {
        const result = claimCell(cellId, userId, color);

        if(result) {
            // broadcast update to all clients
            io.emit("update", {
                cellId,
                data: result,
            })
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.id);
    });
}