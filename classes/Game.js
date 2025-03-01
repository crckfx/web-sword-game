import { GameControls } from "../controls/GameControls.js";
import { Renderer } from "./Renderer.js";
import { getHtmlControls, CAMERA_CELLS, FLOOR_CELL_PIXELS, player, pauseMenu, gameSpeech } from "../document.js";
import { GameLoop } from "./GameLoop.js";
import { createGrid, facingToVector, moveTowards } from "../helper/grid.js";
import { Vector2 } from "./Vector2.js";

export class Game {
    renderer = null;
    gameLoop = null;
    grid = null;
    textures = {};
    images = {};
    entities = {};
    controls = null;

    // pause stuff
    isPaused = false;
    pauseTimestamp = null;
    isInDialogue = false;

    constructor() {
        this.controls = new GameControls({
            HtmlControls: getHtmlControls(),
            bang_A: this.interact.bind(this),
            bang_B: this.back.bind(this),
            bang_pause: this.press_pause_menu.bind(this),
            // bang_resume: this.resume.bind(this),
        });
        this.gameLoop = new GameLoop(this.update.bind(this), this.render.bind(this));
    }

    init_game(cellsX, cellsY) {
        this.grid = createGrid(cellsX, cellsY);
        this.renderer = new Renderer({
            canvas: document.getElementById('game_canv'),
            ctx: document.getElementById('game_canv').getContext("2d"),
            cameraCellsX: CAMERA_CELLS.x,
            cameraCellsY: CAMERA_CELLS.y,
            game: this,
        });
    }

    update(delta) {
        const distance = moveTowards(player, player.destination, 1);
        const hasArrived = distance < 1;
        if (hasArrived) {

            // "can the player interact with the cell they are facing?"
            // (but only if we don't have one set)
            if (player.interactTarget === null) {
                const currentCell = new Vector2(player.position.x / FLOOR_CELL_PIXELS, player.position.y / FLOOR_CELL_PIXELS);
                const interactOffset = facingToVector(player.isFacing);
                const interactCell = new Vector2(currentCell.x + interactOffset.x, currentCell.y + interactOffset.y);
                if (this.grid[interactCell.x] && this.grid[interactCell.x][interactCell.y]) {
                    const cell = this.grid[interactCell.x][interactCell.y];
                    if (typeof(cell.occupant) === "object") {
                        player.interactTarget = cell.occupant;
                        // console.log(cell.occupant);
                    }
                };
            }

            this.tryMove();

        } else {
            player.interactTarget = null;
        }
        player.step(delta);
    }

    render() {
        this.renderer.draw();
    }

    interact() {
        // console.log('oh wowza did ya press "A"?');
        // const interactTarget = player.interactTarget;
        // console.log(`typeof: ${typeof(interactTarget)}, value: ${interactTarget}`);
        if (player.interactTarget !== null) {
            console.log(`Interacted with ${player.interactTarget.name}`);
            gameSpeech.classList.add('active');
            this.dialogue();
            
        }
        // const target = this.grid[interactTarget.x][interactTarget.y].occupant;
        // console.log(`Interacted with ${player.interactTarget.name}`);
    }
    back() {
        console.log('oh wowza did ya press "B"?');
        if (this.isInDialogue) {
            this.exitDialogue();
        }
    }
    // ---------
    press_pause_menu() {
        if (this.isPaused) {
            this.resume();
        } else {
            this.pause();
        }
    }
    pause() {
        this.isPaused = true;
        this.gameLoop.stop();
        this.pauseTimestamp = performance.now(); // Capture when we paused
        console.log("pause game");
        this.renderer.drawPauseMenu();
        pauseMenu.classList.add('paused');
    }
    resume() {
        if (this.pauseTimestamp) {
            const pauseDuration = performance.now() - this.pauseTimestamp;
            this.gameLoop.lastFrameTime += pauseDuration; // Shift it forward
            this.pauseTimestamp = null;
        }     
        pauseMenu.classList.remove('paused');
        this.gameLoop.start();
        console.log("resume game");
        this.isPaused = false;
    }

    dialogue() {
        // this.gameLoop.stop();
        this.isInDialogue = true;
        gameSpeech.innerHTML = player.interactTarget.interactMessage;
        gameSpeech.classList.add('active');
        // console.log("pause game");
        // this.renderer.drawPauseMenu();
    }    
    exitDialogue() {
        gameSpeech.classList.remove('active');
        this.isInDialogue = false;
        gameSpeech.innerHTML = "";
    }
    // ---------

    tryMove() {
        if (!this.controls.current_dpad_dir || this.isInDialogue) {
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
