import { GameControls } from "./controls/GameControls.js";
import { Renderer } from "./Renderer.js";
import { Item } from "./objects/Item.js";
import { getHtmlControls, CAMERA_CELLS, CELL_PX, pauseMenu, NUM_GRID } from "../document.js";
import { GameLoop } from "./GameLoop.js";
import { cellCoords, gridCells, moveTowards } from "../helper/grid.js";
import { Vector2 } from "./Vector2.js";
import { Entity } from "./objects/Entity.js";
import { player } from "../helper/world-loader.js";
import { tryPromptMove } from "../helper/promptMenu.js";
import { tryInventoryMove } from "../helper/invMenu.js";
import { direction_to_2D } from "../helper/directions.js";
import { Dialogue } from "./interactions/Dialogue.js";
import { DialogueOption } from "./interactions/DialogueOption.js";
import { SetOfDialogues } from "./interactions/SetOfDialogues.js";
import { add_two_vectors } from "../helper/vectorHelper.js";
import { get_dialogue_inventory, worldInteract_Entity, worldInteract_Item } from "../helper/gameHelpers.js";
import { GameLevel } from "../levels/GameLevel.js";
import { MapLayer } from "../levels/MapLayer.js";
import { Trigger } from "./objects/Trigger.js";
import { GameObject } from "./GameObject.js";

export class Game {
    grid = null;
    textures = {};
    images = {};
    entities = {};
    controls = null;
    // state stuff
    isPaused = false;
    pauseTimestamp = null;
    isInDialogue = false;
    isInInventory = false;

    // dialogue-specific stuff
    currentDialogue = null
    currentDialogueSet = null
    promptIndex = null;

    levels = null;
    currentLevel = null;


    constructor() {
        // create the game grid for a level instead though

        // create the renderer
        this.renderer = new Renderer({
            canvas: document.getElementById('game_canv'),
            ctx: document.getElementById('game_canv').getContext("2d"),
            cameraCellsX: CAMERA_CELLS.x,
            cameraCellsY: CAMERA_CELLS.y,
            game: this,
        });
        // create the loop
        this.gameLoop = new GameLoop(this.update.bind(this), this.renderer.draw.bind(this.renderer));
        // create the controls
        this.controls = new GameControls({
            HtmlControls: getHtmlControls(), // the onscreen controls (dpad, buttons)
            game: this, // reference to the game
            // bind controls to game functions
            bang_dpad: this.command_dpad.bind(this),
            bang_A: this.command_interact.bind(this),
            bang_B: this.command_back.bind(this),
            bang_Y: () => {
                const c = new Vector2(cellCoords(player.position.x), cellCoords(player.position.y));
                if (this.controls.current_dpad_dir !== null) {
                    console.log(`dpad on bang is ${this.controls.current_dpad_dir}`);
                    const dirVec = direction_to_2D(this.controls.current_dpad_dir);
                    c.x += dirVec.x;
                    c.y += dirVec.y
                }
            },
            bang_X: this.enterPlayerInventory.bind(this),
            bang_pause: this.command_togglePause.bind(this),
            bang_resume: this.command_togglePause.bind(this),
        });
        // 
    }

    bindLevel(level) {
        this.currentLevel = level;
        this.grid = level.grid;
        this.renderer.bind(level.drawKit, level.grid);

        for (const key in level.entityData) {
            if (key === 'player') {
                const playerData = level.entityData[key];
                const posX = gridCells(playerData.cellCoord.x);
                const posY = gridCells(playerData.cellCoord.y);
                player.isFacing = playerData.isFacing;
                player.position.x = posX;
                player.position.y = posY;
                player.destination.x = posX;
                player.destination.y = posY;
            } else {
                const e = this.entities[key];
                const entityData = level.entityData[key];
                const entityDataPos = entityData.cellCoord;
                e.position.x = gridCells(entityDataPos.x);
                e.position.y = gridCells(entityDataPos.y);
            }
        }

    }

