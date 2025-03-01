import { Vector2 } from "../classes/Vector2.js";

export function gridCells(n) {
    return 16 * n;
}

export function moveTowards(person, destinationPosition, speed) {
    let distanceToTravelX = destinationPosition.x - person.position.x;
    let distanceToTravelY = destinationPosition.y - person.position.y;
    
    let distance = Math.sqrt(distanceToTravelX**2 + distanceToTravelY**2);

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
        distance = Math.sqrt(distanceToTravelX**2 + distanceToTravelY**2);
    }

    return distance;
}

export const isSpaceFree = (walls, x, y) => {
    const str = `${x}.${y}`;
    // const isWallPresent = walls.has(str)
    
    return true;
}

export function createGrid(cellsX, cellsY) {
    const grid = new Array(cellsX);
    for (let i = 0; i < cellsX; i++) {
        grid[i] = new Array(cellsY);
        for (let j = 0; j < cellsY; j++) {
            grid[i][j] = {
                floor: null,
                occupant: null,
            }
        }
    }
    return grid;
}

export function facingToVector(facing) {
    if (facing === 'left') return new Vector2(-1, 0);
    if (facing === 'up') return new Vector2(0, -1);
    if (facing === 'right') return new Vector2(1, 0);
    if (facing === 'down') return new Vector2(0, 1);
}