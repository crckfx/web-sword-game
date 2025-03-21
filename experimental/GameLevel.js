import { Item } from "../classes/objects/Item.js";
import { Vector2 } from "../classes/Vector2.js";
import { CELL_PX } from "../document.js";
import { do_autotile } from "../helper/autotile.js";
import { do_autotile_alt } from "../helper/autotile_newgrid.js";
import { gridCells } from "../helper/grid.js";
import { occupantMap, tileMap } from "../helper/map-loader.js";
import { hackyTextureChooser, player } from "../helper/world-loader.js";
import { MapLayer } from "./MapLayer.js";

export class GameLevel {
    constructor({ gridX = 4, gridY = 4, mapLayers }) {
        this.numGrid = new Vector2(gridX, gridY);
        // let's try doing the grid y-first
        this.grid = this.createGrid_alt(gridX, gridY);
        this.mapLayers = mapLayers ?? [new MapLayer()];
    }

    createGrid_alt(cellsX, cellsY) {
        const grid = new Array(cellsY);
        for (let j = 0; j < cellsY; j++) {
            grid[j] = new Array(cellsX);
            for (let i = 0; i < cellsX; i++) {
                grid[j][i] = {
                    floor: null,
                    occupant: null,
                    z: 0
                }
            }
        }
        return grid;
    }

    async load_map_floors(map) {
        this.mapLayers = []; // add the map layers here instead
        const mapWidthPx = CELL_PX * this.numGrid.x;
        const mapHeightPx = CELL_PX * this.numGrid.y;

        for (let i = 0; i < map.floors.length; i++) {
            const floor = map.floors[i];
            // console.log(i, hackyTextureChooser(i));

            // push a layer for each floor layer; assume the values are filled out for now
            const layer = new MapLayer(
                hackyTextureChooser(i),
                floor.match,
                floor.auto,
                floor.z
            )
            // add the parsed layout (it isn't a param yet lol)
            layer.floorLayout = this.parseFloorLayout(floor);
            // apply the floorLayout data for this layer to the level grid
            this.applyFloorToGameGrid(this.grid, layer.floorLayout);
            // build the drawKit for this layer
            layer.texture = await this.getMapTexture(this.grid, layer, mapWidthPx, mapHeightPx);
            // finally, push the build layer
            this.mapLayers.push(layer);
        }
        console.log(`finished building ${this.mapLayers.length} map layers for floor`)

        const dkCanv_floor = document.createElement('canvas');
        dkCanv_floor.width = mapWidthPx;
        dkCanv_floor.height = mapHeightPx;
        const dkCtx_floor = dkCanv_floor.getContext('2d');

        const dkCanv_occ = document.createElement('canvas');
        dkCanv_occ.width = mapWidthPx;
        dkCanv_occ.height = mapHeightPx;
        const dkCtx_occ = dkCanv_floor.getContext('2d');

        const dkCanv_over = document.createElement('canvas');
        dkCanv_over.width = mapWidthPx;
        dkCanv_over.height = mapHeightPx;
        const dkCtx_over = dkCanv_over.getContext('2d');



        const levelDrawKit = {
            floors: {
                canvas: dkCanv_floor,
                ctx: dkCtx_floor
            },
            occupants: {
                canvas: dkCanv_occ,
                ctx: dkCtx_occ
            },
            overlays: {
                canvas: dkCanv_over,
                ctx: dkCtx_over  
            }
        }

        for (let i = 0; i < this.mapLayers.length; i++) {
            const layer = this.mapLayers[i];
            levelDrawKit.floors.ctx.drawImage(
                layer.texture.mapFloor.canvas,
                0, 0, layer.texture.mapFloor.canvas.width, layer.texture.mapFloor.canvas.height
            )
        }

        this.drawKit = levelDrawKit;

    }




