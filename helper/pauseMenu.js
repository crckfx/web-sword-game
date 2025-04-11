import { newCanvasPair } from "../levels/draw-kit.js";
import { swordGame } from "../loader/world-loader.js";
import { direction_to_1D } from "./directions.js";
import { gridCells } from "./grid.js";

// function to create the base dialogue layout
export function createPauseMenuDrawKit() {
    // get the pixel sizes for the texture (relative to the main pixel base) 
    const widthPx = gridCells(10);
    const heightPx = gridCells(5);
    const baseCanv = newCanvasPair(widthPx, heightPx);
    // create a canvas, set its size, get a context
    const canvas = document.createElement('canvas');
    canvas.width = widthPx;
    canvas.height = heightPx;
    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.imageSmoothingEnabled = false;
    // return a special 'texture' (including context)

    ctx.fillStyle = 'green'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // draw a box
    const optionWidth = canvas.width / 2 - 12;
    const optionHeight = 28;
    const optionStartX = gridCells(3);
    ctx.fillStyle = 'white';
    ctx.font = "600 24px Courier";
    ctx.strokeStyle = 'white';

    // four options?
    for (let i = 0; i < swordGame.pauseMenu.options.length; i++) {
        const offset_y = 9 + i * 36;
        ctx.strokeRect(optionStartX, offset_y, optionWidth, optionHeight);
        ctx.fillText(swordGame.pauseMenu.options[i], optionStartX + 4, 30 + i * 36)
    }


    return {
        // image: backgroundImage, // for use later as a static background
        baseCanv: newCanvasPair(widthPx, heightPx),
        canvas: canvas,
        ctx: ctx,
        widthPx: widthPx,
        heightPx: heightPx,
        optionWidth: optionWidth,
        optionHeight: optionHeight,
        optionStartX: optionStartX,
        selector: newCanvasPair(widthPx, heightPx)
    }
}

export function tryPauseMove(direction) {
    if (direction === 'Left' || direction === 'Right') {
        return;
    }

    if (direction === 'Up' || direction === 'Down') {
        const moveDir1D = direction_to_1D(direction);
        // console.log(`move in pause menu?`);
        const result = swordGame.pauseMenu.index + moveDir1D;
        if (result < 0) {
            swordGame.pauseMenu.index = swordGame.pauseMenu.options.length - 1;
        } else if (result > swordGame.pauseMenu.options.length - 1) {
            swordGame.pauseMenu.index = 0;
        } else {
            swordGame.pauseMenu.index = result;
        }

        swordGame.renderer.drawPauseMenu();
    }
}

// export function 