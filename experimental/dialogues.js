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


export async function createDialogueTexture(backgroundImage) {
    //
    // const slotPx = FLOOR_CELL_PIXELS + 8;

    // get the pixel sizes for the map
    const widthPx = FLOOR_CELL_PIXELS * 10;
    const heightPx = FLOOR_CELL_PIXELS * 3;
    // Create an offscreen bgCanvas for each sprite
    //
    const canvas = document.createElement('canvas');
    canvas.width = widthPx;
    canvas.height = heightPx;
    const ctx = canvas.getContext('2d', { alpha: false });
    // const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    //


    ctx.fillStyle = '#ccc';
    // ctx.fillRect(
    //     0, 0, widthPx, heightPx
    // )
    ctx.drawImage(backgroundImage, 0, 0, widthPx, heightPx)
    ctx.fillStyle = '#f00';
    ctx.font = "600 16px Courier";
    ctx.fillText("default", 8, 20);

    ctx.fillStyle = '#000';
    ctx.font = "600 20px Courier";
    // ctx.fillText("sample text with some more words", 8, 32)
    ctx.fillText("abcdefghijklmnopqrstuvwxy", 8, 48)
    ctx.fillText("012345678901234567891", 8, 80)
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
