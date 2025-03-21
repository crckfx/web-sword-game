// map-loader.js 
// handles loading of map from text string. 
// it seems cool to store a map as a text file. 
// we don't fetch a text file or anything here - just pass map strings in

import { Item } from "../classes/objects/Item.js";
import { Vector2 } from "../classes/Vector2.js";
import { NUM_GRID, CELL_PX } from "../document.js";
import { choose_4x4_texture_coords, do_autotile_alt } from "../helper/autotile_newgrid.js";
import { check_grid_neighbour_floor, gridCells } from "../helper/grid.js";
import { hackyTextureChooser, player } from "../helper/world-loader.js";
import { createDrawKit } from "./draw-kit.js";
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


// translate an occupant name into a game entity
export function applyOccupantsToGameGrid(grid, parsedOccupantLayout, textures, images, entities) {
    for (const { x, y, occupant } of parsedOccupantLayout) {
        if (grid[y] && grid[y][x]) {
            switch (occupant) {
                case 'tree': case 'largeTree': case 'fence':
                    grid[y][x].occupant = occupant;
                    break;
                case 'lachie':
                    // removeOldOccupant(grid, x, y)
                    const cell = grid[y][x];
                    player.position.x = gridCells(x);
                    player.position.y = gridCells(y);
                    player.destination.x = gridCells(x);
                    player.destination.y = gridCells(y);
                    // cell.occupant = player;
                    cell.occupant = null;
                    break;
                case 'gary': case 'fred': case 'george': case 'harold':
                    const e = entities[occupant]; // remember, we pass in the entities object as an argument
                    e.position.x = gridCells(x);
                    e.position.y = gridCells(y);
                    grid[y][x].occupant = e;
                    break;
                case 'apple':
                    const newApple = new Item('apple', { x: gridCells(x), y: gridCells(y) }, textures.apple, textures.apple2);
                    grid[y][x].occupant = newApple;
                    break;
                case 'miscItem':
                    const newItem = new Item('miscItem', { x: gridCells(x), y: gridCells(y) }, null, images.questionMark);
                    grid[y][x].occupant = newItem;
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



// function to create a background image as a canvas
export async function getMapTexture(grid, layer, mapWidthPx, mapHeightPx) {
    // get the pixel sizes for the map

    // Create an offscreen canvas for each sprite
    const mapCanvas = document.createElement('canvas');
    mapCanvas.width = mapWidthPx;
    mapCanvas.height = mapHeightPx;
    const mapCtx = mapCanvas.getContext('2d');
    mapCtx.imageSmoothingEnabled = false;


    for (const key in layer.floorLayout) {
        const layoutEntry = layer.floorLayout[key];
        const i = layoutEntry.x;
        const j = layoutEntry.y

        if (grid[j] && grid[j][i]) {


            const cell = grid[j][i];
            // console.log(layoutEntry, cell)
            if (cell.floor === layer.match && cell.z === layer.z) {
                if (!layer.auto) {
                    mapCtx.drawImage(layer.image,
                        i * CELL_PX, j * CELL_PX, CELL_PX, CELL_PX
                    );
                } else {
                    const data = choose_tile_texture(grid, i, j, layer.match, cell.z)
                    mapCtx.drawImage(layer.image,
                        data.x, data.y, CELL_PX, CELL_PX,
                        i * CELL_PX, j * CELL_PX, CELL_PX, CELL_PX
                    )
                }
            }

        }



    }

    return {
        // floorOnly: floorOnly,
        canvas: mapCanvas,
        ctx: mapCtx
    }
}


// convert autotile cell coords to texture pixel coords
function choose_tile_texture(grid, x, y, match, z) {
    const coords = do_autotile_alt(grid, x, y, match, z);
    return {
        x: coords.x * CELL_PX,
        y: coords.y * CELL_PX,
    };
}




// take a grid and a layout list, and write to the grid's 
export function applyFloorToGameGrid(grid, parsedFloorLayout) {
    for (const { x, y, tile, z } of parsedFloorLayout) {
        if (grid[y] && grid[y][x]) {
            // if the position exists in the grid, write the floor name to it
            grid[y][x].floor = tile;
            grid[y][x].z = z;
            // for water, insert an occupant too
            if (tile === 'water') {
                grid[y][x].occupant = 'water';
            }
        }
    }
}


export async function load_map_floors(level, map) {
    const mapLayers = []; // add the map layers here instead
    const mapWidthPx = CELL_PX * level.numGrid.x;
    const mapHeightPx = CELL_PX * level.numGrid.y;

    for (let i = 0; i < map.floors.length; i++) {
        const floor = map.floors[i];
        console.log(i, hackyTextureChooser(i), floor.match);

        // push a layer for each floor layer; assume the values are filled out for now
        const layer = new MapLayer(
            hackyTextureChooser(i),
            floor.match,
            floor.auto,
            floor.z
        )
        // add the parsed layout (it isn't a param yet lol)
        layer.floorLayout = parseFloorLayout(floor);
        // apply the floorLayout data for this layer to the level grid
        applyFloorToGameGrid(level.grid, layer.floorLayout);
        // build the mini-drawKit for this layer
        layer.texture = await getMapTexture(level.grid, layer, mapWidthPx, mapHeightPx);
        // finally, push the build layer
        mapLayers.push(layer);
    }
    console.log(`finished building ${mapLayers.length} map layers for floor`)

    return createDrawKit(mapLayers, mapWidthPx, mapHeightPx);
}

export async function load_map_occupants(level, map, textures, images, entities) {
    // maybe begin building the occupants here too?
    const parsedOccupantLayout = parseOccupantLayout(map.occupants);
    console.log(parsedOccupantLayout);
    applyOccupantsToGameGrid(level.grid, parsedOccupantLayout, textures, images, entities);

    for (let j = 0; j < level.numGrid.y; j++) {
        for (let i = 0; i < level.numGrid.x; i++) {
            const cell = level.grid[j][i];
            if (cell.occupant !== null) {
                // console.log(cell.occupant)
                occupantSwitch(
                    level.drawKit.occupants.ctx,
                    level.drawKit.overlays.ctx,
                    level.grid, textures,
                    images, i, j)
            }
        }
    }
}


function occupantSwitch(mapCtx, overlayCtx, grid, textures, images, i, j) {
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
                // currently checks for arrangement 
                // ..T..
                // ..c..  (where cell = c, and largeTree = T)
                // ie. make sure there is another largetree element ABOVE this. 
                // otherwise, don't draw. we need a cell underneath this one to be a tree otherwise 
                if (check_tree_cell(grid, i, j, 'largeTree')) {
                    // base map canvas gets bottom 2 cells (skip top 1 cell)
                    mapCtx.drawImage(
                        textures.tree_S_A,
                        0, CELL_PX, // Crop from (x=0, y=32px) in the texture
                        CELL_PX * 2, CELL_PX * 2, // Crop width and height (2x wide, 2x tall)
                        CELL_PX * (i) - CELL_PX / 2, // Destination X
                        CELL_PX * (j - 1), // Destination Y 
                        CELL_PX * 2, CELL_PX * 2 // Destination width and height
                    );

                    // overlay canvas gets top 1 cell
                    overlayCtx.drawImage(
                        textures.tree_S_A,
                        0, 0, // Crop from (x=0, y=0) in the texture
                        CELL_PX * 2, CELL_PX, // Crop width and height (2x wide, 1x tall)
                        CELL_PX * (i) - CELL_PX / 2, // Destination X
                        CELL_PX * (j - 2), // Destination Y 
                        CELL_PX * 2, CELL_PX // Destination width and height
                    );

                    // this.apply_largeTree_x_overlays(grid, textures.tree_S_A, overlayCtx, i, j-2, 'largeTree', textures.meshTree);
                    // TODO: WRITE A NEW FUNCTION TO HANDLE THE SIDE OVERLAYS; THE TOP IS ALREADY DONE
                } else {
                    // console.log('skipping tree cell that does not have down,right,down-right neighbours');
                }
                break;

        }
    }
}



