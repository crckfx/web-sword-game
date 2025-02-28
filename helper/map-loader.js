// map-loader.js 
// handles loading of map from text string. 
// it seems cool to store a map as a text file. 
// we don't fetch a text file or anything here - just pass map strings in

import { doodads, entities, player, NUM_GRID_X, NUM_GRID_Y, FLOOR_CELL_PIXELS } from "../game.js";
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
export const occupantMap = {
    'T': 'tree',
    'W': 'water',
    'P': 'lachie',
    '.': null,
    '0': 'gary',
    '1': 'fred',
    '2': 'george',
    '3': 'harold',
};

// Decode the map into (x, y) positions
export function parseFloorMap(mapString) {
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
export function applyFloorToGameGrid(grid, parsedFloorMap) {
    for (const { x, y, tile } of parsedFloorMap) {
        if (grid[x] && grid[x][y]) {
            grid[x][y].floor = tile;  // Apply floor type
            if (tile === 'water') {
                // add doodad here?
                const num = doodads.push({ type: 'water', x: x, y: y });
                grid[x][y].occupant = doodads[num-1].type;
            }
        }
    }
}


// Decode the map into (x, y) positions
export function parseOccupantMap(mapString) {
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
export function applyOccupantsToGameGrid(grid, parsedOccupantMap, entities) {
    for (const { x, y, type } of parsedOccupantMap) {
        if (grid[x] && grid[x][y]) {
            if (type === 'lachie') {
                if (grid[player.position.x]) {
                    if (grid[player.position.x][player.position.y]) {
                        console.log('breasts');
                        const oldCell = grid[player.position.x][player.position.y];
                        if (oldCell.occupant === 'lachie') {
                            oldCell.occupant = null;
                        }
                    }
                }
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
                const e = entities[type];
                // remove entity occupation from a previous cell
                // const cell = grid[e.position.x][e.position.y];
                // if (cell.occupant !== null) {
                    // console.error(`something went WRONG applying ${e.name} to cell [${x}][${y}], it is already occupied by ${cell.occupant}`);
                // } else {

                    // grid[e.position.x][e.position.y].occupant = null;
                    // set new position
                    e.position.x = gridCells(x);
                    e.position.y = gridCells(y);
                    grid[x][y].occupant = e.name;
                // }

            } else if (type === 'tree') {
                // const num = doodads.push({ type: 'tree', x: x, y: y });
                // grid[x][y].occupant = doodads[num-1].type;
                grid[x][y].occupant = type;  // Apply floor type
            } else {
                grid[x][y].occupant = type;  // Apply floor type
            }
        }
    }
}



export async function getMapBackground(grid, textures) {
    // get the pixel sizes for the map
    const mapWidthPx = FLOOR_CELL_PIXELS * NUM_GRID_X;
    const mapHeightPx = FLOOR_CELL_PIXELS * NUM_GRID_Y;
    // Create an offscreen canvas for each sprite
    const mapCanvas = document.createElement('canvas');
    mapCanvas.width = mapWidthPx;
    mapCanvas.height = mapHeightPx;
    const mapCtx = mapCanvas.getContext('2d');
    // mapCtx.imageSmoothingEnabled = false;

    // loop over the entire game grid
    for (let i = 0; i < NUM_GRID_X; i++) {
        for (let j = 0; j < NUM_GRID_Y; j++) {
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


export async function getMapOccupants(grid, textures, images, stateIndex=0) {
    // get the pixel sizes for the map
    const mapWidthPx = FLOOR_CELL_PIXELS * NUM_GRID_X;
    const mapHeightPx = FLOOR_CELL_PIXELS * NUM_GRID_Y;
    // Create an offscreen canvas for each sprite
    const mapCanvas = document.createElement('canvas');
    mapCanvas.width = mapWidthPx;
    mapCanvas.height = mapHeightPx;
    const mapCtx = mapCanvas.getContext('2d');
    mapCtx.imageSmoothingEnabled = false;


    // loop over the entire game grid
    for (let i = 0; i < NUM_GRID_X; i++) {
        for (let j = 0; j < NUM_GRID_Y; j++) {
            const cell = grid[i][j];
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