    // translate an occupant name into a game entity
    applyOccupantsToGameGrid(grid, parsedOccupantLayout, textures, images, entities) {
        for (const { x, y, occupant } of parsedOccupantLayout) {
            if (grid[y] && grid[y][x]) {
                switch (occupant) {
                    case 'tree': case 'largeTree': case 'fence':
                        grid[y][x].occupant = occupant;
                        break;
                    case 'lachie':
                        // removeOldOccupant(grid, x, y)
                        const cell = grid[y][x];
                        // player.position.x = gridCells(x);
                        // player.position.y = gridCells(y);
                        // player.destination.x = gridCells(x);
                        // player.destination.y = gridCells(y);
                        cell.occupant = player;
                        // cell.occupant = null;
                        break;
                    case 'gary': case 'fred': case 'george': case 'harold':
                        const e = entities[occupant]; // remember, we pass in the entities object as an argument
                        // e.position.x = gridCells(x);
                        // e.position.y = gridCells(y);
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


    // take a grid and a layout list, and write to the grid's 
    applyFloorToGameGrid(grid, parsedFloorLayout) {
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

    // function to create a background image as a canvas
    async getMapTexture(grid, layer, mapWidthPx, mapHeightPx) {
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

            if (grid[layoutEntry.y] && grid[layoutEntry.x]) {


                const cell = grid[layoutEntry.y][layoutEntry.x];
                // console.log(layoutEntry, cell)
                if (cell.floor === layer.match && cell.z === layer.z) {
                    if (!layer.auto) {
                        mapCtx.drawImage(layer.image,
                            i * CELL_PX, j * CELL_PX, CELL_PX, CELL_PX
                        );
                    } else {
                        const data = this.choose_tile_texture(grid, i, j, layer.match, cell.z)
                        mapCtx.drawImage(layer.image,
                            data.x, data.y, CELL_PX, CELL_PX,
                            i * CELL_PX, j * CELL_PX, CELL_PX, CELL_PX
                        )
                    }
                }

            }



        }

        return {
            mapFloor: {
                // floorOnly: floorOnly,
                canvas: mapCanvas,
                ctx: mapCtx
            },
            // mapOverlays: {
            //     canvas: overlayCanvas,
            //     ctx: overlayCtx
            // }
        }
    }


    // convert autotile cell coords to texture pixel coords
    choose_tile_texture(grid, x, y, match, z) {
        const coords = do_autotile_alt(grid, x, y, match, z);
        return {
            x: coords.x * CELL_PX,
            y: coords.y * CELL_PX,
        };
    }

    // take a (floor) layout as string and return a list of coords and types
    parseFloorLayout(floor) {
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
    parseOccupantLayout(mapString) {
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




    async load_map_occupants(map, textures, images, entities) {
        // maybe begin building the occupants here too?
        const parsedOccupantLayout = this.parseOccupantLayout(map.occupants);
        console.log(parsedOccupantLayout);
        this.applyOccupantsToGameGrid(this.grid, parsedOccupantLayout, textures, images, entities);


        for (let j = 0; j < this.numGrid.y; j++) {
            for (let i = 0; i < this.numGrid.x; i++) {
                const cell = this.grid[j][i];
                if (cell.occupant !== null) {
                    // console.log(cell.occupant)
                    this.occupantSwitch_alt(this.drawKit.occupants.ctx, this.drawKit.overlays.ctx, this.grid, textures, images, i, j)

                }
            }
        }
    }

    occupantSwitch_alt(mapCtx, overlayCtx, grid, textures, images, i, j) {
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
                    const fenceData = this.choose_occupant_texture(grid, i, j, 'fence');
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
                    // ie. make sure there is another largetree element ABOVE this. 
                    // otherwise, don't draw. we need a cell underneath this one to be a tree otherwise 
                    if (this.check_tree_cell(grid, i, j)) {

                        // base map canvas gets bottom 2 cells (skip top 1 cell)
                        mapCtx.drawImage(
                            textures.tree_S_A,
                            0, CELL_PX, // Crop from (x=0, y=32px) in the texture
                            CELL_PX * 2, CELL_PX * 2, // Crop width and height (2x wide, 2x tall)
                            CELL_PX * (i) - CELL_PX / 2, // Destination X
                            CELL_PX * (j-1), // Destination Y 
                            CELL_PX * 2, CELL_PX * 2 // Destination width and height
                        );

                        // overlay canvas gets top 1 cell
                        overlayCtx.drawImage(
                            textures.tree_S_A,
                            0, 0, // Crop from (x=0, y=0) in the texture
                            CELL_PX * 2, CELL_PX, // Crop width and height (2x wide, 1x tall)
                            CELL_PX * (i) - CELL_PX / 2, // Destination X
                            CELL_PX * (j - 2), // Destination Y (unchanged)
                            CELL_PX * 2, CELL_PX // Destination width and height
                        );

                        // overlay canvas should also draw these "tree edges"; the parts that extend outside the containing cell.
                        // TODO: WRITE A NEW FUNCTION TO HANDLE THE SIDE OVERLAYS; THE TOP IS ALREADY DONE
                        // this.apply_largeTree_x_overlays(grid, textures.tree_S_A, overlayCtx, i, j-2, 'largeTree', textures.meshTree);


                    } else {
                        // console.log('skipping tree cell that does not have down,right,down-right neighbours');
                    }
                    break;

            }
        }
    }



    check_tree_cell(grid, x, y) {
        if (!grid[y] || !grid[y][x]) {
            return false;
        }

        // check cell above
        if (grid[y-1] && grid[y-1][x] ) {
            const cell = grid[y-1][x];
            if (cell.occupant !== 'largeTree') return false;
        }
    
        return true;
    
    }
    
    choose_occupant_texture(grid, x, y, match) {
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
            if (grid[y] && grid[y][x]) {
                if (grid[y][x].occupant === match) {
                    return match;
                }
            }
            return null;
        }
    }
   


}