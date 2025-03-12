// map-loader.js 
// handles loading of map from text string. 
// it seems cool to store a map as a text file. 
// we don't fetch a text file or anything here - just pass map strings in

import { Item } from "../classes/Item.js";
import { NUM_GRID, FLOOR_CELL_PIXELS } from "../document.js";
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
    'i': 'miscItem'
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
export function applyOccupantsToGameGrid(grid, parsedOccupantLayout, entities, textures, images) {
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
                case 'miscItem':
                    const newItem = new Item('miscItem', { x: gridCells(x), y: gridCells(y) }, null, images.questionMark);
                    grid[x][y].occupant = newItem;
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
export async function getMapBackground(grid, textures, stateIndex = 0) {
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

    const floorOnly = document.createElement('canvas');
    floorOnly.width = mapWidthPx;
    floorOnly.height = mapHeightPx;
    const floorOnlyCtx = floorOnly.getContext('2d');
    // Copy the current floor BEFORE objects are drawn


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

    // finally, save a copy of the floor before we add stuff to it
    floorOnlyCtx.drawImage(mapCanvas, 0, 0, mapWidthPx, mapHeightPx);


    return {
        floorOnly: floorOnly,
        canvas: mapCanvas,
        ctx: mapCtx
    }
}


export async function getMapOccupants(grid, textures, images, floorTexture) {

    // const mapCanvas = floorTexture.canvas;
    const mapCtx = floorTexture.ctx;


    const overlayCanvas = document.createElement('canvas');
    overlayCanvas.width = floorTexture.canvas.width;
    overlayCanvas.height = floorTexture.canvas.height;
    const overlayCtx = overlayCanvas.getContext('2d');
    overlayCtx.imageSmoothingEnabled = false;

    // loop over y first, then x
    for (let j = 0; j < NUM_GRID.y; j++) {
        for (let i = 0; i < NUM_GRID.x; i++) {
            const cell = grid[i][j];
            if (cell.skip === true) continue;
            if (cell.occupant instanceof Item) {
                if (cell.occupant.name === 'apple') {
                    mapCtx.drawImage(
                        cell.occupant.texture,
                        FLOOR_CELL_PIXELS * 0.25 + (FLOOR_CELL_PIXELS * (i)),
                        FLOOR_CELL_PIXELS * 0.25 + (FLOOR_CELL_PIXELS * (j)),
                        (FLOOR_CELL_PIXELS * 0.5),
                        (FLOOR_CELL_PIXELS * 0.5),
                    );
                } else {
                    mapCtx.drawImage(
                        images.crateShadow,
                        (FLOOR_CELL_PIXELS * (i)),
                        (FLOOR_CELL_PIXELS * (j)),
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
                    case 'largeTree':
                        // currently checks if arrangement (where cell = c & largeTree = T) = `
                        //      ..c..
                        //      ..T..
                        // ` 
                        // ie. make sure there is another largetree element under this. 
                        // otherwise, don't draw. we need a cell underneath this one to be a tree otherwise 
                        if (checkCell(grid, i, j)) {

                            // base map canvas gets bottom 2 cells (skip top 1 cell)
                            mapCtx.drawImage(
                                textures.tree_S_A,
                                0, FLOOR_CELL_PIXELS, // Crop from (x=0, y=32px) in the texture
                                FLOOR_CELL_PIXELS * 2, FLOOR_CELL_PIXELS * 2, // Crop width and height (2x wide, 2x tall)
                                FLOOR_CELL_PIXELS * (i) - FLOOR_CELL_PIXELS / 2, // Destination X
                                FLOOR_CELL_PIXELS * (j), // Destination Y (move down 1 cell)
                                FLOOR_CELL_PIXELS * 2, FLOOR_CELL_PIXELS * 2 // Destination width and height
                            );

                            // overlay canvas gets top 1 cell
                            overlayCtx.drawImage(
                                textures.tree_S_A,
                                0, 0, // Crop from (x=0, y=0) in the texture
                                FLOOR_CELL_PIXELS * 2, FLOOR_CELL_PIXELS, // Crop width and height (2x wide, 1x tall)
                                FLOOR_CELL_PIXELS * (i) - FLOOR_CELL_PIXELS / 2, // Destination X
                                FLOOR_CELL_PIXELS * (j - 1), // Destination Y (unchanged)
                                FLOOR_CELL_PIXELS * 2, FLOOR_CELL_PIXELS // Destination width and height
                            );

                            apply_largeTree_x_overlay(grid, textures, overlayCtx, i, j)

                            // overlay canvas should also draw these "tree edges"; the parts that extend outside the containing cell.

                        } else {
                            // console.log('skipping tree cell that does not have down,right,down-right neighbours');
                        }
                        break;

                }
            }
        }
    }
    return {
        // return only the overlay stuff; we passed in the floor one to modify it
        canvas: overlayCanvas,
        ctx: overlayCtx
    }
    // return mapCanvas;
}

function checkCell(grid, x, y) {
    if (!grid[x] || !grid[x][y]) {
        return false;
    }
    // // let result = false;
    // if (grid[x + 1] && grid[x + 1][y]) {
    //     const cell = grid[x + 1][y];
    //     if (cell.occupant !== 'largeTree') return false;
    // }

    // if (grid[x + 1] && grid[x + 1][y + 1]) {
    //     const cell = grid[x + 1][y + 1];
    //     if (cell.occupant !== 'largeTree') return false;
    // }

    // check cell below
    if (grid[x][y + 1]) {
        const cell = grid[x][y + 1];
        if (cell.occupant !== 'largeTree') return false;
    }

    return true;

}

function apply_largeTree_x_overlay(grid, textures, overlayCtx, i, j) {

    if (grid[i + 1]) {
        if (grid[i + 1][j] && grid[i + 1][j].occupant !== 'largeTree') {
            overlayCtx.drawImage(
                textures.tree_S_A,
                FLOOR_CELL_PIXELS * 1.5, FLOOR_CELL_PIXELS - 8, // Crop from (x=0, y=32px) in the texture
                FLOOR_CELL_PIXELS / 2, FLOOR_CELL_PIXELS, // Crop width and height (2x wide, 2x tall)
                FLOOR_CELL_PIXELS * (i + 1), // Destination X
                FLOOR_CELL_PIXELS * j - 8, // Destination Y (move down 1 cell)
                FLOOR_CELL_PIXELS / 2, FLOOR_CELL_PIXELS // Destination width and height
            );
        }
        if (grid[i + 1][j + 1] && grid[i + 1][j + 1].occupant !== 'largeTree') {
            overlayCtx.drawImage(
                textures.tree_S_A,
                FLOOR_CELL_PIXELS * 1.5, FLOOR_CELL_PIXELS * 2 - 8, // Crop from (x=0, y=32px) in the texture
                FLOOR_CELL_PIXELS / 2, FLOOR_CELL_PIXELS, // Crop width and height (2x wide, 2x tall)
                FLOOR_CELL_PIXELS * (i + 1), // Destination X
                FLOOR_CELL_PIXELS * (j + 1) - 8, // Destination Y (move down 1 cell)
                FLOOR_CELL_PIXELS / 2, FLOOR_CELL_PIXELS // Destination width and height
            );

        }
    }

    
    // left side may not need checks!
    if (grid[i - 1] && grid[i - 1][j] && grid[i - 1][j + 1]) {
        if (grid[i - 1][j].occupant !== 'largeTree') {
            overlayCtx.drawImage(
                textures.tree_S_A,
                0, FLOOR_CELL_PIXELS, // Crop from (x=0, y=32px) in the texture
                FLOOR_CELL_PIXELS / 2, FLOOR_CELL_PIXELS, // Crop width and height (2x wide, 2x tall)
                FLOOR_CELL_PIXELS * (i) - FLOOR_CELL_PIXELS / 2, // Destination X
                FLOOR_CELL_PIXELS * j, // Destination Y (move down 1 cell)
                FLOOR_CELL_PIXELS / 2, FLOOR_CELL_PIXELS // Destination width and height
            );
        }

        if (grid[i - 1][j + 1].occupant !== 'largeTree') {
            overlayCtx.drawImage(
                textures.tree_S_A,
                0, FLOOR_CELL_PIXELS * 2, // Crop from (x=0, y=32px) in the texture
                FLOOR_CELL_PIXELS / 2, FLOOR_CELL_PIXELS, // Crop width and height (2x wide, 2x tall)
                FLOOR_CELL_PIXELS * (i) - FLOOR_CELL_PIXELS / 2, // Destination X
                FLOOR_CELL_PIXELS * (j + 1), // Destination Y (move down 1 cell)
                FLOOR_CELL_PIXELS / 2, FLOOR_CELL_PIXELS // Destination width and height
            );
        }
    }

}