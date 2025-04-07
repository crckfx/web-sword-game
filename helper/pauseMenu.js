import { gridCells } from "./grid.js";

// function to create the base dialogue layout
export function createPauseMenuDrawKit() {
    const pauseOptions = [
        "resume",
        "undefined",
        "undefined",
        "undefined",
    ]


   // get the pixel sizes for the texture (relative to the main pixel base) 
    const widthPx = gridCells(10);
    const heightPx = gridCells(5);
    // create a canvas, set its size, get a context
    const canvas = document.createElement('canvas');
    canvas.width = widthPx;
    canvas.height = heightPx;
    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.imageSmoothingEnabled = false;
    // return a special 'texture' (including context)

    ctx.fillStyle = 'green'
    ctx.fillRect(0,0,canvas.width, canvas.height)
    ctx.fillStyle = 'white';
    ctx.font = "600 20px Courier";
    ctx.fillText("paused", 0, 40)

    // draw a box
    const optionWidth = canvas.width/2 - 12;
    const optionHeight = 24;
    const optionStartX = canvas.width / 2;
    ctx.strokeStyle = 'white';

    // four options?
    for (let i=0; i<pauseOptions.length; i++) {
        const offset_y = i * 36 + 12;
        ctx.strokeRect(optionStartX, offset_y, optionWidth, optionHeight);
        ctx.fillText(pauseOptions[i], optionStartX + 4, 30 + i*36)
    }


    return {
        // image: backgroundImage, // for use later as a static background
        canvas: canvas,
        ctx: ctx,
        widthPx: widthPx,
        heightPx: heightPx,
    }
}