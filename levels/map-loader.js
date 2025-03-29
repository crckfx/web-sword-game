// map-loader.js 
// handles loading of map from text string. 
// it seems cool to store a map as a text file. 
// we don't fetch a text file or anything here - just pass map strings in

import { Doodad } from "../classes/objects/Doodad.js";
import { Item } from "../classes/objects/Item.js";
import { Trigger } from "../classes/objects/Trigger.js";
import { Vector2 } from "../classes/Vector2.js";
import { CELL_PX } from "../document.js";
import { choose_4x4_texture_coords, } from "../helper/autotile.js";
import { choose_tile_texture, gridCells, removeOldOccupant } from "../helper/grid.js";
import { player, swordGame } from "../helper/world-loader.js";
import { check_tree_cell } from "./load-helper.js";
import { MapLayer } from "./MapLayer.js";

// define floor signifiers
export const tileMap = {
    'g': 'grass',
    'G': 'grass2',
    'd': 'dirt',
    'r': 'road',
    's': 'sand',
    'w': 'water',
    'i': 'island',
};
// define occupant signifiers
export const occupantMap = {
    'T': 'tree',
    't': 'largeTree',
    'W': 'water',
    'P': 'lachie',
    '.': null,
    '0': 'gary',
    '1': 'fred',
    '2': 'george',
    '3': 'harold',
    '4': 'steve',
    'a': 'apple',
    'i': 'miscItem',
    'f': 'fence',
    'X': 'trigger',
    'B': 'boat',
};


// *******************************************************************************
// ----- MAP PARSING -----
// deals with parsing the string-based map layers into sets of coords
// -------------------------------------------------------------------------------
// take a (floor) layout as string and return a list of x+y+name+z
export function parseFloorLayout(floor) {
    const mapString = floor.layout;
    const rows = mapString.trim().split("\n");
    const parsedMap = [];
    for (let y = 0; y < rows.length; y++) {
        const row = rows[y].trim();
        for (let x = 0; x < row.length; x++) {
            const tile = tileMap[row[x]];
            if (tile) parsedMap.push({ x, y, tile: tileMap[row[x]], z: floor.z });
        }
    }
    return parsedMap;
}

// take a layout (occupants) string and return an array full of list of coord/name objects
export function parseOccupantLayout(mapString) {
    const rows = mapString.trim().split("\n");
    const parsedMap = [];
    for (let y = 0; y < rows.length; y++) {
        const row = rows[y].trim();
        for (let x = 0; x < row.length; x++) {
            if (occupantMap[row[x]]) {
                parsedMap.push({ x: x, y: y, occupant: occupantMap[row[x]] });
            }
        }
    }
    return parsedMap;
}

// CURRENTLY UNUSED - take a "paths" layout as string and return a list of coords and types
function parsePathLayout(mapString = null) {
    if (mapString === null) return null;
    const rows = mapString.trim().split("\n");
    const parsedMap = [];
    for (let y = 0; y < rows.length; y++) {
        const row = rows[y].trim();
        for (let x = 0; x < row.length; x++) {
            if (row[x] === 'p') {
                parsedMap.push({ x, y });
            }
        }
    }
    return parsedMap;
}
// *******************************************************************************


export function occupantSwitch(mapCtx, overlayCtx, grid, images, i, j) {
    const cell = grid[j][i];
    if (cell.occupant instanceof Item) {
        if (cell.occupant.name === 'apple') {
            mapCtx.drawImage(
                cell.occupant.texture,
                (CELL_PX * (i)) + (CELL_PX * 0.25),
                (CELL_PX * (j)) + (CELL_PX * 0.25) - 4,
                CELL_PX * 0.5, CELL_PX * 0.5,
            );
        } else {
            // 'crate' for generic item
            mapCtx.drawImage(
                images.crateShadow,
                (CELL_PX * (i)),
                (CELL_PX * (j) - 4),
            );
        }
    } else {
        switch (cell.occupant) {
            case 'fence':
                const fenceData = choose_4x4_texture_coords(grid, i, j, 'fence');
                overlayCtx.drawImage(
                    images.schwarnhildFences,
                    fenceData.x, fenceData.y, CELL_PX, 16,
                    i * CELL_PX, j * CELL_PX - 12, CELL_PX, 24
                )
                mapCtx.drawImage(
                    images.schwarnhildFences,
                    fenceData.x, fenceData.y + 16, CELL_PX, 16,
                    i * CELL_PX, j * CELL_PX + 12, CELL_PX, 24
                )
                break;
            case 'tree':
                mapCtx.drawImage(
                    // images.tree,
                    images.trees_oak,
                    4 * CELL_PX, 2 * CELL_PX, CELL_PX * 2, CELL_PX,
                    (CELL_PX * i) - CELL_PX / 2,
                    CELL_PX * (j),
                    CELL_PX * 2,
                    CELL_PX,
                );
                // overlay canvas gets top 1 cell
                overlayCtx.drawImage(
                    images.trees_oak,
                    4 * CELL_PX, 1 * CELL_PX, CELL_PX * 2, CELL_PX,
                    CELL_PX * (i) - CELL_PX / 2, // offset to center the tree
                    CELL_PX * (j - 1), // Destination Y (unchanged)
                    CELL_PX * 2, CELL_PX// Destination width and height
                );
                break;
            case 'largeTree':
                // currently checks for arrangement 
                // ..T..
                // ..c..  (where cell = c, and largeTree = T)
                // ie. make sure there is another largetree element ABOVE this. 
                // otherwise, don't draw. we need a cell underneath this one to be a tree otherwise 
                if (check_tree_cell(grid, i, j, 'largeTree')) {
                    if (grid[j][i - 1] && grid[j][i - 1].occupant === 'largeTree' && check_tree_cell(grid, i - 1, j, 'largeTree')) {
                        // console.log(`there is another tree to the left of ${i},${j}`)
                        // todo: draw meshtree, but first figure out rules
                    } else {
                        // console.log(`no tree to the left of ${i},${j}`)
                        // todo: draw meshtree, but first figure out rules
                    }

                    mapCtx.drawImage(
                        images.tree_S_A,
                        0, CELL_PX, CELL_PX * 2, CELL_PX * 2, // crops
                        CELL_PX * (i) - CELL_PX / 2, // Destination X
                        CELL_PX * (j - 1), // Destination Y 
                        CELL_PX * 2, CELL_PX * 2 // Destination width and height
                    );

                    // overlay canvas gets top 1 cell
                    overlayCtx.drawImage(
                        images.tree_S_A,
                        0, 0, // Crop from (x=0, y=0) in the texture
                        CELL_PX * 2, CELL_PX, // Crop width and height (2x wide, 1x tall)
                        CELL_PX * (i) - CELL_PX / 2, // Destination X
                        CELL_PX * (j - 2), // Destination Y 
                        CELL_PX * 2, CELL_PX // Destination width and height
                    );

                    // apply_largeTree_x_overlays(grid, images.tree_S_A, overlayCtx, i, j, 'largeTree');
                    // TODO: WRITE A NEW FUNCTION TO HANDLE THE SIDE OVERLAYS; THE TOP IS ALREADY DONE
                } else {
                    // console.log('skipping tree cell that does not have down,right,down-right neighbours');
                }
                break;

        }
    }
}



