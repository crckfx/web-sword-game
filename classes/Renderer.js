import { cell_size, MIDDLE_CELL, FLOOR_CELL_PIXELS } from "../document.js";
import { wrapText } from "../helper/promptMenu.js";
import { gridCells } from "../helper/grid.js";
import { player } from "../helper/world-loader.js";
// import { images, textures } from "../sprite.js";
import { Vector2 } from "./Vector2.js";

export class Renderer {
    shouldDrawPlayerInventory = false;
    shouldDrawDialogueBox = false;

    player_offset = 5;
    invCellSize = 40;
    optionsCoords = null;

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
        // clear it
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // draw black first
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // draw it up
        const cameraX = (player.position.x - MIDDLE_CELL.x);
        const cameraY = (player.position.y - MIDDLE_CELL.y);
        const cameraWidth = gridCells(this.cells.x);
        const cameraHeight = gridCells(this.cells.y);
        // draw the floor
        this.ctx.drawImage(
            this.textures.mapFloor,
            cameraX, cameraY, cameraWidth, cameraHeight,
            0, 0, this.canvas.width, this.canvas.height
        );
        this.drawPlayer(); // draw player
        // draw entities
        for (const key in this.game.entities) {
            this.drawEntity(this.game.entities[key], cameraX, cameraY);
        }
        // draw 'occupants' (doodads?)
        this.ctx.drawImage(this.textures.mapOccupants[0],
            cameraX, cameraY, cameraWidth, cameraHeight,
            0, 0, this.canvas.width, this.canvas.height
        );
        if (this.shouldDrawPlayerInventory) this.drawInventory();
        if (this.shouldDrawDialogueBox) this.drawDialogueBox();
    }

    drawPlayer() {
        // do not shift the player; shift the floor? 
        // because both camera and player update their position instantly, we keep the player still when the camera moves
        this.ctx.drawImage(
            // player.texture[index],
            player.texture[player.frame],
            MIDDLE_CELL.x,
            MIDDLE_CELL.y,
            cell_size.x, cell_size.y
        );
    }

    // draw an entity specifically
    drawEntity(entity, cameraX, cameraY) {
        this.ctx.drawImage(
            entity.getEntitySprite(),
            // entity.texture[entity.frame],
            // this.textures.sword,
            entity.position.x - cameraX,
            entity.position.y - cameraY,
            cell_size.x,
            cell_size.y
        );
        if (entity.hasAlert) {
            this.drawCellBorder(
                entity.position.x - cameraX,
                entity.position.y - cameraY,
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

    modifyDialogueText_basic(heading = "", text = "") {
        const texture = this.textures.sampleText; // this is a special type of texture though; it has a ctx included
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
        ctx.font = "600 16px Courier";
        ctx.fillText(heading, 8, 20);

        // ctx.font = "600 24px Courier";
        ctx.fillStyle = '#000';
        ctx.font = "600 20px Courier";
        // ctx.fillText("sample text with some more words", 8, 32)
        const texts = wrapText(text);

        ctx.fillText(texts[0], 8, 48);
        ctx.fillText(texts[1], 8, 80);
    }


    modifyDialogueWithOptions(heading = "", text = "", options) {
        const texture = this.textures.sampleText; // this is a special type of texture though; it has a ctx included
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
        ctx.fillText(heading, 8, 20);

        ctx.fillStyle = '#000';
        ctx.font = "600 16px Courier";
        const texts = wrapText(text, 30);

        // Options rendering (aligned right, stacked leftward)
        const optionsCoords = [];
        let y = 84; // Fixed Y position for all options
        let x = texture.widthPx - 8; // Start from the far right
        for (let i = options.length - 1; i >= 0; i--) { // Loop right-to-left
            const optionText = options[i].text;
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
        // ctx.fillText(optionsText, 8, 84);

        // return optionsCoords;
        this.optionsCoords = optionsCoords;
    }



}