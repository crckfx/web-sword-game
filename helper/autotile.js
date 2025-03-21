import { CELL_PX } from "../document.js";

function check_grid_neighbour_floor_alt(grid, x, y, match, z) {
    if (grid[y] && grid[y][x]) {
        if (grid[y][x].floor === match && grid[y][x].z === z) {
            return 1;
        }
    }
    return 0;
}

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

export function do_autotile(grid, x, y, match, z) {
    // check the 4 edges
    const up = check_grid_neighbour_floor_alt(grid, x, y - 1, match, z);
    const left = check_grid_neighbour_floor_alt(grid, x - 1, y, match, z);
    const right = check_grid_neighbour_floor_alt(grid, x + 1, y, match, z);
    const down = check_grid_neighbour_floor_alt(grid, x, y + 1, match, z);

    // new approach: init corners to false
    let left_up = 0
    let right_up = 0
    let left_down = 0;
    let right_down = 0;
    // check a corner if its condition is met
    if (up && right) right_up = check_grid_neighbour_floor_alt(grid, x + 1, y - 1, match, z);
    if (right && down) right_down = check_grid_neighbour_floor_alt(grid, x + 1, y + 1, match, z);
    if (down && left) left_down = check_grid_neighbour_floor_alt(grid, x - 1, y + 1, match, z);
    if (left && up) left_up = check_grid_neighbour_floor_alt(grid, x - 1, y - 1, match, z);

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





export function choose_4x4_texture_coords(grid, x, y, match) {
    let sx = 0;
    let sy = 0;

    let left = check_4x4_neighbour(grid, x - 1, y, match);
    let up = check_4x4_neighbour(grid, x, y - 1, match);
    let right = check_4x4_neighbour(grid, x + 1, y, match);
    let down = check_4x4_neighbour(grid, x, y + 1, match);

    if (!up && down) sy = 0;
    else if (up && down) sy = 1;
    else if (up && !down) sy = 2;
    else if (!up && !down) sy = 3;

    if (!left && right) sx = 0;
    else if (left && right) sx = 1;
    else if (left && !right) sx = 2;
    else if (!left && !right) sx = 3;

    return {
        x: sx * CELL_PX,
        y: sy * CELL_PX
    };

    function check_4x4_neighbour(grid, x, y, match) {
        if (grid[y] && grid[y][x]) {
            if (grid[y][x].occupant === match) {
                return match;
            }
        }
        return null;
    }
}
