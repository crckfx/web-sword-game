import { extract_single_sprite, extractSprites } from "../sprite.js";

export async function load_image_resources(images, textures) {
    try {
        // fetch the resources
        images.tree = await loadImage('images/tree_1.png');
        images.spriteDefault = await loadImage('images/sprites_transparent.png');
        images.spriteRed = await loadImage('images/sprites_transparent_red.png');
        images.spriteYellow = await loadImage('images/sprites_transparent_yellow.png');
        images.cobblestone = await loadImage('images/cobblestone.png');
        images.dirt = await loadImage('images/dirt.png');

        images.manyTextures = await loadImage('images/Textures-16.png');
        images.largeTree = await loadImage('images/large_tree_1.png');
        images.largeTree_test = await loadImage('images/overlay_tree_test.png');
        
        // unpack the texture resources
        textures.spriteDefault = await extractSprites(images.spriteDefault);
        textures.spriteRed = await extractSprites(images.spriteRed);
        textures.spriteYellow = await extractSprites(images.spriteYellow);
        // sprite textures are now loaded

        textures.road = await extract_single_sprite(images.manyTextures, 3, 2);
        textures.grass = await extract_single_sprite(images.manyTextures, 3, 15, 16);
        textures.grass2 = await extract_single_sprite(images.manyTextures, 2, 15, 16);
        textures.dirt = await extract_single_sprite(images.manyTextures, 1, 30);
        textures.water = [
            await extract_single_sprite(images.manyTextures, 11, 8),
            await extract_single_sprite(images.manyTextures, 12, 8),
            await extract_single_sprite(images.manyTextures, 13, 8),
            await extract_single_sprite(images.manyTextures, 12, 8),
        ];
        textures.sand = await extract_single_sprite(images.manyTextures, 1, 6);
    } catch (error) {
        console.error('error loading image resource', error);
    }
}

export async function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img); // resolves when image is loaded
        img.onerror = reject; // rejects on error
        img.src = url;
    });
}

