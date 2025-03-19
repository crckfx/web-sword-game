// map-loader.js 
// handles loading of map from text string. 
// it seems cool to store a map as a text file. 
// we don't fetch a text file or anything here - just pass map strings in

import { Item } from "../classes/objects/Item.js";
import { Vector2 } from "../classes/Vector2.js";
import { NUM_GRID, CELL_PX } from "../document.js";
import { do_autotile } from "./autotile.js";
import { check_grid_neighbour_floor, gridCells } from "./grid.js";
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
    'i': 'miscItem',
    'f': 'fence',
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


// take a layout (occupants) string and return an array full of list of coord/name objects
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

// translate an occupant name into a game entity
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
                case 'tree': case 'largeTree': case 'fence':
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


function drawGridCell(ctx, texture, x, y) {
    ctx.drawImage(texture, x * CELL_PX, y * CELL_PX, CELL_PX, CELL_PX)
}

function floorSwitch(ctx, textures, x, y, grid) {
    const cell = grid[x][y];
    let texture = textures.questionMark;
    switch (cell.floor) {
        case 'grass2':
            drawGridCell(ctx, textures[cell.floor], x, y);
            break;
        case 'road':
            texture = textures.stoneDirt;
            const roadData = choose_tile_texture(grid, x, y, 'road');
            ctx.drawImage(
                texture,
                roadData.x, roadData.y, CELL_PX, CELL_PX,
                CELL_PX * x, CELL_PX * y, CELL_PX, CELL_PX,
            );            
            break;
        case 'sand':
            ctx.drawImage(
                // if (check_grid_neighbour_floor(grid, i + 1, j, 'sand') || check_grid_neighbour_floor(grid, i, j + 1, 'sand')) texture = textures.grassSand;
                textures.sandGrass,
                1 * CELL_PX, 1 * CELL_PX, CELL_PX, CELL_PX,
                CELL_PX * x, CELL_PX * y, CELL_PX, CELL_PX,
            );
            break;
        case 'water':
            drawGridCell(ctx, textures.water[0], x, y)
            break;
        case 'dirt':
            texture = textures.dirtSand;
            let drawX = 1 * CELL_PX;
            let drawY = 1 * CELL_PX;

            if (
                check_grid_neighbour_floor(grid, x + 1, y, 'sand') ||
                // check_grid_neighbour_floor(grid, x + 1, y + 1, 'sand') ||
                check_grid_neighbour_floor(grid, x, y + 1, 'sand') ||
                // check_grid_neighbour_floor(grid, x - 1, y + 1, 'sand') ||
                check_grid_neighbour_floor(grid, x - 1, y, 'sand') ||
                // check_grid_neighbour_floor(grid, x - 1, y - 1, 'sand') ||
                check_grid_neighbour_floor(grid, x, y - 1, 'sand')
                // check_grid_neighbour_floor(grid, x + 1, y - 1, 'sand')
            ) {
                const dirtData = choose_tile_texture(grid, x, y, 'dirt');
                drawX = dirtData.x;
                drawY = dirtData.y;
                //
            }

            // if (dirtData.neighbour.x !== 0 || dirtData.neighbour.y !== 0) {
            //     // console.log(`yeah we got some neighbour data back: ${dirtData.neighbour.x}, ${dirtData.neighbour.y}`)
            //     const nx = dirtData.neighbour.x + x;
            //     const ny = dirtData.neighbour.y + y;
            //     if (grid[nx] && grid[nx][ny]) {
            //         const cell = grid[nx][ny];
            //         // console.log(cell.floor)
            //         if (cell.floor === 'sand') texture = textures.dirtSand;
            //         else if (cell.floor === 'grass') texture = textures.dirtGrass;
            //     }
            // }

            ctx.drawImage(
                texture,
                drawX, drawY, CELL_PX, CELL_PX,
                CELL_PX * x, CELL_PX * y, CELL_PX, CELL_PX,
            );
            // drawGridCell(mapCtx, textures.dirt, i, j)
            break;
        case 'grass':
            texture = textures.grassDirt;
            const grassData = choose_tile_texture(grid, x, y, 'grass');
            // if (check_grid_neighbour_floor(grid, x + 1, y, 'sand') || check_grid_neighbour_floor(grid, x, y + 1, 'sand')) texture = textures.grassSand;

            // const nx = grassData.neighbour.x + x;
            // const ny = grassData.neighbour.y + y;
            // if (grid[nx] && grid[nx][ny]) {
            //     const cell = grid[nx][ny];
            //     // console.log(cell.floor)
            //     if (cell.floor === 'dirt') texture = textures.grassDirt;
            //     else if (cell.floor === 'sand') texture = textures.grassSand;
            // }

            if (
                check_grid_neighbour_floor(grid, x + 1, y, 'sand') ||
                check_grid_neighbour_floor(grid, x + 1, y + 1, 'sand') ||
                check_grid_neighbour_floor(grid, x, y + 1, 'sand') ||
                check_grid_neighbour_floor(grid, x - 1, y + 1, 'sand') ||
                check_grid_neighbour_floor(grid, x - 1, y, 'sand') ||
                check_grid_neighbour_floor(grid, x - 1, y - 1, 'sand') ||
                check_grid_neighbour_floor(grid, x, y - 1, 'sand') ||
                check_grid_neighbour_floor(grid, x + 1, y - 1, 'sand')
            ) {
                //
                texture = textures.grassSand;
            }


            ctx.drawImage(
                texture,
                grassData.x, grassData.y, CELL_PX, CELL_PX,
                CELL_PX * x, CELL_PX * y, CELL_PX, CELL_PX,
            );
            break;
    }
}

