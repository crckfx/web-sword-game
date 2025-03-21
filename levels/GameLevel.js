import { Vector2 } from "../classes/Vector2.js";

export class GameLevel {
    mapLayers = null;
    playerInitCellPos = new Vector2(null, null);
    initialCellPositions = {
        gary: new Vector2(null, null),
        fred: new Vector2(null, null),
        george: new Vector2(null, null),
        harold: new Vector2(null, null),
    }
    constructor({ gridX = 4, gridY = 4 }) {
        this.numGrid = new Vector2(gridX, gridY);
        // let's try doing the grid y-first
        this.grid = this.createLevelGrid(gridX, gridY);
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
}