import { CELL_PX, CAMERA_CELLS } from "../document.js";
import { wrapText } from "../menus/promptMenu.js";
import { cellCoords, gridCells } from "../helper/grid.js";
import { player } from "../loader/world-loader.js";
import { Vector2 } from "./Vector2.js";
import { Camera } from "./Camera.js";
import { Entity } from "./objects/Entity.js";
import { Doodad } from "./objects/Doodad.js";
import { direction_to_2D } from "../helper/directions.js";

export class Renderer {
    shouldDrawPlayerInventory = false;
    shouldDrawDialogueBox = false;

    player_offset = 5;
    invCellSize = 40;
    optionsCoords = null;

    camera = new Camera();

    gameLevel = null;

    // RENDERER CONSTRUCTOR
    constructor({
        canvas,
        ctx,
        cameraCellsX,
        cameraCellsY,
        game,   // it is assumed that the game will have textures, images, and grid already
    }) {
        this.game = game;
        this.ctx = ctx;
        this.canvas = canvas;

        this.cells = new Vector2(cameraCellsX, cameraCellsY) ?? new Vector2(4, 3);
        this.textures = game.textures ?? null;
        this.images = game.images ?? null;

        this.ctx.imageSmoothingEnabled = false;

        this.drawKit = null;
        this.grid = null;
        this.camera.size.overwrite(canvas.width, canvas.height);
    }

    bind(drawKit, grid) {
        this.grid = grid;
        this.drawKit = drawKit;
    }

    // A.K.A. "render_entire_grid"
    draw() {

        // do nothing and return if paused
        if (this.game.isPaused) { return; }

        // centre the camera if a cutScene isn't running
        if (!this.game.currentCutScene) { this.camera.centreOn(player.position.x, player.position.y); }
        
        // per-frame caching
        const camX = this.camera.pos.x;
        const camY = this.camera.pos.y;
        const sizeX = this.camera.size.x;
        const sizeY = this.camera.size.y;

        // clear it up
        this.ctx.clearRect(0, 0, sizeX, sizeY);

        // draw it up
        // draw the **floor+doodad** base texture
        this.ctx.drawImage(
            this.drawKit.wadders[this.game.waterAnimations.frame].canvas,
            camX, camY, sizeX, sizeY,    // draw a section of the floor
            0, 0, sizeX, sizeY                 // at this specified pos + size
        );

        // loop over camera cells to decide what things to draw
        for (let j = -1; j <= CAMERA_CELLS.y; j++) {
            for (let i = -1; i <= CAMERA_CELLS.x; i++) {
                const x = cellCoords(camX) + i;
                const y = cellCoords(camY) + j;
                if (this.grid[y] && this.grid[y][x]) {
                    const cell = this.grid[y][x];
                    if (cell.occupant instanceof Entity) {
                        this.drawEntity(cell.occupant, camX, camY)
                    } else if (cell.occupant instanceof Doodad) {
                        this.drawDoodad(cell.occupant, camX, camY)
                    }
                }
            }
        }

        // draw the player shadow
        const facing = direction_to_2D(player.isFacing);
        this.ctx.drawImage(
            this.game.images.entityShadow,              // shadow texture
            player.position.x + 7 + facing.x - camX,    // position X
            player.position.y + 14 - camY,              // position Y
        );
        // draw the **player** texture
        this.ctx.drawImage(
            player.texture[player.frame],
            player.position.x - camX, player.position.y - 12 - camY,
            CELL_PX, CELL_PX
        );

        // draw the overlay component
        this.ctx.drawImage(
            this.drawKit.overlays.canvas,
            camX, camY, sizeX, sizeY,
            0, 0, sizeX, sizeY
        );
        if (this.shouldDrawPlayerInventory) this.drawInventory();
        if (this.shouldDrawDialogueBox) this.drawDialogueBox();
    }


    // draw an entity specifically
    drawEntity(entity, camX, camY) {
        const posX =  entity.position.x;
        const posY =  entity.position.y;
        const facing = direction_to_2D(entity.isFacing);

        // draw entity shadow
        this.ctx.drawImage(
            this.game.images.entityShadow,
            posX + 7 + facing.x - camX, 
            posY + 14 - camY,
        );
        // draw entity body
        this.ctx.drawImage(
            entity.getEntitySprite(),
            // entity.texture[entity.frame],
            posX - camX,
            posY - 12 - camY,
            CELL_PX, CELL_PX // source texture is 0.5 size, so you have to scale it
        );

        // if (entity.hasAlert) {
        //     this.drawCellBorder(
        //         posX - camX,
        //         posY - camY,
        //         "red"
        //     );
        // }
    }

    drawDoodad(d, camX, camY) {
        this.ctx.drawImage(
            d.texture,
            0, 0, 64, 64,
            // entity.texture[entity.frame],
            d.position.x - 16 - camX,
            d.position.y - 20 - camY,
            CELL_PX * 2,
            CELL_PX * 2
        );
    }

