import { GameControls } from "../controls/GameControls.js";
import { Renderer } from "./Renderer.js";
import { Item } from "./Item.js";
import { getHtmlControls, CAMERA_CELLS, FLOOR_CELL_PIXELS, pauseMenu, gameSpeech, NUM_GRID } from "../document.js";
import { GameLoop } from "./GameLoop.js";
import { cellCoords, compare_two_vec2, createGrid, facingToVector, moveTowards } from "../helper/grid.js";
import { Vector2 } from "./Vector2.js";
import { Entity } from "./Entity.js";
import { player } from "../helper/world-loader.js";
import { wrapText } from "../experimental/dialogues.js";
import { give_item_to } from "../helper/interactions.js";

export class Game {
    // renderer = null;
    // gameLoop = null;
    grid = null;
    textures = {};
    images = {};
    entities = {};
    controls = null;
    // pause stuff
    isPaused = false;
    pauseTimestamp = null;
    isInDialogue = false;
    isInInventory = false;

    currentPromptOptions = null;
    promptIndex = null;


    constructor() {
        // create the game grid
        this.grid = createGrid(NUM_GRID.x, NUM_GRID.y);
        // create the renderer
        this.renderer = new Renderer({
            canvas: document.getElementById('game_canv'),
            ctx: document.getElementById('game_canv').getContext("2d"),
            cameraCellsX: CAMERA_CELLS.x,
            cameraCellsY: CAMERA_CELLS.y,
            game: this,
        });
        // create the loop
        this.gameLoop = new GameLoop(this.update.bind(this), this.render.bind(this));
        // create the controls
        this.controls = new GameControls({
            HtmlControls: getHtmlControls(), // the onscreen controls (dpad, buttons)
            game: this, // reference to the game
            // bind controls to game functions
            bang_dpad: this.command_dpad.bind(this),
            bang_A: this.command_interact.bind(this),
            bang_B: this.command_back.bind(this),
            bang_Y: this.toggleShowSampleText.bind(this),
            bang_X: this.toggleShowPlayerInventory.bind(this),

            bang_pause: this.command_togglePause.bind(this),
            bang_resume: this.command_togglePause.bind(this),
        });
        // 
        this.defaultPromptOptions = [
            {
                text: "Back",
                action: this.exitDialogue.bind(this),
            },
            {
                text: "Exit",
                action: () => {
                    this.exitDialogue();
                    this.exitInventory();
                },
            }
        ];
    }

    // MAIN UPDATE & RENDER
    // -------------------------------------------------------------------
    update(delta) {
        const distance = moveTowards(player, player.destination, player.speed);
        const hasArrived = distance < 1;

        if (hasArrived) {

            this.tryMove();

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
        }
        player.step(delta);
    }

    render() {
        this.renderer.draw();
    }
    // -------------------------------------------------------------------

    // pause and resume game functions
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

    // commands
    // -------------------------------------------------------------------
    // aka "player presses 'A' with a valid target"
    command_interact() {
        if (this.isPaused) {
            return;
        } else if (this.isInDialogue) {
            if (this.promptIndex !== null)
                this.handleDialogueInteract();
        } else if (this.isInInventory) {
            this.handleInventoryInteract();
            return;
        } else {
            this.handleWorldInteract();
            return;
        }
    }


    // function to try a mov whenever dpad gets pressed (in case dpad);
    command_dpad() {
        // check and trigger inventory move if game is in inventory?
        if (this.isInInventory) {
            // console.log('yes ! in inventory and pressing a dpad on');
            if (this.isInDialogue) {
                // console.log("implement prompt in inventory")
                this.tryPromptMove();
            } else {
                this.tryInventoryMove();
                return;
            }
        }
    }

    // function to handle press on the BACK button
    command_back() {
        // console.log('oh wowza did ya press "B"?');
        if (this.isPaused) {
            this.resume();
        } else if (this.isInDialogue) {
            if (this.promptIndex === null)
                this.exitDialogue();
        } else if (this.isInInventory) {
            this.exitInventory();
        }
    }

    command_togglePause() { 
        this.isPaused ? this.resume() : this.pause(); 
    }

    // ---------
    prompt(name, message, options, startPosition = 0) {
        this.currentPromptOptions = options;
        this.promptIndex = startPosition;
        // piggybacking dialogue for now
        this.isInDialogue = true;
        // this.renderer.modifySampleText("system", message);
        this.renderer.modifyDialogueWithOptions(name, message, this.currentPromptOptions);
        this.toggleShowSampleText(true);
    }

    worldInteract_Item(t) {
        const grid = this.grid;
        const x = t.position.x / FLOOR_CELL_PIXELS;
        const y = t.position.y / FLOOR_CELL_PIXELS;
        if (grid[x] && grid[x][y]) {
            console.log(`take item from ${x}, ${y}`);
            if (give_item_to(grid, t, player, this.textures.mapOccupants[0])) {
                this.renderer.modifyInventoryTexture();
                player.interactTarget = null;
                this.isInDialogue = true;
                this.doSimplePrompt(t.name, `Picked up ${t.name}.`);
                //
            };
        }
    }

