import { GameControls } from "../controls/GameControls.js";
import { Renderer } from "./Renderer.js";
import { getHtmlControls, CAMERA_CELLS_X, CAMERA_CELLS_Y, createGameGrid, FLOOR_CELL_PIXELS, player } from "../document.js";
import { GameLoop } from "./GameLoop.js";
import { moveTowards } from "../helper/grid.js";

export class Game {
    constructor() {
        //
        this.renderer = null;
        this.gameLoop = null;
        this.grid = null;
        this.textures = {};
        this.images = {};
        this.entities = {};
        this.controls = new GameControls({ HtmlControls: getHtmlControls() });;
        this.gameLoop = new GameLoop(this.update.bind(this), this.render.bind(this));
    }

    init_game(cellsX, cellsY) {
        // this.textures = textures;
        // this.images = images;
        this.grid = createGameGrid(cellsX, cellsY);
        this.renderer = new Renderer({
            canvas: document.getElementById('game_canv'),
            ctx: document.getElementById('game_canv').getContext("2d"),
            cameraCellsX: CAMERA_CELLS_X,
            cameraCellsY: CAMERA_CELLS_Y,
            game: this,
        });
        // this.controls = new GameControls({HtmlControls: getHtmlControls()});


    }

    update(delta) {
        const distance = moveTowards(player, player.destination, 1);
        const hasArrived = distance < 1;
        if (hasArrived) {
            this.tryMove();
            // console.log(this);
        }
        player.step(delta);
    }

    render() {
        this.renderer.draw();
    }



    tryMove() {
        if (!this.controls.current_dpad_dir) {
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

        player.isFacing = this.controls.current_dpad_dir;
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

        if (this.grid[x] && this.grid[x][y]) {
            if (this.grid[x][y].occupant === null) {
                // game.gameLoop.increment_draw_count();
                player.destination.x = nextX;
                player.destination.y = nextY;
            }

        }
    }


}
