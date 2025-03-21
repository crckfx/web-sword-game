import { Item } from "../classes/objects/Item.js";
import { Vector2 } from "../classes/Vector2.js";
import { CELL_PX } from "../document.js";
import { do_autotile_alt } from "../helper/autotile_newgrid.js";
import { createGrid_alt, gridCells } from "../helper/grid.js";
import { applyFloorToGameGrid, applyOccupantsToGameGrid, getMapTexture, occupantMap, parseFloorLayout, parseOccupantLayout, tileMap } from "./map-loader.js";
import { hackyTextureChooser, player } from "../helper/world-loader.js";
import { createDrawKit } from "./draw-kit.js";
import { MapLayer } from "./MapLayer.js";

export class GameLevel {

    mapLayers = null;
    constructor({ gridX = 4, gridY = 4 }) {
        this.numGrid = new Vector2(gridX, gridY);
        // let's try doing the grid y-first
        this.grid = createGrid_alt(gridX, gridY);
    }


}