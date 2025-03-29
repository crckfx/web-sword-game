import { CELL_PX } from "../document.js";
import { swordGame, player } from "../loader/world-loader.js";


// function to create the inventory items layout
export function createInventoryItemsTexture() {
    const slotPx = CELL_PX + 8;
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
export function createInventoryBackground(slotBorder) {
    const slotPx = CELL_PX + 8;
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


// translate move messages into inventory messages
export function tryInventoryMove(direction) {
    let target = 0;
    switch (direction) {
        case 'Left':
            if (player.bagCursorIndex !== 6)
                target = -1;
            break;
        case 'Right':
            if (player.bagCursorIndex !== 5)
                target = 1;
            break;
        case 'Up':
            target = -6
            break;
        case 'Down':
            target = 6;
            break;
        default:
            return;
    }
    if (checkInventoryMoveBounds(target)) player.bagCursorIndex += target;
}

function checkInventoryMoveBounds(target) {
    const result = player.bagCursorIndex + target;
    if (result < 0) return false;
    if (result > player.bag.slots.length - 1) return false;
    return true;
}





export function modifyInventoryTexture(texture) {

    texture.ctx.clearRect(0, 0, texture.widthPx, texture.heightPx)
    for (let i = 0; i < player.bag.slots.length; i++) {
        const slot = player.bag.slots[i];
        if (slot !== null) {
            const invTexture = slot.invTexture ?? swordGame.images.questionMark;
            const x = i % 6;
            const y = i < 6 ? 0 : 1;
            console.log(`should update an inventory texture at slot i:${i}, pos:'${x}','${y}'`);
            // draw the background texture
            texture.ctx.drawImage(
                invTexture,
                x * (CELL_PX + 8) + 4,
                y * (CELL_PX + 8) + 4,
            );
        }
    }
}
