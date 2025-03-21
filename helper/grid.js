import { Vector2 } from "../classes/Vector2.js";
import { CELL_PX } from "../document.js";

// cell => pixel
export function gridCells(n) {
    return CELL_PX * n;
}

// pixel => cell
export function cellCoords(pos) {
    return Math.round(pos / CELL_PX);
}

export function moveTowards(person, destinationPosition, speed) {
    let distanceToTravelX = destinationPosition.x - person.position.x;
    let distanceToTravelY = destinationPosition.y - person.position.y;

    let distance = Math.sqrt(distanceToTravelX ** 2 + distanceToTravelY ** 2);

    if (distance <= speed) {
        person.position.x = destinationPosition.x;
        person.position.y = destinationPosition.y;
    } else {
        let normalisedX = distanceToTravelX / distance;
        let normalisedY = distanceToTravelY / distance;
        person.position.x += normalisedX * speed;
        person.position.y += normalisedY * speed;

        distanceToTravelX = destinationPosition.x - person.position.x;
        distanceToTravelY = destinationPosition.y - person.position.y;
        distance = Math.sqrt(distanceToTravelX ** 2 + distanceToTravelY ** 2);
    }

    return distance;
}




export function compare_two_vec2(vecA, vecB) {
    // "on what side of vecB is vecA situated?"
    if (vecA.x > vecB.x) return 'right';
    if (vecA.x < vecB.x) return 'left';
    if (vecA.y < vecB.y) return 'up';
    if (vecA.y > vecB.y) return 'down';
    console.error('uhh the 2 vectors seem to have the same position?')
    return;
}

export function check_grid_neighbour_floor(grid, x, y, match) {
    if (grid[x] && grid[x][y]) {
        if (grid[x][y].floor === match) {
            return 1;
        }
    }
    return 0;
}