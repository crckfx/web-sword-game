import { gridCells } from "./grid.js";

// function to create the base dialogue layout
export function createPauseMenuDrawKit() {
   // get the pixel sizes for the texture (relative to the main pixel base) 
    const widthPx = gridCells(10);     // 10 game cells wide
    const heightPx = gridCells(5);     // 3 game cells tall
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

    return {
        // image: backgroundImage, // for use later as a static background
        canvas: canvas,
        ctx: ctx,
        widthPx: widthPx,
        heightPx: heightPx,
    }
}