function occupantSwitch(mapCtx, overlayCtx, grid, textures, images, i, j) {
    const cell = grid[i][j];
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
                const fenceData = choose_occupant_texture(grid, i, j, 'fence');
                overlayCtx.drawImage(
                    textures.schwarnhildFences,
                    fenceData.x, fenceData.y, CELL_PX, 16,
                    i * CELL_PX, j * CELL_PX - 12, CELL_PX, 24
                )
                mapCtx.drawImage(
                    textures.schwarnhildFences,
                    fenceData.x, fenceData.y + 16, CELL_PX, 16,
                    i * CELL_PX, j * CELL_PX + 12, CELL_PX, 24
                )
                break;
            case 'tree':
                mapCtx.drawImage(
                    // images.tree,
                    textures.trees_oak,
                    4 * CELL_PX, 2 * CELL_PX, CELL_PX * 2, CELL_PX,
                    (CELL_PX * i) - CELL_PX / 2,
                    CELL_PX * (j),
                    CELL_PX * 2,
                    CELL_PX,
                );
                // overlay canvas gets top 1 cell
                overlayCtx.drawImage(
                    textures.trees_oak,
                    4 * CELL_PX, 1 * CELL_PX, CELL_PX * 2, CELL_PX,
                    CELL_PX * (i) - CELL_PX / 2, // offset to center the tree
                    CELL_PX * (j - 1), // Destination Y (unchanged)
                    CELL_PX * 2, CELL_PX// Destination width and height
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
                        0, CELL_PX, // Crop from (x=0, y=32px) in the texture
                        CELL_PX * 2, CELL_PX * 2, // Crop width and height (2x wide, 2x tall)
                        CELL_PX * (i) - CELL_PX / 2, // Destination X
                        CELL_PX * (j), // Destination Y (move down 1 cell)
                        CELL_PX * 2, CELL_PX * 2 // Destination width and height
                    );

                    // overlay canvas gets top 1 cell
                    overlayCtx.drawImage(
                        textures.tree_S_A,
                        0, 0, // Crop from (x=0, y=0) in the texture
                        CELL_PX * 2, CELL_PX, // Crop width and height (2x wide, 1x tall)
                        CELL_PX * (i) - CELL_PX / 2, // Destination X
                        CELL_PX * (j - 1), // Destination Y (unchanged)
                        CELL_PX * 2, CELL_PX // Destination width and height
                    );

                    apply_largeTree_x_overlays(grid, textures.tree_S_A, overlayCtx, i, j, 'largeTree', textures.meshTree);

                    // overlay canvas should also draw these "tree edges"; the parts that extend outside the containing cell.

                } else {
                    // console.log('skipping tree cell that does not have down,right,down-right neighbours');
                }
                break;

        }
    }
}