    // helper to draw a border on the main canvas
    drawCellBorder(x, y, colour = 'green') {
        this.ctx.strokeStyle = colour;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, CELL_PX);
    }


    drawPauseBackground() {
        // fill a translucent background
        this.ctx.fillStyle = '#000000aa';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);        
    }

    // draw the pause menu 
    drawPauseMenu() {
        const pdk = this.game.pauseMenu.drawKit;
        this.redrawPauseSelector();        
        this.ctx.drawImage(pdk.baseCanv.canvas, gridCells(0.5), gridCells(2));
        this.ctx.drawImage(pdk.selector.canvas, gridCells(0.5), gridCells(2));
    }

    redrawPauseSelector() {
        // const pdk = this.game.textures.pauseMenu; // 'pause draw kit'
        const pdk = this.game.pauseMenu.drawKit; // 'pause draw kit'

        const selectorCanvas = pdk.selector.canvas;
        const selectorCtx = pdk.selector.ctx;

        selectorCtx.clearRect(0, 0, selectorCanvas.width, selectorCanvas.height);
        selectorCtx.strokeStyle = '#FF0000FF';

        const offset_y = this.game.pauseMenu.index * 36 + 12;

        selectorCtx.strokeRect(pdk.optionStartX, offset_y, pdk.optionWidth, pdk.optionHeight);
    }

    drawInventory() {
        // draw the inventory background
        const posX = CELL_PX * 1.75;
        const posY = CELL_PX * 0.75;
        this.ctx.drawImage(this.textures.inventoryBg.canvas, posX, posY);
        // draw the items layer
        this.ctx.drawImage(this.textures.inventoryItems.canvas, posX, posY);
        // draw the select layer
        this.ctx.strokeStyle = "red";
        this.ctx.lineWidth = 2;

        let y = player.bagCursorIndex < 6 ? 0 : 1; // calculate the y for the display
        this.ctx.strokeRect(
            posX + (player.bagCursorIndex % 6) * this.invCellSize,
            posY + y * this.invCellSize,
            this.invCellSize, this.invCellSize
        );

        this.ctx.drawImage(this.images.sword, 0, 0, CELL_PX, CELL_PX);
    }



    drawDialogueBox() {
        this.ctx.drawImage(
            this.textures.sampleText.canvas,
            CELL_PX * 0.5,
            CELL_PX * 5.5,
        )
        if (this.game.promptIndex !== null) {
            this.ctx.strokeStyle = "red";
            this.ctx.lineWidth = 2;
            const optionCoords = this.optionsCoords[this.game.promptIndex];

            this.ctx.strokeRect(
                optionCoords.x, optionCoords.y,
                optionCoords.width, optionCoords.height
            );
        }
    }

    modifyDialogueWithDialogueClass(dialogue, object, texture) {
        const ctx = texture.ctx;
        ctx.clearRect(0, 0, texture.widthPx, texture.heightPx)
        ctx.fillStyle = '#ccc';
        ctx.fillRect(
            0, 0, texture.widthPx, texture.heightPx
        )
        ctx.drawImage(texture.image,
            0, 0, texture.widthPx, texture.heightPx
        )
        ctx.fillStyle = '#f00';
        ctx.font = "600 12px Courier";
        ctx.fillText(dialogue.heading, 8, 20);

        if (dialogue.options === null) {
            // no options provided; bigger text and currently 'B' to exit
            ctx.fillStyle = '#000';
            ctx.font = "600 20px Courier";
            const texts = wrapText(dialogue.message, 25); // 25 chars for 20px font
            ctx.fillText(texts[0], 8, 48);
            ctx.fillText(texts[1], 8, 80);
        } else {
            // smaller text and and "choose an option" prompt
            ctx.fillStyle = '#000';
            ctx.font = "600 16px Courier";
            const texts = wrapText(dialogue.message, 30); // 30 chars for 16px font
            // Options rendering (aligned right, stacked leftward)
            const optionsCoords = [];
            let y = 84; // Fixed Y position for all options
            let x = texture.widthPx - 8; // Start from the far right
            // draw the options
            for (let i = dialogue.options.length - 1; i >= 0; i--) { // Loop right-to-left
                const optionText = dialogue.options[i].label;
                const textWidth = ctx.measureText(optionText).width;
                x -= textWidth; // Move left
                // save the coordinates
                optionsCoords[i] = {
                    x: x - 4 + CELL_PX * 0.5,
                    y: y - 14 + CELL_PX * 5.5,
                    width: textWidth + 8,
                    height: 20
                };

                ctx.fillText(optionText, x, y);

                x -= 12; // Add spacing between options
            }


            ctx.fillText(texts[0], 8, 40);
            ctx.fillText(texts[1], 8, 60);


            // return optionsCoords;
            this.optionsCoords = optionsCoords;
        }
    }


}