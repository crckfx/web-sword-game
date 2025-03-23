import { Vector2 } from "../classes/Vector2.js";
import { CELL_PX } from "../document.js";
import { createDrawKit } from "./draw-kit.js";
import { getMapTexture } from "./map-loader.js";

export class GameLevel {
    mapLayers = null;
    entityData = null;
    drawKit = null;

    constructor({ gridX = 4, gridY = 4, map, mapLayers }) {
        this.numGrid = new Vector2(gridX, gridY);
        // let's try doing the grid y-first
        this.grid = this.createLevelGrid(gridX, gridY);
        this.entityData = { ...map.entityData }; // transfer the entity data here and now

        // this.mapLayers = mapLayers;
        // this.loadMap(gridX, gridY);
        // this.drawKit = createDrawKit(this.mapLayers, gridX * CELL_PX, gridY * CELL_PX);

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

    // ***** experimental ****
    loadMap(gridX, gridY) {
        for (let i = 0; i < this.mapLayers.length; i++) {
            const layer = this.mapLayers[i];
            // it already has a floorlayout
            // apply the floorLayout data for this layer to the level grid
            applyFloorToGameGrid(this.grid, layer.floorLayout);
            if (layer.image) {
                layer.texture = getMapTexture(this.grid, layer, gridX * CELL_PX, gridY * CELL_PX);
            }
        }
    } // **********************
}