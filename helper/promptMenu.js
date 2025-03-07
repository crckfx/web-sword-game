import { FLOOR_CELL_PIXELS } from "../document.js";
import { direction_to_1D } from "./directions.js";

// function to split text (prepare for dialogue)
export function wrapText(input, charLimit = 25) {
    const words = input.split(' ');
    let lines = ['', ''];
    // Build the lines
    let lineIndex = 0;
    words.forEach(word => {
        // If the word fits, add it to the current line
        if (lines[lineIndex].length + word.length + (lines[lineIndex] ? 1 : 0) <= charLimit) {
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
   // get the pixel sizes for the texture (relative to the main pixel base) 
    const widthPx = FLOOR_CELL_PIXELS * 10;     // 10 game cells wide
    const heightPx = FLOOR_CELL_PIXELS * 3;     // 3 game cells tall
    // create a canvas, set its size, get a context
    const canvas = document.createElement('canvas');
    canvas.width = widthPx;
    canvas.height = heightPx;
    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.imageSmoothingEnabled = false;
    // return a special 'texture' (including context)
    return {
        image: backgroundImage, // for use later as a static background
        canvas: canvas,
        ctx: ctx,
        widthPx: widthPx,
        heightPx: heightPx,
    }
}



export function tryPromptMove(direction, length, index) {
    let target = 0;
    if (index !== null) target = index;
    target += direction_to_1D(direction);

    if (target > -1 && target < length) {
        // console.log(`promptIndex is now ${this.promptIndex}`);
        return target;
    } else {
        return index;
    }

}