// function to create a background image as a canvas
export function getMapTexture(grid, layer, mapWidthPx, mapHeightPx) {
    // Create an offscreen canvas for each sprite
    const mapCanvas = document.createElement('canvas');
    mapCanvas.width = mapWidthPx;
    mapCanvas.height = mapHeightPx;
    const mapCtx = mapCanvas.getContext('2d');
    mapCtx.imageSmoothingEnabled = false;

    for (const key in layer.floorLayout) {
        const layoutEntry = layer.floorLayout[key];
        const x = layoutEntry.x;
        const y = layoutEntry.y

        if (grid[y] && grid[y][x]) {
            const cell = grid[y][x];

            if (cell.floor === layer.match && cell.z === layer.z) {
                if (!layer.auto) {
                    mapCtx.drawImage(layer.image,
                        x * CELL_PX, y * CELL_PX, CELL_PX, CELL_PX
                    );
                } else {
                    const data = choose_tile_texture(grid, x, y, layer.match, cell.z)
                    mapCtx.drawImage(layer.image,
                        data.x, data.y, CELL_PX, CELL_PX,
                        x * CELL_PX, y * CELL_PX, CELL_PX, CELL_PX
                    )
                }
            }
        }
    }
    return {
        canvas: mapCanvas,
        ctx: mapCtx
    }
}

// take a grid and a layout list, and write to the grid's 
export function applyFloorToLevelLayer(grid, parsedFloorLayout) {
    for (const { x, y, tile, z } of parsedFloorLayout) {
        if (grid[y] && grid[y][x]) {
            const cell = grid[y][x];
            // if the position exists in the grid, write the floor name to it
            cell.floor = tile;
            cell.z = z;
            if (cell.occupant && cell.occupant === 'water') {
                cell.occupant = null;
            }
            // for water, insert an occupant too
            if (tile === 'water') {
                cell.occupant = 'water';
            }
        }
    }
}


// translate an occupant name into a game entity
export function applyOccupantsToLevel(level, parsedOccupantLayout, images, entities) {
    let triggerCount = 0;
    const grid = level.grid;
    for (const { x, y, occupant } of parsedOccupantLayout) {
        if (grid[y] && grid[y][x]) {
            switch (occupant) {
                case 'tree': case 'largeTree': case 'fence':
                    grid[y][x].occupant = occupant;
                    break;
                case 'lachie':
                    removeOldOccupant(grid, x, y)
                    const cell = grid[y][x];
                    level.entityData['player'].cellCoord.overwrite(x, y)
                    cell.occupant = null;
                    break;
                case 'gary': case 'fred': case 'george': case 'harold': case 'steve':
                    level.entityData[occupant].cellCoord.overwrite(x, y)
                    grid[y][x].occupant = entities[occupant];
                    break;
                case 'apple':
                    const newApple = new Item({ name: 'apple', position: { x: gridCells(x), y: gridCells(y) }, texture: images.apple, invTexture: images.apple2, description: 'An apple.' });
                    grid[y][x].occupant = newApple;
                    break;
                case 'miscItem':
                    const newItem = new Item({ name: 'miscItem', position: { x: gridCells(x), y: gridCells(y) }, invTexture: images.questionMark });
                    grid[y][x].occupant = newItem;
                    break;
                case 'trigger':
                    // if (level.triggers[triggerCount]) {
                    //     const trigger = level.triggers[triggerCount];
                    //     const position = new Vector2(gridCells(x), gridCells(y));
                    //     const doodad = new Doodad({name: 'boat', position: position, texture: images.boat_southEast, trigger: trigger})
                    //     grid[y][x].occupant = doodad;
                    //     triggerCount++;
                    // } else {
                    //     console.error(`you don't have a ${triggerCount}th trigger in your set?`)
                    // }
                    break;
                case 'boat':
                    const doodad = level.doodads.boat;
                    doodad.position.x = gridCells(x);
                    doodad.position.y = gridCells(y);
                    grid[y][x].occupant = doodad;
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
