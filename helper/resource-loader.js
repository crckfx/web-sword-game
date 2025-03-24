import { createDialogueTexture } from "./promptMenu.js";
import { createInventoryBackground, createInventoryItemsTexture } from "./invMenu.js";
import { extract_single_sprite, extract_sized_single_texture, extract_texture_modular, extractSprites } from "./sprite.js";

async function load_image_files(object, files) {
    for (const key in files) {
        object[key] = await loadImage(files[key]);
    }
}

export async function load_image_resources(images, textures) {
    try {
        await load_image_files(images, {
            // entities
            spriteDefault: 'images/sprites_transparent.png',
            spriteRed: 'images/sprites_transparent_red.png',
            spriteYellow: 'images/sprites_transparent_yellow.png',
            // self-made and/or silly things
            tree: 'images/tree_1.png',
            largeTree: 'images/large_tree_1.png',
            // UI stuff
            inventory_border: 'images/inventory_slot.png',
            dialogue_background: 'images/dialogue_background_2.png',
            questionMark: "images/questionMark.png",
            // sheets
            manyTextures: 'images/Textures-16.png',
            fruitSheet: 'images/FruitsSheet16x16.png',
            shikashiTextures: 'images/shikashiV2_32px.png',
            schwarnhildTextures: "images/basic_tileset_and_assets_standard/assets_spritesheet_v2_free.png",
            meshTree: "images/tree_mesher_2.png",
            schwarnhildTerrains: "images/basic_tileset_and_assets_standard/terrain_tiles_v2.png",
            schwarnhildDirtPaths: "images/basic_tileset_and_assets_standard/dirtpath_tiles.png",
            schwarnhildFences: "images/basic_tileset_and_assets_standard/fence_tiles.png",
            trees_oak: 'images/trees_winter_oak_modified.png',
            boats: 'images/boat0001-sheet.png',
            // tileSheets
            grassDirt: "images/tiles/grass-dirt.png",
            grassSand: "images/tiles/grass-sand.png",
            sandGrass: "images/tiles/sand-grass.png",
            sandDirt: "images/tiles/sand-dirt.png",
            dirtSand: "images/tiles/dirt-sand.png",
            dirtGrass: "images/tiles/dirt-grass.png",
            stoneDirt: "images/tiles/stone-dirt.png",
            stoneGrass: "images/tiles/stone-grass.png",
            dirt: 'images/tiles/dirt.png',
            island: 'images/tiles/island.png',
            // misc
            cobblestone: 'images/cobblestone.png',
            crate: "images/Crates by Mikiz/Brown crates/Brown Crates 1.png",
            crateShadow: "images/crate_experiments_4.png",
            ghetti_16: "images/ghetti_16.png",
            ghetti_32: "images/ghetti_32.png",
            grassTileBasic: "images/tiles/grass.png",


        });

        images.apple = await extract_sized_single_texture(images.fruitSheet, 0, 0, 16, 16)
        images.apple2 = await extract_sized_single_texture(images.shikashiTextures, 0, 14, 32, 32);
        images.egg = await extract_sized_single_texture(images.shikashiTextures, 6, 15, 32, 32);
        images.grass2 = await extract_single_sprite(images.manyTextures, 2, 15, 16);
        images.potPlant3 = await extract_sized_single_texture(images.shikashiTextures, 5, 12, 32, 32);
        images.sword = await extract_sized_single_texture(images.shikashiTextures, 1, 5, 32, 32);
        images.tree_S_A = await extract_texture_modular(images.schwarnhildTextures, 0, 0, 64, 96);
        images.tree_S_B = await extract_texture_modular(images.schwarnhildTextures, 64, 0, 64, 96);
        images.water = await extract_single_sprite(images.manyTextures, 11, 8);
        images.boat = await extract_texture_modular(images.boats, 64*3, 64*3, 64, 64);

        // the dialogue and inventory textures
        textures.sampleText = await createDialogueTexture(images.dialogue_background);
        textures.inventoryBg = await createInventoryBackground(images.inventory_border);
        textures.inventoryItems = await createInventoryItemsTexture();
        // ^^^^ these are all SPECIAL textures (contain a canvas and a ctx for redraws)

        // unpack the texture resources
        textures.spriteDefault = await extractSprites(images.spriteDefault);
        textures.spriteRed = await extractSprites(images.spriteRed);
        textures.spriteYellow = await extractSprites(images.spriteYellow);
        // sprite textures are now loaded


        textures.water = [
            await extract_single_sprite(images.manyTextures, 11, 8),
            await extract_single_sprite(images.manyTextures, 12, 8),
            await extract_single_sprite(images.manyTextures, 13, 8),
            await extract_single_sprite(images.manyTextures, 12, 8),
        ];
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
