

export function extractSprites(spriteSheet) {
    const SPRITE_SIZE = 16;
    const SPRITES_PER_ROW = 4;
    const SPRITE_COUNT = 8 * SPRITES_PER_ROW; // Total number of sprites (4 columns, 8 rows)
    // Cache for storing sprite textures
    const spriteTextures = [];
    for (let i = 0; i < SPRITE_COUNT; i++) {
        const sx = (i % SPRITES_PER_ROW) * SPRITE_SIZE;
        const sy = Math.floor(i / SPRITES_PER_ROW) * SPRITE_SIZE;

        // Create an offscreen canvas for each sprite
        const spriteCanvas = document.createElement('canvas');
        spriteCanvas.width = SPRITE_SIZE;
        spriteCanvas.height = SPRITE_SIZE;

        const spriteCtx = spriteCanvas.getContext('2d');
        // Draw the sprite onto the offscreen canvas
        spriteCtx.drawImage(
            spriteSheet,
            sx, sy, SPRITE_SIZE, SPRITE_SIZE,  // Source rectangle from sprite sheet
            0, 0, SPRITE_SIZE, SPRITE_SIZE    // Draw full size to the offscreen canvas
        );

        spriteTextures.push(spriteCanvas);
    }

    return spriteTextures;
}


export function extract_single_sprite(spriteSheet, x, y, size = 16) {
    // Create an offscreen canvas for each sprite
    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = size;
    spriteCanvas.height = size;

    const spriteCtx = spriteCanvas.getContext('2d');
    // Draw the sprite onto the offscreen canvas
    spriteCtx.drawImage(
        spriteSheet,
        x * size, y * size, size, size,  // Source rectangle from sprite sheet
        0, 0, size, size    // Draw full size to the offscreen canvas
    );

    return spriteCanvas;
}

// here we input an index "pos", not a 
export function extract_sized_single_texture(image, posX = 0, posY = 0, sizeX = 16, sizeY = 16) {
    // note: takes in x and y as INDEX positions 
    const sx = posX * sizeX;
    const sy = posY * sizeY;

    // create a canvas for the texture
    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = sizeX;
    spriteCanvas.height = sizeY;

    const spriteCtx = spriteCanvas.getContext('2d');
    // Draw the sprite onto the offscreen canvas
    spriteCtx.drawImage(
        image,
        sx, sy, sizeX, sizeY,  // Source rectangle from sprite sheet
        0, 0, sizeX, sizeY    // Draw full size to the offscreen canvas
    );

    return spriteCanvas;
}

export function extract_texture_modular(image, pixelX = 0, pixelY = 0, width = 32, height = 32) {
    // create a canvas for the texture    
    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = width;
    spriteCanvas.height = height;
    const spriteCtx = spriteCanvas.getContext('2d');
    // Draw the sprite onto the offscreen canvas
    spriteCtx.drawImage(
        image,
        pixelX, pixelY, width, height,  // Source rectangle from sprite sheet
        0, 0, width, height    // Draw full size to the offscreen canvas
    );

    return spriteCanvas;
}