    cacheLevel() {
        const level = this.currentLevel;

        for (const key in level.entityData) {
            if (key === 'player') {
                const playerData = level.entityData[key];
                playerData.isFacing = player.isFacing;
                playerData.cellCoord.overwrite(cellCoords(player.position.x), cellCoords(player.position.y));
            } else {
                const e = this.entities[key];
                const entityData = level.entityData[key];
                if (entityData) {
                    // entityData.isFacing = e.isFacing;
                    entityData.cellCoord.overwrite(cellCoords(e.position.x), cellCoords(e.position.y));
                }
            }
        }

        this.currentLevel = null;
        this.grid = null;
    }

    // MAIN UPDATE
    // -------------------------------------------------------------------
    update(delta) {
        const distance = moveTowards(player, player.destination, player.speed);
        const hasArrived = distance < 1;

        if (hasArrived) {

            this.tryMove();

            const playerCell = new Vector2(cellCoords(player.position.x), cellCoords(player.position.y));


            player.interactTarget = null;
            // "can the player interact with the cell they are facing?"
            // (but only if we don't have one set already)
            if (player.interactTarget === null) {
                const interactOffset = direction_to_2D(player.isFacing);
                const interactCell = add_two_vectors(playerCell, interactOffset);

                if (this.grid[interactCell.y] && this.grid[interactCell.y][interactCell.x]) {
                    const occupant = this.grid[interactCell.y][interactCell.x].occupant;
                    // if (typeof(cell.occupant) === "object") {
                    if (occupant instanceof GameObject) {
                        player.interactTarget = occupant;
                    }
                };
            }

        }
        player.step(delta);
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
            if (this.currentDialogue !== null)
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
                if (this.currentDialogue.options !== null) {
                    this.promptIndex = tryPromptMove(
                        this.controls.current_dpad_dir,
                        this.currentDialogue.options.length,
                        this.promptIndex
                    );
                }
                return;
            } else {
                tryInventoryMove(this.controls.current_dpad_dir);
                return;
            }
        } else if (this.isInDialogue) {
            if (this.currentDialogue.options !== null) {
                this.promptIndex = tryPromptMove(
                    this.controls.current_dpad_dir,
                    this.currentDialogue.options.length,
                    this.promptIndex
                );
            }
            return;
        }
    }

    // function to handle press on the BACK (B) button
    command_back() {
        if (this.isPaused) {
            this.resume();
        } else if (this.isInDialogue) {
            if (this.isInInventory) {
                // handle dialogue inside of inventory
                this.exitDialogue();
            } else if (this.currentDialogueSet) {
                // handle dialogueSet outside of inventory
                if (this.currentDialogueSet.canExit)
                    this.exitDialogue();
            } else {
                // handle a loaded dialogue with no set?
                // todo: implement dialogue-specific canExit?
                this.exitDialogue();
            }
        } else if (this.isInInventory) {
            this.exitPlayerInventory();
        }
    }

    command_togglePause() {
        this.isPaused ? this.resume() : this.pause();
    }


    // launch a SINGLE dialogue (hopefully make me obsolete)
    launch_a_dialogue(dialogue, object) {
        if (dialogue.options) {
            this.promptIndex = 0;
        }
        this.currentDialogue = dialogue;
        this.isInDialogue = true;
        this.renderer.modifyDialogueWithDialogueClass(dialogue, object ?? null, this.textures.sampleText);
        this.renderer.shouldDrawDialogueBox = true;
    }


    // launch a SET of dialogues
    launch_set_of_dialogues(DS) {
        if (DS instanceof SetOfDialogues) {
            console.log('launching dialogue set !~!!!!!');
            this.currentDialogueSet = DS;
            DS.launch();


            const d = this.currentDialogueSet.getDialogue();

            if (d.options) {
                this.promptIndex = 0;
            }
            this.currentDialogue = d;
            this.isInDialogue = true;
            this.renderer.modifyDialogueWithDialogueClass(d, null, this.textures.sampleText);
            this.renderer.shouldDrawDialogueBox = true;
        } else {
            console.error("DS is not a DialogueSet?");
        }
    }

    exitDialogue() {
        this.isInDialogue = false;
        this.promptIndex = null;
        this.renderer.shouldDrawDialogueBox = false;
        this.currentDialogueSet = null;
    }

    // ---------

    enterPlayerInventory() {
        if (!this.isPaused && !this.isInDialogue) {
            this.renderer.shouldDrawPlayerInventory = true;
            this.isInInventory = true;
        }
    }
    exitPlayerInventory() {
        this.renderer.shouldDrawPlayerInventory = false;
        this.isInInventory = false;
        player.bagCursorIndex = 0;
    }

    // ---------    

    // function to execute player movement
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
                nextX -= CELL_PX;
                player.animations.play('walkLeft');
                break;
            case 'right':
                player.animations.play('walkRight');
                nextX += CELL_PX;
                break;
            case 'up':
                player.animations.play('walkUp');
                nextY -= CELL_PX;
                break;
            case 'down':
                player.animations.play('walkDown');
                nextY += CELL_PX;
                break;
        }

        const x = nextX / CELL_PX;
        const y = nextY / CELL_PX;

        if (this.grid[y] && this.grid[y][x]) {
            // only move if no occupant here
            if (this.grid[y][x].occupant === null) {
                player.destination.x = nextX;
                player.destination.y = nextY;
            }
        }

    }



    // press 'A' on a PROMPT OPTION
    handleDialogueInteract() {
        if (this.currentDialogueSet !== null) {
            // interacted with a dialogue from a dialogueset
            if (this.currentDialogue.options === null) {
                // this interact wasn't to a choice, so progress it
                this.currentDialogue = this.currentDialogueSet.progress();
                // exit if we got null after progressing
                if (this.currentDialogue === null) {
                    this.exitDialogue();
                    return;
                }
            } else {
                // interaction was to a choice, so run the option
                this.currentDialogue.options[this.promptIndex].action();
                return;
            }
            // if we reach here, we have progressed to a new member of this set
            // 1. reset the promptIndex if the new Dialogue has options
            if (this.currentDialogue.options) this.promptIndex = 0;
            // 2. and need to order a redraw
            this.renderer.modifyDialogueWithDialogueClass(this.currentDialogue, null, this.textures.sampleText);
        }
        // if there's no current SetOfDialogues, we assume a detached single Dialogue,
        // we can handle this by either 1. exiting, or 2. running a chosen option
        else if (this.currentDialogue.options === null)
            this.exitDialogue();
        else if (this.currentDialogue.options[this.promptIndex]) {
            this.currentDialogue.options[this.promptIndex].action();
        }
    }

    // press 'A' on 'PLAYER INVENTORY'
    handleInventoryInteract() {
        if (player.bag.slots[player.bagCursorIndex] === null) return;
        const index = player.bagCursorIndex;
        const item = player.bag.slots[index];
        this.launch_a_dialogue(get_dialogue_inventory(this, item));
    }

    // press 'A' on 'WORLD' 
    handleWorldInteract() {
        const t = player.interactTarget;
        if (t !== null) {
            if (t instanceof Entity) {
                console.log(`Interacted with entity ${t.name}`);
                worldInteract_Entity(this, t);
            } else if (t instanceof Item) {
                // interact with an item in the world (NOT inventory)
                console.log(`Interacted with item ${t.name}`);
                worldInteract_Item(this, t);
            } else if (t instanceof Trigger) {
                // implement me
                console.log("trigger trigger trigger trigger !!!!!!!!")
                console.log(t.message);
                if (t.action) {
                    t.action();
                }
            } else {
                console.log("not sure what you're interacting with", t);
            }
        }
    }

}
