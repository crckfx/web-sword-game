export function check_tree_cell(grid, x, y, match) {
    if (!grid[y] || !grid[y][x]) {
        return false;
    }

    // check cell above
    if (grid[y - 1] && grid[y - 1][x]) {
        const cell = grid[y - 1][x];
        if (cell.occupant !== match) return false;
    }

    return true;

}