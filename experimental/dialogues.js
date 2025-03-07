import { FLOOR_CELL_PIXELS } from "../document.js";

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

// function to create the inventory items layout
export async function createInventoryItemsTexture() {
    const slotPx = FLOOR_CELL_PIXELS + 8;
    // get the pixel sizes for the map
    const widthPx = slotPx * 6;
    const heightPx = slotPx * 2;
    const itemsCanvas = document.createElement('canvas');
    itemsCanvas.width = widthPx;
    itemsCanvas.height = heightPx;
    const itemsCtx = itemsCanvas.getContext('2d');
    itemsCtx.imageSmoothingEnabled = false;
    // return a special 'texture' (including context)
    return {
        canvas: itemsCanvas,
        ctx: itemsCtx,
        widthPx: widthPx,
        heightPx: heightPx,
    }    
}

// function to create the inventory background layout
export async function createInventoryBackground(slotBorder) {
    const slotPx = FLOOR_CELL_PIXELS + 8;
    // get the pixel sizes for the map
    const widthPx = slotPx * 6;
    const heightPx = slotPx * 2;

    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = widthPx;
    bgCanvas.height = heightPx;
    const bgCtx = bgCanvas.getContext('2d');
    bgCtx.imageSmoothingEnabled = false;

    bgCtx.fillStyle = '#ff0a';
    bgCtx.fillRect(
        0, 0, widthPx, heightPx
    )

    // create 2 rows
    for (let j = 0; j < 2; j++) {
        for (let i = 0; i < 6; i++) {
            let startX = i * slotPx;
            let startY = j * slotPx;
            bgCtx.fillStyle = "#222";
            bgCtx.fillRect(startX, startY, slotPx, slotPx);
            bgCtx.drawImage(
                slotBorder,
                startX, startY, slotPx, slotPx
            )
        }
    }

    return {
        canvas: bgCanvas,
        // ctx: bgCtx,
        widthPx: widthPx,
        heightPx: heightPx,
    }

}
