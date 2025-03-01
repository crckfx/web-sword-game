import { Vector2 } from "./classes/Vector2.js";
import { gridCells } from "./helper/grid.js";
import { Player } from "./classes/Player.js";
import { Animations } from "./classes/Animations.js";
import { FrameIndexPattern } from "./classes/FrameIndexPattern.js";
import { STAND_DOWN, STAND_LEFT, STAND_RIGHT, STAND_UP, WALK_DOWN, WALK_LEFT, WALK_RIGHT, WALK_UP } from "./helper/walk.js";


export function createGameGrid(cellsX, cellsY) {
    const grid = new Array(cellsX);
    for (let i = 0; i < grid.length; i++) {
        grid[i] = new Array(cellsY);
    }
    for (let i = 0; i < NUM_GRID_X; i++) {
        for (let j = 0; j < NUM_GRID_Y; j++) {
            grid[i][j] = {
                floor: null,
                occupant: null,
            }

        }
    }
    return grid;
}

// game declarations
export const NUM_GRID_X = 24; // total number of map X cells
export const NUM_GRID_Y = 24; // total number of map Y cells
export const doodads = [];
export const entities = {}
// export const game_grid = createGameGrid(NUM_GRID_X, NUM_GRID_Y);
export const FLOOR_CELL_PIXELS = 16;
export const CAMERA_CELLS_X = 11;
export const CAMERA_CELLS_Y = 9;
// export const HtmlControls = getHtmlControls();
// ------------------------------------------------------

export const player = new Player({
    name: 'lachie',
    position: new Vector2(gridCells(1), gridCells(1)),
    isFacing: 'up',
    animations: new Animations({
        walkUp: new FrameIndexPattern(WALK_UP),
        walkLeft: new FrameIndexPattern(WALK_LEFT),
        walkDown: new FrameIndexPattern(WALK_DOWN),
        walkRight: new FrameIndexPattern(WALK_RIGHT),

        standUp: new FrameIndexPattern(STAND_UP),
        standLeft: new FrameIndexPattern(STAND_LEFT),
        standDown: new FrameIndexPattern(STAND_DOWN),
        standRight: new FrameIndexPattern(STAND_RIGHT),
    })
});