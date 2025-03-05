import { cell_size, MIDDLE_CELL, entities, FLOOR_CELL_PIXELS } from "../document.js";
import { wrapText } from "../experimental/dialogues.js";
import { facingToVector, gridCells } from "../helper/grid.js";
import { player } from "../helper/world-loader.js";
// import { images, textures } from "../sprite.js";
import { Vector2 } from "./Vector2.js";

export class Renderer {
    shouldDrawPlayerInventory = false;
    shouldDrawSampleText = false;

    player_offset = 5;

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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawFloorsAndDoodads(); // a.k.a. do everything
        if (this.shouldDrawPlayerInventory) this.drawInventory();
        if (this.shouldDrawSampleText) this.drawSampleText();
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
    drawEntity(entity) {
        this.ctx.drawImage(
            entity.getEntitySprite(),
            // this.textures.sword,
            entity.position.x - (player.position.x - MIDDLE_CELL.x),
            entity.position.y - (player.position.y - MIDDLE_CELL.y),
            cell_size.x,
            cell_size.y
        );
        if (entity.hasAlert) {
            this.drawBorder(
                entity.position.x - (player.position.x - MIDDLE_CELL.x),
                entity.position.y - (player.position.y - MIDDLE_CELL.y),
                "red"
            );
        }
    }

    // a.k.a. draw everything
    drawFloorsAndDoodads() {
        const sourceX = (player.position.x - MIDDLE_CELL.x);
        const sourceY = (player.position.y - MIDDLE_CELL.y);
        const sourceWidth = gridCells(this.cells.x);
        const sourceHeight = gridCells(this.cells.y);
        // draw the floor
        this.ctx.drawImage(
            this.textures.mapFloor,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, this.canvas.width, this.canvas.height
        );
        this.drawPlayer(); // draw player
        // draw entities
        for (const key in this.game.entities) {
            this.drawEntity(this.game.entities[key]);
        }
        // draw 'occupants' (doodads?)
        this.ctx.drawImage(this.textures.mapOccupants[0],
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, this.canvas.width, this.canvas.height
        );
    }

    // helper to draw a border on the main canvas
    drawBorder(x, y, colour = 'green') {
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
        // draw the inventory background
        const posX = FLOOR_CELL_PIXELS * 1.75;
        const posY = FLOOR_CELL_PIXELS * 0.75;
        this.ctx.drawImage(this.textures.inventoryBg, posX, posY);
        // draw the items layer
        this.ctx.drawImage(this.textures.inventoryItems, posX, posY);
        // draw the select layer
        this.ctx.strokeStyle = "red";
        this.ctx.lineWidth = 4;

        let y = player.bagCursorIndex < 6 ? 0 : 1; // calculate the y for the display
        this.ctx.strokeRect(
            posX + (player.bagCursorIndex % 6) * 40, posY + y * 40,
            40, 40
        )

        this.ctx.drawImage(this.textures.sword2, 0, 0, cell_size.x, cell_size.y)
    }

    modifyInventoryTexture() {
        this.inventoryCtx.clearRect(0, 0, this.textures.inventoryItems.width, this.textures.inventoryItems.height)
        for (let i = 0; i < player.bag.slots.length; i++) {
            const slot = player.bag.slots[i];
            if (slot !== null) {
                const invTexture = slot.invTexture ?? this.textures.sword2;
                const x = i % 6;
                const y = i < 6 ? 0 : 1;
                console.log(`should update an inventory texture at slot i:${i}, pos:'${x}','${y}'`);
                // draw the background texture
                this.inventoryCtx.drawImage(
                    invTexture,
                    x * (FLOOR_CELL_PIXELS + 8) + 4,
                    y * (FLOOR_CELL_PIXELS + 8) + 4,
                );
            }

        }
    }


    drawSampleText() {
        this.ctx.drawImage(
            this.textures.sampleText.canvas,
            FLOOR_CELL_PIXELS * 0.5,
            FLOOR_CELL_PIXELS * 5.5,
        )
    }

    modifySampleText(heading = "", text = "") {
        const texture = this.textures.sampleText; // this is a special type of texture though
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



}