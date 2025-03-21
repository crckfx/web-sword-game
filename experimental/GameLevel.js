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
            layer.texture = await this.getMapTexture(this.grid, layer);
            // finally, push the build layer
            this.mapLayers.push(layer);
        }
        console.log(`finished building ${this.mapLayers.length} map layers for floor`)

    }

    async load_map_occupants(map, textures, images, entities) {
        // maybe begin building the occupants here too?
        const parsedOccupantLayout = this.parseOccupantLayout(map.occupants);
        console.log(parsedOccupantLayout);
        this.applyOccupantsToGameGrid(this.grid, parsedOccupantLayout, entities, textures, images);
        
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
    async getMapTexture(grid, layer) {
        // get the pixel sizes for the map
        const mapWidthPx = CELL_PX * this.numGrid.x;
        const mapHeightPx = CELL_PX * this.numGrid.y;
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





}