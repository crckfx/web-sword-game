import { GameControls } from "../controls/GameControls.js";
import { Renderer } from "./Renderer.js";
import { Item } from "./Item.js";
import { getHtmlControls, CAMERA_CELLS, FLOOR_CELL_PIXELS, pauseMenu, gameSpeech } from "../document.js";
import { GameLoop } from "./GameLoop.js";
import { createGrid, facingToVector, moveTowards } from "../helper/grid.js";
import { Vector2 } from "./Vector2.js";
import { Entity } from "./Entity.js";
import { player } from "../helper/world-loader.js";

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
            // bang_Y: this.log_entity_position.bind(this),
            bang_Y: this.toggleShowSampleText.bind(this),

            bang_X: this.toggleShowPlayerInventory.bind(this),
            bang_pause: this.press_pause_menu.bind(this),
            bang_resume: this.press_pause_menu.bind(this),
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
        const distance = moveTowards(player, player.destination, player.speed);
        const hasArrived = distance < 1;
        if (hasArrived) {
            player.interactTarget = null;
            // "can the player interact with the cell they are facing?"
            // (but only if we don't have one set already)
            if (player.interactTarget === null) {
                const currentCell = new Vector2(player.position.x / FLOOR_CELL_PIXELS, player.position.y / FLOOR_CELL_PIXELS);
                const interactOffset = facingToVector(player.isFacing);
                const interactCell = new Vector2(currentCell.x + interactOffset.x, currentCell.y + interactOffset.y);
                if (this.grid[interactCell.x] && this.grid[interactCell.x][interactCell.y]) {
                    const occupant = this.grid[interactCell.x][interactCell.y].occupant;
                    // if (typeof(cell.occupant) === "object") {
                    if (occupant instanceof Item || occupant instanceof Entity) {
                        player.interactTarget = occupant;
                        // console.log(cell.occupant);
                    }
                };
            }
            this.tryMove();
        }
        player.step(delta);
    }

    render() {
        this.renderer.draw();
    }

    interact() {
        const t = player.interactTarget;
        if (t !== null) {
            if (t instanceof Entity) {
                console.log(`Interacted with entity ${t.name}`);
                this.dialogue();
            } else if (t instanceof Item) {
                console.log(`Interacted with item ${t.name}`);
                const x = t.position.x / FLOOR_CELL_PIXELS;
                const y = t.position.y / FLOOR_CELL_PIXELS;
                if (this.grid[x] && this.grid[x][y]) {
                    console.log(`take item from ${x}, ${y}`);
                    if (this.give_item_to(t, player)) {
                        player.interactTarget = null;
                    };
                }
            } else {
                console.log("not sure what you're interacting with", t);
            }

        }
    }

    back() {
        // console.log('oh wowza did ya press "B"?');
        if (this.isPaused) {
            this.resume();
        } else if (this.isInDialogue) {
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
        // this.renderer.drawPauseMenu();
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
        const t = player.interactTarget;
        // if (t.interactCondition !== undefined) {
        //     if (t.interactCondition !== true) {
        //         return;
        //     }
        // }

        if (!t.isSatisfied && t.interactCondition !== null) {

            const conditionIsMet = t.interactCondition() > -1;
            console.log(`interact condition: ${conditionIsMet}`)

            if (conditionIsMet) {
                console.log(`this is the case where we should play out the interactAction`);
                // console.log(t.interactAction())
                t.interactAction();
                t.isSatisfied = true;
            }

        }


        // this.gameLoop.stop();
        this.isInDialogue = true;
        const interactPos = t.position;

        player.interactTarget.isFacing = this.compare_two_vec2(player.position, interactPos);

        // gameSpeech.name.textContent = t.name;
        // gameSpeech.message.textContent = `\"${t.getDialogue()}\"`;
        // gameSpeech.container.classList.add('active');
        this.renderer.modifySampleText(t.name, t.getDialogue());
        this.toggleShowSampleText(true);

        // console.log("pause game");
        // this.renderer.drawPauseMenu();
    }
    exitDialogue() {
        // gameSpeech.container.classList.remove('active');
        this.isInDialogue = false;
        gameSpeech.name.innerHTML = "";
        gameSpeech.message.innerHTML = "";
        this.toggleShowSampleText(false);
    }
    // ---------

    showDialogue(t = null, message = "this is placeholder dialogue") {
        this.isInDialogue = true;
        if (t !== null) {
            gameSpeech.name.textContent = t.name;
            gameSpeech.message.textContent = `\"${t.getDialogue()}\"`;
        } else {
            gameSpeech.name.textContent = "";
            gameSpeech.message.textContent = message;
        }
        gameSpeech.container.classList.add('active');
    }


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

    compare_two_vec2(vecA, vecB) {
        // "on what side of vecB is vecA situated?"
        if (vecA.x > vecB.x) return 'right';
        if (vecA.x < vecB.x) return 'left';
        if (vecA.y < vecB.y) return 'up';
        if (vecA.y > vecB.y) return 'down';
        console.error('uhh the 2 vectors seem to have the same position?')
        return;
    }

    give_item_to(item, entity) {
        if (item.isHeldBy !== null) {       // if somebody is holding item
            const oldEntity = item.isHeldBy;
            // console.log(`removing item '${item.name}' from old owner '${oldEntity.name}'`)
            const oldIndex = oldEntity.bag.findSlotByItem(item);
            console.log(`remove ${item.name} from ${oldEntity.name} slot ${oldIndex}`)
            if (oldIndex > -1) {
                oldEntity.bag.removeItem(oldIndex);

            }
            console.log(`${item.name} is now held by ${(item.isHeldBy !== null) ? item.isHeldBy.name : "nobody"}`)


        } else if (item.position !== null) { // if the item has a world position
            const posX = item.position.x;
            const posY = item.position.y;
            const gridX = posX / FLOOR_CELL_PIXELS;
            const gridY = posY / FLOOR_CELL_PIXELS;
            if (this.grid[gridX] && this.grid[gridX][gridY]) {
                console.log(`should probably remove item from map at '${gridX},${gridY}'`)
                const replaceCtx = this.textures.mapOccupants[0].getContext('2d');
                console.log(replaceCtx)
                replaceCtx.clearRect(posX, posY, FLOOR_CELL_PIXELS, FLOOR_CELL_PIXELS);
                item.position = null;
                this.grid[gridX][gridY].occupant = null;
            } else {
                console.warn(`oh no, item doesn't exist at '${x},${y}'`)
            }
        }
        // console.log(`giving item '${item.name}' to '${entity.name}'`)

        entity.receiveItem(item);
        console.log(`${item.name} is now held by ${(item.isHeldBy !== null) ? item.isHeldBy.name : "nobody"}`)


        this.renderer.modifyInventoryTexture(); // 

        return true;
    }

    log_entity_position(e) {
        if (e === undefined) e = player;
        console.log(
            e.name,
            Math.round(e.position.x / FLOOR_CELL_PIXELS),
            Math.round(e.position.y / FLOOR_CELL_PIXELS),
        );
    }

    log_relevant_inventory() {
        let t;
        if (player.interactTarget !== null) {
            console.log(`INVENTORY THING: interact target is uh ${player.interactTarget.name}`)
            t = player.interactTarget;
        } else {
            t = player;
        }
        return t.bag.getContentsAsString();
    }

    toggleShowPlayerInventory() {

        this.renderer.shouldDrawPlayerInventory = !this.renderer.shouldDrawPlayerInventory;

    }

    toggleShowSampleText(state) {
        this.renderer.shouldDrawSampleText = state;
    }


}
