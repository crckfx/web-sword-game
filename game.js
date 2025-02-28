import { GameControls } from "./classes/GameControls.js";
import { getSpriteIndex } from "./sprite.js";
import { Vector2 } from "./classes/Vector2.js";
import { gridCells, moveTowards } from "./helper/grid.js";
import { Player } from "./classes/Player.js";
import { Entity } from "./classes/Entity.js";
import { Animations } from "./classes/Animations.js";
import { FrameIndexPattern } from "./classes/FrameIndexPattern.js";
import { STAND_DOWN, STAND_LEFT, STAND_RIGHT, STAND_UP, WALK_DOWN, WALK_LEFT, WALK_RIGHT, WALK_UP } from "./helper/walk.js";
import { GameLoop } from "./classes/GameLoop.js";
import { check_cell_is_in_line_of_sight } from "./helper/lineOfSight.js";
import { getHtmlControls } from "./document.js";


function createGameGrid(cellsX, cellsY) {
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

const waterDrawCycle = 3;
const playerDrawCycle = 4;


export const CAMERA_CELLS_X = 11;
export const CAMERA_CELLS_Y = 9;

function check_all_lines_of_sight() {
    const px = player.position.x;
    const py = player.position.y;
    for (const key in entities) {
        entities[key].hasAlert = check_cell_is_in_line_of_sight(px, py, entities[key]);
    }
}

function position_is_in_bounds(pos, min, max) {
    if (pos < min || pos > max) return false;
    return true;
}

function cell_is_occupied(cell) {
    return cell.occupant === null;
}



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

export const images = {};
export const textures = {};
export const game = {
    renderer: null,
    gameLoop: null,
    grid: createGameGrid(NUM_GRID_X, NUM_GRID_Y),
    textures: {},
    images:{},
    entities: {},
};

export const HtmlControls = getHtmlControls();
export const gameControls = new GameControls({HtmlControls});


export function update(delta) {
    const distance = moveTowards(player, player.destination, 1);
    const hasArrived = distance < 1;
    if (hasArrived) {
        tryMove();
    }
    player.step(delta);
}

export function render() {
    game.renderer.draw();
}

export const tryMove = () => {
    if (!gameControls.current_dpad_dir) {
        switch (player.isFacing) {
            case 'left':
                player.animations.play('standLeft');
                break;
            case 'right':
                player.animations.play('standRight');
                break;
            case 'up':
                player.animations.play('standUp');
                break;
            case 'down':
                player.animations.play('standDown');
                break;
        }
        return;
    }

    let nextX = player.destination.x;
    let nextY = player.destination.y;

    player.isFacing = gameControls.current_dpad_dir;
    switch (player.isFacing) {
        case 'left':
            nextX -= FLOOR_CELL_PIXELS;
            player.animations.play('walkLeft');
            break;
        case 'right':
            player.animations.play('walkRight');
            nextX += FLOOR_CELL_PIXELS;
            break;
        case 'up':
            player.animations.play('walkUp');
            nextY -= FLOOR_CELL_PIXELS;
            break;
        case 'down':
            player.animations.play('walkDown');
            nextY += FLOOR_CELL_PIXELS;
            break;
    }

    const x = nextX / FLOOR_CELL_PIXELS;
    const y = nextY / FLOOR_CELL_PIXELS;
    // console.log(`nextX:${nextX / FLOOR_CELL_PIXELS}, nextY:${nextY / FLOOR_CELL_PIXELS}`);

    if (game.grid[x] && game.grid[x][y]) {
        if (game.grid[x][y].occupant === null) {
            // game.gameLoop.increment_draw_count();
            player.destination.x = nextX;
            player.destination.y = nextY;
        }

    }
}


