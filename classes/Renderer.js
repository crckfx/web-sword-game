import { cell_size, MIDDLE_CELL, entities, player } from "../document.js";
import { gridCells } from "../helper/grid.js";
// import { images, textures } from "../sprite.js";
import { Vector2 } from "./Vector2.js";

export class Renderer {
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
        this.drawFloorsAndDoodads(); // draw floors / doodads - uses an image now :)
        this.drawPlayer(); // draw player
        // draw entities
        for (const key in this.game.entities) {
            this.drawEntity(this.game.entities[key]);
        }

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

    drawEntity(entity) {
        this.ctx.drawImage(
            entity.getEntitySprite(),
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


    drawFloorsAndDoodads() {
        const sourceX = (player.position.x - gridCells(5));
        const sourceY = (player.position.y - gridCells(4));
        const sourceWidth = gridCells(this.cells.x);
        const sourceHeight = gridCells(this.cells.y);

        // draw the floor
        this.ctx.drawImage(
            this.images.gameMap,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, this.canvas.width, this.canvas.height);

        this.ctx.drawImage(this.textures.gameOccupants[0],
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, this.canvas.width, this.canvas.height);

    }

    drawBorder(x, y, colour = 'green') {
        // console.log(`draw border at ${x}, ${y}`);
        this.ctx.strokeStyle = colour;
        this.ctx.lineWidth = 1;
    
        // ctx.strokeWidth = 0.1;
        this.ctx.strokeRect(x, y, cell_size.x, cell_size.y);
    }
    


}