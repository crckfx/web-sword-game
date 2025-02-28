import { Renderer } from "../classes/Renderer.js";
import { CAMERA_CELLS_X, CAMERA_CELLS_Y, createGameGrid } from "../game.js";

export class Game {
    constructor() {
        //
        this.renderer = null;
        this.gameLoop = null;
        this.grid = null;
        this.textures = {};
        this.images = {};
        this.entities = {};
    }

    init_game(cellsX, cellsY, textures, images) {
        this.textures = textures;
        this.images = images;
        this.grid = createGameGrid(cellsX, cellsY);
        this.renderer = new Renderer({
            canvas: document.getElementById('game_canv'),
            ctx: document.getElementById('game_canv').getContext("2d"),
            grid: this.grid,
            cameraCellsX: CAMERA_CELLS_X,
            cameraCellsY: CAMERA_CELLS_Y,
            textures: textures,
            images: images,
        });
        console.log(this);
    }

}


// export const game = {
//     renderer: null,
//     gameLoop: null,
//     grid: createGameGrid(NUM_GRID_X, NUM_GRID_Y),
//     textures: {},
//     images: {},
//     entities: {},
// };