// function to create a background image as a canvas
export async function getMapTextures(grid, textures, images, paths = null) {
    // get the pixel sizes for the map
    const mapWidthPx = CELL_PX * NUM_GRID.x;
    const mapHeightPx = CELL_PX * NUM_GRID.y;
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
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            floorSwitch(mapCtx, textures, i, j, grid);
        }
    }

    if (paths !== null) {
        for (const key in paths) {
            const tile = paths[key];
            const pathCoords = choose_path_texture(paths, tile.x, tile.y)
            mapCtx.drawImage(
                textures.schwarnhildDirtPaths,
                pathCoords.x, pathCoords.y, CELL_PX, CELL_PX,
                CELL_PX * tile.x,
                CELL_PX * tile.y,
                CELL_PX,
                CELL_PX,

            );
        }
    }

    // finally, save a copy of the floor before we add stuff to it
    floorOnlyCtx.drawImage(mapCanvas, 0, 0, mapWidthPx, mapHeightPx);

    const overlayCanvas = document.createElement('canvas');
    overlayCanvas.width = mapCanvas.width;
    overlayCanvas.height = mapCanvas.height;
    const overlayCtx = overlayCanvas.getContext('2d');
    overlayCtx.imageSmoothingEnabled = false;


    // loop over y and x AGAIN
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            occupantSwitch(mapCtx, overlayCtx, grid, textures, images, i, j);
        }
    }


    return {
        mapFloor: {
            floorOnly: floorOnly,
            canvas: mapCanvas,
            ctx: mapCtx
        },
        mapOverlays: {
            canvas: overlayCanvas,
            ctx: overlayCtx
        }
    }
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

function apply_largeTree_x_overlays(grid, texture, overlayCtx, i, j, match, meshTexture) {

    if (grid[i + 1]) {
        if (grid[i + 1][j] && grid[i + 1][j].occupant !== match) {
            overlayCtx.drawImage(
                texture,
                CELL_PX * 1.5, CELL_PX, // Crop from (x=0, y=32px) in the texture
                CELL_PX / 2, CELL_PX, // Crop width and height (2x wide, 2x tall)
                CELL_PX * (i + 1), // Destination X
                CELL_PX * j, // Destination Y 
                CELL_PX / 2, CELL_PX // Destination width and height
            );
        }
        if (grid[i + 1][j + 1] && grid[i + 1][j + 1].occupant !== match) {
            overlayCtx.drawImage(
                texture,
                CELL_PX * 1.5, CELL_PX * 2, // Crop from (x=0, y=32px) in the texture
                CELL_PX / 2, CELL_PX, // Crop width and height (2x wide, 2x tall)
                CELL_PX * (i + 1), // Destination X
                CELL_PX * (j + 1), // Destination Y
                CELL_PX / 2, CELL_PX // Destination width and height
            );

        }
    }


    // left side may not need checks!
    if (grid[i - 1] && grid[i - 1][j] && grid[i - 1][j + 1]) {
        if (grid[i - 1][j].occupant !== match) {
            overlayCtx.drawImage(
                texture,
                0, CELL_PX, // Crop from (x=0, y=32px) in the texture
                CELL_PX / 2, CELL_PX, // Crop width and height (2x wide, 2x tall)
                CELL_PX * (i) - CELL_PX / 2, // Destination X
                CELL_PX * j, // Destination Y (move down 1 cell)
                CELL_PX / 2, CELL_PX // Destination width and height
            );
        }

        if (grid[i - 1][j + 1].occupant !== match) {
            overlayCtx.drawImage(
                texture,
                0, CELL_PX * 2, // Crop from (x=0, y=32px) in the texture
                CELL_PX / 2, CELL_PX, // Crop width and height (2x wide, 2x tall)
                CELL_PX * (i) - CELL_PX / 2, // Destination X
                CELL_PX * (j + 1), // Destination Y (move down 1 cell)
                CELL_PX / 2, CELL_PX // Destination width and height
            );
        }
        // else {
        //     overlayCtx.drawImage(
        //         meshTexture,
        //         CELL_PX, CELL_PX * 2, // Crop from (x=0, y=32px) in the texture
        //         CELL_PX, CELL_PX,
        //         CELL_PX * (i) - CELL_PX / 2, // Destination X
        //         CELL_PX * (j + 1), // Destination Y (move down 1 cell)
        //         CELL_PX, CELL_PX
        //     )
        // }
    }

}

