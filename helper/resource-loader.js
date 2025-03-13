import { CELL_PX } from "../document.js";
import { createDialogueTexture } from "./promptMenu.js";
import { createInventoryBackground, createInventoryItemsTexture } from "./invMenu.js";
import { extract_single_sprite, extract_sized_single_texture, extract_texture_modular, extractSprites } from "../sprite.js";

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
                schwarnhildTextures: "images/basic_tileset_and_assets_standard/assets_spritesheet_v2_free.png",
                schwarnhildTerrains: "images/basic_tileset_and_assets_standard/terrain_tiles_v2.png",
                schwarnhildDirtPaths: "images/basic_tileset_and_assets_standard/dirtpath_tiles.png",
                ghetti_16: "images/ghetti_16.png",
                ghetti_32: "images/ghetti_32.png",
                grassDirt: "images/tiles/grass-dirt.png",
                grassSand: "images/tiles/grass-sand.png",
                sandGrass: "images/tiles/sand-grass.png",
                dirt: 'images/tiles/dirt.png',

                grassTileBasic: "images/tiles/grass.png",

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

        textures.tree_S_A = await extract_texture_modular(images.schwarnhildTextures, 0, 0, 64, 96);
        textures.tree_S_B = await extract_texture_modular(images.schwarnhildTextures, 64, 0, 64, 96);
        textures.schwarnhildDirtPaths = images.schwarnhildDirtPaths;
        textures.grassTileBasic = images.grassTileBasic;
        textures.grassDirt = images.grassDirt;
        textures.grassSand = images.grassSand;
        textures.sandGrass = images.sandGrass;

        // textures.dirtPaths = await extractSprites(images.schwarnhildDirtPaths)
        
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
        
        textures.road = await extract_single_sprite(images.manyTextures, 3, 2);
        textures.grass = await extract_single_sprite(images.manyTextures, 3, 15, 16);
        // textures.grass = await extract_texture_modular(images.schwarnhildTerrains, 160, 160, 32, 32);
        textures.grass2 = await extract_single_sprite(images.manyTextures, 2, 15, 16);
        textures.dirt = images.dirt;
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
