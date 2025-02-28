export class Game {
    constructor(gridX, gridY) {
        //
        this.renderer = null;
        this.gameLoop = null;
        this.grid = null;
        this.textures = {};
        this.images = {};
        this.entities = {};
    }

    init_game(textures) {
        // this.textures = textures
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