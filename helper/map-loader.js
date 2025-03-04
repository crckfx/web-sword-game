// map-loader.js 
// handles loading of map from text string. 
// it seems cool to store a map as a text file. 
// we don't fetch a text file or anything here - just pass map strings in

import { Item } from "../classes/Item.js";
import {  NUM_GRID, FLOOR_CELL_PIXELS } from "../document.js";
import { gridCells } from "./grid.js";
import { player } from "./world-loader.js";

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
    'a': 'apple',
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

// take a (floor) layout as string and return a list of coords and types
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

// take a grid and a layout list, and write to the grid's 
export function applyFloorToGameGrid(grid, parsedFloorLayout) {
    for (const { x, y, tile } of parsedFloorLayout) {
        if (grid[x] && grid[x][y]) {
            // if the position exists in the grid, write the floor name to it
            grid[x][y].floor = tile;
            if (tile === 'water') {
                // for water, insert an occupant too
                grid[x][y].occupant = 'water';
            }
        }
    }
}


// take a layout (occupants) string and return a list of coords and names
export function parseOccupantLayout(mapString) {
    const rows = mapString.trim().split("\n");
    const parsedMap = [];
    for (let y = 0; y < rows.length; y++) {
        const row = rows[y].trim();
        for (let x = 0; x < row.length; x++) {
            parsedMap.push({ x: x, y: y, occupant: occupantMap[row[x]] || null });
        }
    }
    return parsedMap;
}

// note : "type" is becoming maybe a terrible name
export function applyOccupantsToGameGrid(grid, parsedOccupantLayout, entities, textures) {
    for (const { x, y, occupant } of parsedOccupantLayout) {
        if (grid[x] && grid[x][y]) {
            switch (occupant) {
                case 'lachie':
                    removeOldOccupant(grid, x, y)
                    const cell = grid[x][y];
                    player.position.x = gridCells(x);
                    player.position.y = gridCells(y);
                    player.destination.x = gridCells(x);
                    player.destination.y = gridCells(y);
                    // cell.occupant = 'lachie';
                    cell.occupant = null;
                    break;
                case 'gary': case 'fred': case 'george': case 'harold':
                    const e = entities[occupant]; // remember, we pass in the entities object as an argument
                    e.position.x = gridCells(x);
                    e.position.y = gridCells(y);
                    grid[x][y].occupant = e;
                    break;
                case 'tree': case 'largeTree':
                    grid[x][y].occupant = occupant;
                    break;
                case 'apple':
                    const newApple = new Item('apple', { x: gridCells(x), y: gridCells(y) }, textures.apple, textures.apple2);
                    grid[x][y].occupant = newApple;
                    break;
                case null:
                    // do nothing if the cell was made null
                    break;
                default:
                    console.warn(`unknown occupant type named ${occupant}`);
            }
        }
    }
}


// function to create a background image as a canvas
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
    mapCtx.imageSmoothingEnabled = false;

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
            // if (cell.skip === true) continue;
            if (cell.occupant instanceof Item) {
                if (cell.occupant.name === 'apple') {

                    mapCtx.drawImage(
                        cell.occupant.texture,
                        FLOOR_CELL_PIXELS * 0.25 + (FLOOR_CELL_PIXELS * (i)),
                        FLOOR_CELL_PIXELS * 0.25 + (FLOOR_CELL_PIXELS * (j)),
                        (FLOOR_CELL_PIXELS * 0.5),
                        (FLOOR_CELL_PIXELS * 0.5),
                    );
                }
            } else {


                switch (cell.occupant) {
                    case 'tree':
                        mapCtx.drawImage(
                            // images.tree,
                            textures.tree1_overlay,
                            FLOOR_CELL_PIXELS * (i),
                            FLOOR_CELL_PIXELS * (j - 1),
                            FLOOR_CELL_PIXELS,
                            FLOOR_CELL_PIXELS * 2,
                        );
                        break;
                    // case 'apple':
                    //     mapCtx.drawImage(
                    //         textures.apple,
                    //         FLOOR_CELL_PIXELS * (i),
                    //         FLOOR_CELL_PIXELS * (j),
                    //         FLOOR_CELL_PIXELS,
                    //         FLOOR_CELL_PIXELS,
                    //     );
                    //     break;
                    case 'largeTree':
                        // check that this cell has Neighbours such that:
                        // ---.N---
                        // ---NN--- if it does, we draw a big tree and skip past the cell to the right we've just drawn on
                        if (checkCell(grid, i, j)) {
                            // console.log('heyyyyy skip the down, right, and down-right cells from this one dawg')
                            mapCtx.drawImage(
                                textures.tree2_overlay,
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