    worldInteract_Entity(t) {
        // ** handle conditions ** (a basic prototype)
        // check 1. a condition exists and 2. it is not already satisfied
        if (t.interactCondition !== null && t.isSatisfied === false) {
            // check the (currently unsatisfied) condition
            const conditionIsMet = t.interactCondition() > -1; // assume an interact condition uses a number??? todo: smooth out
            // console.log(`interact condition: ${conditionIsMet}`)
            if (conditionIsMet) {
                t.interactAction();
                t.isSatisfied = true;
            }
        } // ** END handle conditions **
        // put the game in dialogue mode
        this.isInDialogue = true;
        // set the target to face toward the player
        player.interactTarget.isFacing = compare_two_vec2(player.position, t.position);
        // update the text in the dialogue layer
        this.renderer.modifySampleText(t.name, t.getDialogue());
        // display the dialogue box
        this.toggleShowSampleText(true);
    }

    exitDialogue() {
        this.isInDialogue = false;
        this.promptIndex = null;
        this.currentPromptOptions = null;
        this.toggleShowSampleText(false);
    }
    // ---------


    tryMove() {
        if (!this.controls.current_dpad_dir || this.isInDialogue || this.isInInventory) {
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

        if (this.grid[x] && this.grid[x][y]) {
            if (this.grid[x][y].occupant === null) {
                player.destination.x = nextX;
                player.destination.y = nextY;
            }
        }
    }





    log_entity_position(e) {
        if (e === undefined) e = player;
        console.log(
            e.name,
            cellCoords(e.position.x),
            cellCoords(e.position.y),
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
        if (!this.isPaused && !this.isInDialogue) {
            this.renderer.shouldDrawPlayerInventory = true;
            this.isInInventory = true;
        }
    }

    exitInventory() {
        this.renderer.shouldDrawPlayerInventory = false;
        this.isInInventory = false;
        player.bagCursorIndex = 0;
    }

    toggleShowSampleText(state) {
        this.renderer.shouldDrawSampleText = state;
    }

    toggleShowOptionPrompt(state) {
        if (state === true) {
            this.renderer.shouldDrawOptionPrompt = true;
        } else {
            this.renderer.shouldDrawOptionPrompt = false;
        }
    }


    // translate move messages into inventory messages
    tryInventoryMove() {
        let target = 0;
        switch (this.controls.current_dpad_dir) {
            case 'left':
                if (player.bagCursorIndex !== 6)
                    target = -1;
                break;
            case 'right':
                if (player.bagCursorIndex !== 5)
                    target = 1;
                break;
            case 'up':
                target = -6
                break;
            case 'down':
                target = 6;
                break;
            default:
                return;
        }
        if (this.checkInventoryMoveBounds(target)) player.bagCursorIndex += target;
    }

    checkInventoryMoveBounds(target) {
        const result = player.bagCursorIndex + target;
        if (result < 0) return false;
        if (result > player.bag.slots.length - 1) return false;
        return true;
    }

    tryPromptMove() {
        let target = 0;
        const length = this.currentPromptOptions.length;
        if (this.promptIndex !== null) target = this.promptIndex;
        switch (this.controls.current_dpad_dir) {
            case 'up': case 'left':
                target -= 1;
                break;
            case 'down': case 'right':
                target += 1;
                break;
            default:
                return;
        }

        if (target > -1 && target < length) {
            this.promptIndex = target;
            console.log(`promptIndex is now ${this.promptIndex}`);
        }

    }



    // press 'A' on a PROMPT OPTION
    handleDialogueInteract() {
        // implement me once we add interacts to dialogue
        console.log(`interact with option ${this.promptIndex}`);
        this.currentPromptOptions[this.promptIndex].action();
    }

    // press 'A' on 'PLAYER INVENTORY'
    handleInventoryInteract() {
        if (player.bag.slots[player.bagCursorIndex] === null) return;
        const index = player.bagCursorIndex;
        const item = player.bag.slots[index];
        // console.log(player.bag.slots[player.bagCursorIndex], player.bagCursorIndex + 1);

        let message = `big woop, you interacted with ${item.name}.`;
        if (item.description !== null) message = item.description;
        // this.currentPromptOptions = this.defaultPromptOptions;
        this.prompt(item.name, message, item.promptOptions || this.defaultPromptOptions, 0);
    }

    // press 'A' on 'WORLD' 
    handleWorldInteract() {
        const t = player.interactTarget;
        if (t !== null) {
            if (t instanceof Entity) {
                console.log(`Interacted with entity ${t.name}`);
                this.worldInteract_Entity(t);
            } else if (t instanceof Item) {
                // interact with an item in the world (NOT inventory)
                console.log(`Interacted with item ${t.name}`);
                this.worldInteract_Item(t);

            } else {
                console.log("not sure what you're interacting with", t);
            }
        }
    }


    doSimplePrompt(name, message) {
        this.renderer.modifySampleText(name, message);
        this.toggleShowSampleText(true);
    }
}
