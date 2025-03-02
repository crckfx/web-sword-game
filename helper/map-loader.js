// map-loader.js 
// handles loading of map from text string. 
// it seems cool to store a map as a text file. 
// we don't fetch a text file or anything here - just pass map strings in

import { player, NUM_GRID, FLOOR_CELL_PIXELS } from "../document.js";
import { gridCells } from "./grid.js";

// define floor signifiers
export const tileMap = {
    'g': 'grass',
    'G': 'grass2',
    'd': 'dirt',
    'r': 'road',
    's': 'sand',
    'w': 'water',
};
// define occupant signifiers
const occupantMap = {
    'T': 'tree',
    't': 'largeTree',
    'W': 'water',
    'P': 'lachie',
    '.': null,
    '0': 'gary',
    '1': 'fred',
    '2': 'george',
    '3': 'harold',
};

function removeOldOccupant(grid, x, y) {
    // triple check a cell exists before accessing/removing from it
    if (grid[x]) {
        if (grid[x][y]) {
            const oldCell = grid[x][y];
            if (oldCell.occupant !== null) {
                oldCell.occupant = null;
            }
        }
    }
}

// Decode the map into (x, y) positions
export function parseFloorLayout(mapString) {
    const rows = mapString.trim().split("\n");
    const parsedMap = [];

    for (let y = 0; y < rows.length; y++) {
        const row = rows[y].trim();

        for (let x = 0; x < row.length; x++) {
            parsedMap.push({ x, y, tile: tileMap[row[x]] || 'unknown' });
        }
    }

    return parsedMap;
}

// Apply parsed data to the existing grid
export function applyFloorToGameGrid(grid, parsedFloorLayout) {
    for (const { x, y, tile } of parsedFloorLayout) {
        if (grid[x] && grid[x][y]) {
            grid[x][y].floor = tile;  // Apply floor type
            if (tile === 'water') {
                grid[x][y].occupant = 'water';
            }
        }
    }
}


// Decode the map into (x, y) positions
export function parseOccupantLayout(mapString) {
    const rows = mapString.trim().split("\n");
    const parsedMap = [];

    for (let y = 0; y < rows.length; y++) {
        const row = rows[y].trim();

        for (let x = 0; x < row.length; x++) {
            parsedMap.push({ x: x, y: y, type: occupantMap[row[x]] || null });
        }
    }

    return parsedMap;
}

// note : "type" is becoming maybe a terrible name
export function applyOccupantsToGameGrid(grid, parsedOccupantLayout, entities) {
    for (const { x, y, type } of parsedOccupantLayout) {
        if (grid[x] && grid[x][y]) {
            if (type === 'lachie') {
                // triple check a cell exists before accessing/removing from it
                removeOldOccupant(grid, x, y)
                const cell = grid[x][y];
                player.position.x = gridCells(x);
                player.position.y = gridCells(y);
                player.destination.x = gridCells(x);
                player.destination.y = gridCells(y);
                // cell.occupant = 'lachie';
                cell.occupant = null;
            } else
                if (type === 'gary' || type === 'fred' || type === 'george' || type === 'harold') {
                    // console.log('GOT an entity BACK');
                    const e = entities[type]; // remember, we pass in the entities object as an argument
                    e.position.x = gridCells(x);
                    e.position.y = gridCells(y);
                    grid[x][y].occupant = e;
                    // }
                } else if (type === 'tree') {
                    grid[x][y].occupant = type;  // Apply floor type
                } else if (type === 'largeTree') {
                    grid[x][y].occupant = 'largeTree';  // Apply floor type
                } else {
                    grid[x][y].occupant = type;  // Apply floor type
                }
        }
    }
}



