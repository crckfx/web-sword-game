import { FLOOR_CELL_PIXELS } from "../document.js";
import { createDialogueTexture } from "../experimental/dialogues.js";
import { extract_single_sprite, extract_sized_single_texture, extractSprites } from "../sprite.js";

async function load_image_files(object, files) {
    for (const key in files) {
        object[key] = await loadImage(files[key]);
    }
}

export async function load_image_resources(images, textures) {
    try {
        await load_image_files(images,
            {
                tree: 'images/tree_1.png',
                spriteDefault: 'images/sprites_transparent.png',
                spriteRed: 'images/sprites_transparent_red.png',
                spriteYellow: 'images/sprites_transparent_yellow.png',
                cobblestone: 'images/cobblestone.png',
                dirt: 'images/dirt.png',
                manyTextures: 'images/Textures-16.png',
                largeTree: 'images/large_tree_1.png',
                largeTree_test: 'images/overlay_tree_test.png',
                tree1_overlay: 'images/tree_1_overlay.png',
                fruitSheet: 'images/FruitsSheet16x16.png',
                shikashiTextures: 'images/shikashiV2_32px.png',
                inventory_border: 'images/inventory_slot.png',
                dialogue_background: 'images/dialogue_background_2.png',
                crate: "images/Crates by Mikiz/Brown crates/Brown Crates 1.png",
                crateShadow: "images/crate_experiments_4.png",
                questionMark: "images/questionMark.png",
            }
        )

        textures.tree1_overlay = await extract_sized_single_texture(images.tree1_overlay, 0, 0, 16, 32)
        textures.tree2_overlay = await extract_sized_single_texture(images.largeTree_test, 0, 0, 32, 48)
        textures.apple = await extract_sized_single_texture(images.fruitSheet, 0, 0, 16, 16)
        // console.log(textures.apple);
        textures.sword = await extract_sized_single_texture(images.shikashiTextures, 0, 0, 32, 32);
        textures.sword2 = await extract_sized_single_texture(images.shikashiTextures, 1, 5, 32, 32);
        textures.apple2 = await extract_sized_single_texture(images.shikashiTextures, 0, 14, 32, 32);
        textures.egg = await extract_sized_single_texture(images.shikashiTextures, 6, 15, 32, 32);
        textures.potPlant3 = await extract_sized_single_texture(images.shikashiTextures, 5, 12, 32, 32);



        // the inv textures has a background layer and a borders layer; experimental
        const invTextures = await createInventoryTextures(images.inventory_border);
        textures.inventoryBg = invTextures.background.canvas;
        textures.inventoryItems = invTextures.items.canvas;
        // the dialogue textures
        textures.sampleText = await createDialogueTexture(images.dialogue_background);


        // textures.

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

export async function createInventoryTextures(slotBorder) {
    //
    const slotPx = FLOOR_CELL_PIXELS + 8;

    // get the pixel sizes for the map
    const widthPx = slotPx * 6;
    const heightPx = slotPx * 2;
    // Create an offscreen bgCanvas for each sprite
    //
    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = widthPx;
    bgCanvas.height = heightPx;
    const bgCtx = bgCanvas.getContext('2d');
    bgCtx.imageSmoothingEnabled = false;
    //
    const itemsCanvas = document.createElement('canvas');
    itemsCanvas.width = widthPx;
    itemsCanvas.height = heightPx;
    const itemsCtx = itemsCanvas.getContext('2d');
    itemsCtx.imageSmoothingEnabled = false;

    bgCtx.fillStyle = '#ff0a';
    bgCtx.fillRect(
        0, 0, widthPx, heightPx
    )

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
        background: {
            canvas: bgCanvas,
            ctx: bgCtx
        },
        items: {
            canvas: itemsCanvas,
            ctx: itemsCtx
        }
    }

}

