import { FLOOR_CELL_PIXELS } from "../document.js";

export function wrapText(input) {
    const maxLen = 25;
    const words = input.split(' ');
    let lines = ['', ''];

    // Build the lines
    let lineIndex = 0;
    words.forEach(word => {
        // If the word fits, add it to the current line
        if (lines[lineIndex].length + word.length + (lines[lineIndex] ? 1 : 0) <= maxLen) {
            lines[lineIndex] += (lines[lineIndex] ? ' ' : '') + word;
        } else {
            // Move to the next line when the word exceeds the max length
            lineIndex++;
            lines[lineIndex] = word;
        }
    });

    return lines;
}    


// function to create the base dialogue layout
export async function createDialogueTexture(backgroundImage) {

    const padding = 8;

    // get the pixel sizes for the texture (relative to the main pixel base) 
    const widthPx = FLOOR_CELL_PIXELS * 10;     // 10 game cells wide
    const heightPx = FLOOR_CELL_PIXELS * 3;     // 3 game cells tall
    // create a canvas, set its size, get a context
    const canvas = document.createElement('canvas');
    canvas.width = widthPx;
    canvas.height = heightPx;
    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.imageSmoothingEnabled = false;
    // draw the background
    ctx.drawImage(backgroundImage, 0, 0, widthPx, heightPx)
    ctx.fillStyle = '#f00';
    ctx.font = "600 16px Courier";
    ctx.fillText("default", 8, 20);

    ctx.fillStyle = '#000';
    ctx.font = "600 20px Courier";
    // ctx.fillText("sample text with some more words", 8, 32)
    ctx.fillText("abcdefghijklmnopqrstuvwxy", padding, 48)
    ctx.fillText("0123456789012345678901234", padding, 80)
    const metrics = ctx.measureText("0");
    console.log(metrics.width); // Should be around 252-300px

    return {
        image: backgroundImage,
        canvas: canvas,
        ctx: ctx,
        widthPx: widthPx,
        heightPx: heightPx,
    }

}
