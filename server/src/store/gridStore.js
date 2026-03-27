// In memory grid store
export const grid = {};

export const claimCell = (cellId, userId, color) => {
    // ignore if already claimed
    if(grid[cellId]) return null;

    const cellData = { userId, color };

    grid[cellId] = cellData;

    return cellData;
}