import { Vector2 } from "../classes/Vector2.js";
import { CELL_PX } from "../document.js";
import { createDrawKit } from "./draw-kit.js";
import { applyFloorToLevelLayer, applyOccupantsToLevel, getMapTexture, occupantSwitch, parseFloorLayout, parseOccupantLayout } from "./map-loader.js";
import { MapLayer } from "./MapLayer.js";

export class GameLevel {
    mapLayers = null;
    drawKit = null;

    constructor({ gridX = 4, gridY = 4, map, images, entities }) {
        this.numGrid = new Vector2(gridX, gridY);
        // let's try doing the grid y-first
        this.grid = this.createLevelGrid(gridX, gridY);
        this.entityData = { ...map.entityData }; // transfer the entity data here and now

        this.loadMap(map, images, entities);
    }

    // 
    createLevelGrid(cellsX, cellsY) {
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

    loadMap(map, images, entities) {
        // "LOAD MAP FLOORS"
        const mapLayers = [];
        const mapWidthPx = CELL_PX * this.numGrid.x;
        const mapHeightPx = CELL_PX * this.numGrid.y;

        for (let i = 0; i < map.floors.length; i++) {
            const floor = map.floors[i];
            // push a layer for each floor layer; assume the values are filled out for now
            const layer = new MapLayer(
                images[floor.imageName],
                floor.match,
                floor.auto,
                floor.z
            )
            // add the parsed layout (it isn't a param yet lol)
            layer.floorLayout = parseFloorLayout(floor);
            // apply the floorLayout data for this layer to the level grid
            applyFloorToLevelLayer(this.grid, layer.floorLayout);
            // build the 'mini-drawKit' for this layer
            layer.texture = getMapTexture(this.grid, layer, mapWidthPx, mapHeightPx);
            // finally, push the build layer
            mapLayers.push(layer);
        }
        console.log(`finished building ${mapLayers.length} map layers for floor`)
        this.drawKit = createDrawKit(mapLayers, mapWidthPx, mapHeightPx);


        // "LOAD MAP OCCUPANTS"
        // turn map string into set of coords and occupants
        const parsedOccupantLayout = parseOccupantLayout(map.occupants);
        // write the parsed map onto the level's grid
        applyOccupantsToLevel(this, parsedOccupantLayout, images, entities);
    
        for (let j = 0; j < this.numGrid.y; j++) {
            for (let i = 0; i < this.numGrid.x; i++) {
                const cell = this.grid[j][i];
                if (cell.occupant !== null) {
                    occupantSwitch(
                        this.drawKit.occupants.ctx,
                        this.drawKit.overlays.ctx,
                        this.grid,
                        images, i, j)
                }
            }
        }

    }





}