function choose_path_texture(paths, x, y) {
    let sx = 0;
    let sy = 0;

    // Convert array of {x, y} objects into a Set of 'x,y' strings for fast lookup
    const pathSet = new Set(paths.map(({ x, y }) => `${x},${y}`));

    let left = check_path_neighbour(pathSet, x - 1, y);
    let right = check_path_neighbour(pathSet, x + 1, y);
    let up = check_path_neighbour(pathSet, x, y - 1);
    let down = check_path_neighbour(pathSet, x, y + 1);

    if (up && down)
        sy = 1;
    else if (!up && !down)
        sy = 3;
    else if (!up && down)
        sy = 0;
    else if (up && !down)
        sy = 2;

    if (left && !right)
        sx = 2;
    else if (!left && right)
        sx = 0;
    else if (left && right)
        sx = 1;
    else if (!left && !right)
        sx = 3;

    return {
        x: sx * CELL_PX,
        y: sy * CELL_PX
    };
}

function check_path_neighbour(pathSet, x, y) {
    return pathSet.has(`${x},${y}`);
}





// take a (floor) layout as string and return a list of coords and types
export function parsePathLayout(mapString = null) {
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



// convert autotile cell coords to texture pixel coords
function choose_tile_texture(grid, x, y, match) {
    const coords = do_autotile(grid, x, y, match);
    return {
        x: coords.x * CELL_PX,
        y: coords.y * CELL_PX,
    };
}

function choose_occupant_texture(grid, x, y, match) {
    let sx = 0;
    let sy = 0;

    let left = check_grid_neighbour_occupant(grid, x - 1, y, match);
    let up = check_grid_neighbour_occupant(grid, x, y - 1, match);
    let right = check_grid_neighbour_occupant(grid, x + 1, y, match);
    let down = check_grid_neighbour_occupant(grid, x, y + 1, match);

    // let left_up = check_grid_neighbour_occupant(grid, x - 1, y - 1, match);
    // let right_up = check_grid_neighbour_occupant(grid, x + 1, y - 1, match);
    // let right_down = check_grid_neighbour_occupant(grid, x + 1, y + 1, match);
    // let left_down = check_grid_neighbour_occupant(grid, x - 1, y + 1, match);

    if (!up && down)
        sy = 0;
    else if (up && down)
        sy = 1;
    else if (up && !down)
        sy = 2;
    else if (!up && !down)
        sy = 3;

    if (!left && right)
        sx = 0;
    else if (left && right)
        sx = 1;
    else if (left && !right)
        sx = 2;
    else if (!left && !right)
        sx = 3;

    return {
        x: sx * CELL_PX,
        y: sy * CELL_PX
    };

    function check_grid_neighbour_occupant(grid, x, y, match) {
        if (grid[x] && grid[x][y]) {
            if (grid[x][y].occupant === match) {
                return match;
            }
        }
        return null;
    }
}




