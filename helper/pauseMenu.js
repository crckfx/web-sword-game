import { newCanvasPair } from "../levels/draw-kit.js";
import { swordGame } from "../loader/world-loader.js";
import { direction_to_1D } from "./directions.js";
import { gridCells } from "./grid.js";

// function to create the base dialogue layout
export function createPauseMenuDrawKit(menu, widthPx, heightPx) {
    const baseCanv = newCanvasPair(widthPx, heightPx);

    // draw a box
    const optionWidth = widthPx / 2 - 12;
    const optionHeight = 28;
    const optionStartX = gridCells(3);

    baseCanv.ctx.fillStyle = 'green'
    baseCanv.ctx.fillRect(0, 0, widthPx, heightPx)
    baseCanv.ctx.fillStyle = 'white';
    baseCanv.ctx.font = "600 24px Courier";
    baseCanv.ctx.strokeStyle = 'white';

    // four options?
    for (let i = 0; i < menu.options.length; i++) {
        const offset_y = 9 + i * 36;
        baseCanv.ctx.strokeRect(optionStartX, offset_y, optionWidth, optionHeight);
        baseCanv.ctx.fillText(menu.options[i], optionStartX + 4, 30 + i * 36)
    }

    return {
        baseCanv: baseCanv, // the actual menu pair
        selector: newCanvasPair(widthPx, heightPx), // an overlay pair for the menu's selector
        widthPx: widthPx,               // pause menu sizing
        heightPx: heightPx,             // pause menu sizing
        optionWidth: optionWidth,       // menu option sizing
        optionHeight: optionHeight,     // menu option sizing
        optionStartX: optionStartX,     // menu option sizing
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