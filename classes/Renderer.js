import { cell_size, MIDDLE_CELL, FLOOR_CELL_PIXELS } from "../document.js";
import { wrapText } from "../helper/promptMenu.js";
import { gridCells } from "../helper/grid.js";
import { player } from "../helper/world-loader.js";
// import { images, textures } from "../sprite.js";
import { Vector2 } from "./Vector2.js";
import { Camera } from "./Camera.js";

export class Renderer {
    shouldDrawPlayerInventory = false;
    shouldDrawDialogueBox = false;

    player_offset = 5;
    invCellSize = 40;
    optionsCoords = null;

    camera = new Camera();


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
        this.grid = game.grid ?? null;
        this.cells = new Vector2(cameraCellsX, cameraCellsY) ?? new Vector2(4, 3);
        this.textures = game.textures ?? null;
        this.images = game.images ?? null;

        this.ctx.imageSmoothingEnabled = false;

    }

    // A.K.A. "render_entire_grid"
    draw() {
        this.camera.pos.overwrite(player.position.x - MIDDLE_CELL.x, player.position.y - MIDDLE_CELL.y)
        this.camera.size.overwrite(this.canvas.width, this.canvas.height);
        // // who needs a camera class lol just compute it each frame
        // // yo nah lookups is better lol fix this
        // const camX =  player.position.x - MIDDLE_CELL.x;
        // const camY =  player.position.y - MIDDLE_CELL.y;
        // const camW =  this.canvas.width;
        // const camH =  this.canvas.height;        
        // // for boundary checks eg. entities
        const minX = this.camera.pos.x - cell_size.x;
        const maxX = this.camera.pos.x + this.camera.size.x;
        const minY = this.camera.pos.y - cell_size.y;
        const maxY = this.camera.pos.y + this.camera.size.y;

        // ok now ready to draw

        // clear it
        this.ctx.clearRect(0, 0, this.camera.size.x, this.camera.size.y);
        // draw black first
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.camera.size.x, this.camera.size.y); // ?? could do an image background here instead
        
        // draw it up

        // draw the **floor+doodad** base texture
        this.ctx.drawImage(
            this.textures.mapFloor.canvas,
            this.camera.pos.x, this.camera.pos.y, this.camera.size.x, this.camera.size.y,    // draw a section of the floor
            0, 0, this.camera.size.x, this.camera.size.y                 // at this specified pos + size
        );

        // draw the **player** texture
        this.ctx.drawImage(
            // player.texture[index],
            player.texture[player.frame],
            MIDDLE_CELL.x, MIDDLE_CELL.y - 8,
            cell_size.x, cell_size.y
        );

        // draw **entities**
        for (const e of Object.values(this.game.entities)) {
            const pos = e.position;
            if (e.position.x >= minX && e.position.x < maxX &&
                e.position.y >= minY && e.position.y < maxY) {
                this.drawEntity(e, this.camera.pos.x, this.camera.pos.y);
            }
        }

        this.ctx.drawImage(
            this.textures.mapOverlays.canvas,
            this.camera.pos.x, this.camera.pos.y, this.camera.size.x, this.camera.size.y,
            0, 0, this.camera.size.x, this.camera.size.y
        );
        if (this.shouldDrawPlayerInventory) this.drawInventory();
        if (this.shouldDrawDialogueBox) this.drawDialogueBox();
    }


    // draw an entity specifically
    drawEntity(entity, camX, camY) {
        this.ctx.drawImage(
            entity.getEntitySprite(),
            // entity.texture[entity.frame],
            // this.textures.sword,
            entity.position.x - camX,
            entity.position.y - 6 - camY,
            cell_size.x,
            cell_size.y
        );
        if (entity.hasAlert) {
            this.drawCellBorder(
                entity.position.x - camX,
                entity.position.y - camY,
                "red"
            );
        }
    }

    // helper to draw a border on the main canvas
    drawCellBorder(x, y, colour = 'green') {
        this.ctx.strokeStyle = colour;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, cell_size.x, cell_size.y);
    }

    // draw the pause menu (currently still HTML {unlike inventory/bag} )
    drawPauseMenu() {
        this.ctx.fillStyle = '#000000aa';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.font = "12px serif";
        this.ctx.fillStyle = 'red';
        this.ctx.fillText("paused", 0, 40)
    }

    drawInventory() {
        this.ctx.fillstyle = "#000000aa";
        // this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height)
        // draw the inventory background
        const posX = FLOOR_CELL_PIXELS * 1.75;
        const posY = FLOOR_CELL_PIXELS * 0.75;
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

        this.ctx.drawImage(this.textures.sword2, 0, 0, cell_size.x, cell_size.y)
    }



    drawDialogueBox() {
        this.ctx.drawImage(
            this.textures.sampleText.canvas,
            FLOOR_CELL_PIXELS * 0.5,
            FLOOR_CELL_PIXELS * 5.5,
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
                    x: x - 4 + FLOOR_CELL_PIXELS * 0.5,
                    y: y - 14 + FLOOR_CELL_PIXELS * 5.5,
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