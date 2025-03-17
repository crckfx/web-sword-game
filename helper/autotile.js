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

// turn an array index into XY coords
function indexToCoords(index) {
    return { x: index % 7, y: Math.floor(index / 7) };
}
// lookup a value index and return its XY coords
function findValueCoords(value, table) {
    const index = table.indexOf(value);
    return index !== null ? indexToCoords(index) : null;
}

export function do_autotile(grid, x, y, match) {
    // const coords = new Vector2(7, 7); // intentionally out of bounds at set
    // check the 4 edges
    let up = check_grid_neighbour_floor(grid, x, y - 1, match);
    let left = check_grid_neighbour_floor(grid, x - 1, y, match);
    let right = check_grid_neighbour_floor(grid, x + 1, y, match);
    let down = check_grid_neighbour_floor(grid, x, y + 1, match);

    // new approach: init corners to false
    let left_up, right_up, left_down, right_down = false;
    // check a corner if its condition is met
    if (up && right) right_up = check_grid_neighbour_floor(grid, x + 1, y - 1, match);
    if (right && down) right_down = check_grid_neighbour_floor(grid, x + 1, y + 1, match);
    if (down && left) left_down = check_grid_neighbour_floor(grid, x - 1, y + 1, match);
    if (left && up) left_up = check_grid_neighbour_floor(grid, x - 1, y - 1, match);

    // start at 0 for summing
    let sum = 0;
    // use summing logic from (https://www.boristhebrave.com/permanent/24/06/cr31/stagecast/wang/blob.html)
    if (up) sum += 1;
    if (right_up) sum += 2;
    if (right) sum += 4;
    if (right_down) sum += 8;
    if (down) sum += 16;
    if (left_down) sum += 32;
    if (left) sum += 64;
    if (left_up) sum += 128;
    const otherCoords = findValueCoords(sum, some_layout_array);

    if (otherCoords === null) {
        console.log(`coords for cell at '${x}, ${y}' weighted ${weight} are ${otherCoords.x}, ${otherCoords.y}`);
        // coords.overwrite(1,1);
    }


    return otherCoords;

}