export async function getMapBackground(grid, textures) {
    // get the pixel sizes for the map
    const mapWidthPx = FLOOR_CELL_PIXELS * NUM_GRID.x;
    const mapHeightPx = FLOOR_CELL_PIXELS * NUM_GRID.y;
    // Create an offscreen canvas for each sprite
    const mapCanvas = document.createElement('canvas');
    mapCanvas.width = mapWidthPx;
    mapCanvas.height = mapHeightPx;
    const mapCtx = mapCanvas.getContext('2d');
    // mapCtx.imageSmoothingEnabled = false;

    // loop over the entire game grid
    for (let i = 0; i < NUM_GRID.x; i++) {
        for (let j = 0; j < NUM_GRID.y; j++) {
            const cell = grid[i][j];
            switch (cell.floor) {
                case 'road':
                case 'grass':
                case 'grass2':
                case 'dirt':
                case 'sand':
                    mapCtx.drawImage(
                        textures[cell.floor],
                        FLOOR_CELL_PIXELS * (i),
                        FLOOR_CELL_PIXELS * (j),
                        FLOOR_CELL_PIXELS,
                        FLOOR_CELL_PIXELS,
                    );
                    break;
                case 'water':
                    mapCtx.fillStyle = 'blue';
                    mapCtx.fillRect(
                        FLOOR_CELL_PIXELS * (i),
                        FLOOR_CELL_PIXELS * (j),
                        FLOOR_CELL_PIXELS,
                        FLOOR_CELL_PIXELS
                    );
                    break;
            }
        }
    }
    return mapCanvas;
}


export async function getMapOccupants(grid, textures, images, stateIndex = 0) {
    // get the pixel sizes for the map
    const mapWidthPx = FLOOR_CELL_PIXELS * NUM_GRID.x;
    const mapHeightPx = FLOOR_CELL_PIXELS * NUM_GRID.y;
    // Create an offscreen canvas for each sprite
    const mapCanvas = document.createElement('canvas');
    mapCanvas.width = mapWidthPx;
    mapCanvas.height = mapHeightPx;
    const mapCtx = mapCanvas.getContext('2d');
    mapCtx.imageSmoothingEnabled = false;


    const overlayCanvas = document.createElement('canvas');
    overlayCanvas.width = mapWidthPx;
    overlayCanvas.height = mapHeightPx;
    const overlayCtx = overlayCanvas.getContext('2d');
    overlayCtx.imageSmoothingEnabled = false;

    // loop over the entire game grid
    for (let j = 0; j < NUM_GRID.y; j++) {
        for (let i = 0; i < NUM_GRID.x; i++) {
            const cell = grid[i][j];
            if (cell.skip === true) continue;
            switch (cell.occupant) {
                case 'tree':
                    mapCtx.drawImage(
                        images.tree,
                        FLOOR_CELL_PIXELS * (i),
                        FLOOR_CELL_PIXELS * (j),
                        FLOOR_CELL_PIXELS,
                        FLOOR_CELL_PIXELS,
                    );
                    break;
                case 'largeTree':
                    if (checkCell(grid, i, j)) {
                        console.log('heyyyyy skip the down, right, and down-right cells from this one dawg')
                        mapCtx.drawImage(
                            images.largeTree_test,
                            FLOOR_CELL_PIXELS * (i),
                            FLOOR_CELL_PIXELS * (j - 1),
                            FLOOR_CELL_PIXELS * 2,
                            FLOOR_CELL_PIXELS * 3,
                        )
                        i++;
                    } else {
                        console.log('skipping tree cell that does not have down,right,down-right neighbours');
                    }

                    break;
                case 'water':
                    mapCtx.drawImage(
                        textures.water[stateIndex],
                        FLOOR_CELL_PIXELS * (i),
                        FLOOR_CELL_PIXELS * (j),
                        FLOOR_CELL_PIXELS,
                        FLOOR_CELL_PIXELS,

                    );
                    break;
            }
        }
    }
    return mapCanvas;
}

function checkCell(grid, x, y) {
    if (!grid[x] || !grid[x][y]) {
        return false;
    }
    // let result = false;
    if (grid[x + 1] && grid[x + 1][y]) {
        const cell = grid[x + 1][y];
        if (cell.occupant !== 'largeTree') return false;
    }

    if (grid[x + 1] && grid[x + 1][y + 1]) {
        const cell = grid[x + 1][y + 1];
        if (cell.occupant !== 'largeTree') return false;
    }

    if (grid[x][y + 1]) {
        const cell = grid[x][y + 1];
        if (cell.occupant !== 'largeTree') return false;
    }

    return true;

}

