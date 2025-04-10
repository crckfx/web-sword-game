import { GameControls } from "./controls/GameControls.js";
import { Renderer } from "./Renderer.js";
import { Item } from "./objects/Item.js";
import { getHtmlControls, CAMERA_CELLS, CELL_PX, } from "../document.js";
import { GameLoop } from "./GameLoop.js";
import { cellCoords, gridCells, moveTowards } from "../helper/grid.js";
import { Vector2 } from "./Vector2.js";
import { Entity } from "./objects/Entity.js";
import { player } from "../loader/world-loader.js";
import { direction_to_2D } from "../helper/directions.js";

import { SetOfDialogues } from "./dialogue/SetOfDialogues.js";
import { add_two_vectors } from "../helper/vectorHelper.js";
import { get_dialogue_inventory, worldInteract_Entity, worldInteract_Item } from "../helper/gameHelpers.js";
import { Trigger } from "./objects/Trigger.js";
import { GameObject } from "./objects/GameObject.js";
import { Doodad } from "./objects/Doodad.js";
import { get_standard_water_animation } from "../helper/walk.js";
import { command_back, command_dpad, command_interact, command_togglePause, enterPlayerInventory } from "../helper/commandHelper.js";

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

    levels = [];
    currentLevel = null;

    controlsBlocked = false;
    currentCutScene = null;

    gamepad = null;

    pauseMenu = {
        index: 0,
        options: [
            "resume",
            "undefined 1",
            "undefined 2",
            "undefined 3",
        ]
    };



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

            bang_dpad: command_dpad,
            bang_A: command_interact,
            bang_B: command_back,
            bang_Y: () => {

                console.log(cellCoords(this.renderer.camera.pos.x), cellCoords(this.renderer.camera.pos.y), cellCoords(player.position.x), cellCoords(player.position.y))
            },
            bang_X: enterPlayerInventory,
            bang_pause: command_togglePause,
            bang_resume: command_togglePause,
        });
        // 
        this.waterAnimations = get_standard_water_animation();
        this.waterAnimations.play('primary')
    }

    // MAIN UPDATE
    // -------------------------------------------------------------------
    update(delta) {
        // handle gamepad if exist
        // importantly, gamepad is checked before pause exit. otherwise, you couldn't unpause the game by using the gamepad.
        if (this.controls.gamepadHandler.gamepad) this.controls.gamepadHandler.pollGamepad();
        // however, if the game IS paused, we ONLY need updates for controller. so exit here if paused.
        if (this.isPaused) return;

        // do player world movement
        const distance = moveTowards(player, player.destination, player.speed);
        const hasArrived = distance < 1;

        if (hasArrived) {
            this.tryMove();
            const playerCell = new Vector2(cellCoords(player.position.x), cellCoords(player.position.y));
            // null the interactTarget before checking the cell
            player.interactTarget = null;
            // "can the player interact with the cell they are facing?"
            const interactOffset = direction_to_2D(player.isFacing);
            const interactCell = add_two_vectors(playerCell, interactOffset);

            if (this.grid[interactCell.y] && this.grid[interactCell.y][interactCell.x]) {
                const occupant = this.grid[interactCell.y][interactCell.x].occupant;
                if (occupant instanceof GameObject) {
                    player.interactTarget = occupant;
                }
            };

        }

        this.waterAnimations.step(delta);
        player.step(delta);

        // if there's a cutScene, advance it
        if (this.currentCutScene) {
            this.currentCutScene.step();
        }

        // if there's a dpad dir, increment its time
        if (this.controls.current_dpad_dir) this.dpadTime += delta;

    }

    // -------------------------------------------------------------------

    // pause and resume game functions
    pause() {
        this.isPaused = true;
        console.log("pause game");       
        this.renderer.drawPauseBackground();
        this.renderer.drawPauseMenu();
        this.controlsBlocked = true;
    }

    resume() {
        console.log("resume game");
        if (!this.currentCutScene) { this.controlsBlocked = false; }
        this.isPaused = false;
    }

    // commands
    // -------------------------------------------------------------------

    // launch a SINGLE dialogue (hopefully make me obsolete)
    launch_single_dialogue(dialogue, object) {
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
            // console.log('launching dialogue set !~!!!!!');
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
        this.currentDialogue = null;
    }

    // ---------


    // ---------    

    // function to execute player movement
    tryMove() {
        // note: "isPaused" is escaped before we can reach here
        // escape if: 
        //      1. no dpad dir (could be problematic during move cutScenes maybe?)
        //      2. in dialogue - player can't move during a dialogue
        //      3. in inventory - same as dialogue
        if (!this.controls.current_dpad_dir || this.isInDialogue || this.isInInventory) {
            player.animations.play(`stand${player.isFacing}`);
            return;
        }

        if (this.controlsBlocked) {
            return;
        }

        let nextX = player.destination.x;
        let nextY = player.destination.y;

        player.isFacing = this.controls.current_dpad_dir;

        if (this.dpadTime < 150) {
            player.animations.play(`stand${player.isFacing}`);
        } else {
            switch (player.isFacing) {
                case 'Left':
                    nextX -= CELL_PX;
                    player.animations.play('walkLeft');
                    break;
                case 'Right':
                    player.animations.play('walkRight');
                    nextX += CELL_PX;
                    break;
                case 'Up':
                    player.animations.play('walkUp');
                    nextY -= CELL_PX;
                    break;
                case 'Down':
                    player.animations.play('walkDown');
                    nextY += CELL_PX;
                    break;
            }

            const x = cellCoords(nextX);
            const y = cellCoords(nextY);

            if (this.grid[y] && this.grid[y][x]) {
                const occupant = this.grid[y][x].occupant;
                // only move if no occupant here
                if (occupant === null) {
                    player.destination.x = nextX;
                    player.destination.y = nextY;
                } else if (occupant instanceof Trigger) {
                    // the occupant is a trigger
                    if (occupant.walkable) {
                        // the trigger is walkable
                        occupant.tryProceed(); // try run the trigger
                    }
                }
            }
        }

    }


    // **********************************************************************************
    // ----- INTERACT BUTTON (pressing 'A') -----
    // ---------------------------------------------------------------------------------

    // press 'A' on a PROMPT OPTION
    handleDialogueInteract() {
        if (this.currentDialogueSet) {
            // interacted with a dialogue from a dialogueset
            if (this.currentDialogue.options) {
                // interaction was to a choice, so run the option
                this.currentDialogue.options[this.promptIndex].action();
                return;
            } else {
                // this interact wasn't to a choice, so progress it
                let exit = false;
                // store the 
                const onFinish = this.currentDialogue.onFinish;
                this.currentDialogue = this.currentDialogueSet.progress();
                // exit if we got null after progressing
                if (this.currentDialogue === null) {
                    // const DS = this.currentDialogueSet;
                    this.exitDialogue();
                    // return;
                    exit = true;
                }
                if (onFinish) {
                    console.log('previous dialogue had an onFinish!');
                    onFinish();
                }

                if (exit) return;
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
        this.launch_single_dialogue(get_dialogue_inventory(this, item));
    }

    // press 'A' on 'WORLD' 
    handleWorldInteract() {
        if (this.controlsBlocked) return;

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
                t.tryProceed();
            } else if (t instanceof Doodad) {
                console.log(`interacted with doodad ${t.name}`)
                if (t.trigger) {
                    t.trigger.tryProceed();
                }
            } else {
                console.log("not sure what you're interacting with", t);
            }
        }
    }
    // ---------------------------------------------------------------------------------


    // **********************************************************************************
    // ----- LEVELS -----
    // ---------------------------------------------------------------------------------

    // function to halt the game loop and unload level and load new level 
    load_new_level(level, options) {
        this.exitDialogue();                // exit any existing dialogues
        this.gameLoop.stop();
        this.pauseTimestamp = performance.now();
        // if (this.currentLevel) this.cacheLevel();                  // write relevant existing level data into game
        this.bindLevel(level, options);     // load a new level
        const pauseDuration = performance.now() - this.pauseTimestamp;
        this.gameLoop.lastFrameTime += pauseDuration;
        this.pauseTimestamp = null;
        this.gameLoop.start();            // ! start the gameLoop again
    }

    // function to 
    bindLevel(level, customOptions) {
        this.currentLevel = level;
        this.grid = level.grid;
        this.renderer.bind(level.drawKit, level.grid);

        this.renderer.camera.pos.overwrite(0, 0);

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
                e.isFacing = entityData.isFacing;
            }
        }

        // after the basic load stuff, implement custom options like: 
        // - 'just got off boat'
        // - 'thing on map is moved'
        if (customOptions) {
            if (customOptions.cutScene) {
                console.log('should override with this scene')
                this.controlsBlocked = true;
                this.currentCutScene = customOptions.cutScene.launch();
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
    // ---------------------------------------------------------------------------------

}
