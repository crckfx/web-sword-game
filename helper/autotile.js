import { check_grid_neighbour_floor } from "./grid.js";

// the array for the textures we downloaded (https://opengameart.org/content/32x32-floor-tiles)
const some_layout_array = [
    28, 124, 112, 16, 247, 223, 125,
    31, 255, 241, 17, 253, 127, 95,
    7, 199, 193, 1, 93, 117, 245,
    4, 68, 64, 0, 87, 213, 215,
    23, 209, 116, 92, 20, 84, 80,
    29, 113, 197, 71, 21, 85, 81,
    null, null, 221, 119, 5, 69, 65
];

// turn an array index into XY coords (assuming 7x7 total)
function indexToCoords(index) {
    return { x: index % 7, y: Math.floor(index / 7) };
}
// lookup a value index and return its XY coords
function findValueCoords(value, table) {
    const index = table.indexOf(value);
    return index !== null ? indexToCoords(index) : null;
}

export function do_autotile(grid, x, y, match) {
    // check the 4 edges
    const up = check_grid_neighbour_floor(grid, x, y - 1, match);
    const left = check_grid_neighbour_floor(grid, x - 1, y, match);
    const right = check_grid_neighbour_floor(grid, x + 1, y, match);
    const down = check_grid_neighbour_floor(grid, x, y + 1, match);

    // new approach: init corners to false
    let left_up = 0
    let right_up = 0
    let left_down = 0;
    let right_down = 0;
    // check a corner if its condition is met
    if (up && right) right_up = check_grid_neighbour_floor(grid, x + 1, y - 1, match);
    if (right && down) right_down = check_grid_neighbour_floor(grid, x + 1, y + 1, match);
    if (down && left) left_down = check_grid_neighbour_floor(grid, x - 1, y + 1, match);
    if (left && up) left_up = check_grid_neighbour_floor(grid, x - 1, y - 1, match);

    // use summing logic from (https://www.boristhebrave.com/permanent/24/06/cr31/stagecast/wang/blob.html)
    const sum =
        0
        + up
        + right_up * 2
        + right * 4
        + right_down * 8
        + down * 16
        + left_down * 32
        + left * 64
        + left_up * 128;

    const otherCoords = findValueCoords(sum, some_layout_array);

    // log unexpected / error
    if (otherCoords === null) {
        console.log(`coords for cell at '${x}, ${y}' are ${otherCoords.x}, ${otherCoords.y}`);
    }

    return otherCoords;
}
