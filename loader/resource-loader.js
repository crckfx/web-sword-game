import { createDialogueTexture } from "../helper/promptMenu.js";
import { createInventoryBackground, createInventoryItemsTexture } from "../helper/invMenu.js";
import { extract_single_sprite, extract_sized_single_texture, extract_texture_modular, extractSprites } from "../helper/extract-helper.js";

export async function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img); // resolves when image is loaded
        img.onerror = reject; // rejects on error
        img.src = url;
    });
}


export async function load_image_resources(images, textures) {
    try {
        const imageKeys = {
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
            // self made sheets
            stonePure: "images/tiles/stone-pure.png",
            grassPure: "images/tiles/grass-pure.png",
            sandPure: "images/tiles/sand-pure.png",
            // dirtPure: "images/tiles/dirt-pure.png",
            island: 'images/tiles/island2.png',
            // misc
            dirt: 'images/tiles/dirt.png',
            cobblestone: 'images/cobblestone.png',
            crate: "images/Crates by Mikiz/Brown crates/Brown Crates 1.png",
            crateShadow: "images/crate_experiments_4.png",
            ghetti_16: "images/ghetti_16.png",
            ghetti_32: "images/ghetti_32.png",
            grassTileBasic: "images/tiles/grass.png",

        };

        // use a 'Promise.all' to load all images in parallel
        const loadedImages = await Promise.all(
            Object.entries(imageKeys).map(([key, src]) => 
                loadImage(src).then(img => [key, img])
            )
        );
        // populate the images object
        loadedImages.forEach(([key, img]) => images[key] = img);


        images.apple = extract_sized_single_texture(images.fruitSheet, 0, 0, 16, 16)
        images.apple2 = extract_sized_single_texture(images.shikashiTextures, 0, 14, 32, 32);
        images.egg = extract_sized_single_texture(images.shikashiTextures, 6, 15, 32, 32);
        images.grass2 = extract_single_sprite(images.manyTextures, 2, 15, 16);
        images.potPlant3 = extract_sized_single_texture(images.shikashiTextures, 5, 12, 32, 32);
        images.sword = extract_sized_single_texture(images.shikashiTextures, 1, 5, 32, 32);
        images.ticket = extract_sized_single_texture(images.shikashiTextures, 9, 13, 32, 32);
        images.tree_S_A = extract_texture_modular(images.schwarnhildTextures, 0, 0, 64, 96);
        images.tree_S_B = extract_texture_modular(images.schwarnhildTextures, 64, 0, 64, 96);
        images.water = extract_single_sprite(images.manyTextures, 11, 8);
        // images.boat = extract_texture_modular(images.boats, 64*3, 64*3, 64, 64);
        images.boat_down = extract_texture_modular(images.boats, 64*3, 64*3, 64, 64);
        images.boat_up = extract_texture_modular(images.boats, 0,0, 64, 64);
        images.boat_southEast = extract_texture_modular(images.boats, 64*4, 64*2, 64, 64);
        // saveCanvasAsPNG(images.boat);

        // reserving the "textures" names for alternate data structures (ie. not just an img or canvas)
        // the dialogue and inventory textures
        textures.sampleText = createDialogueTexture(images.dialogue_background);
        textures.inventoryBg = createInventoryBackground(images.inventory_border);
        textures.inventoryItems = createInventoryItemsTexture();
        // ^^^^ these are all SPECIAL textures (contain a canvas and a ctx for redraws)

        // unpack the texture resources
        textures.spriteDefault = extractSprites(images.spriteDefault);
        textures.spriteRed = extractSprites(images.spriteRed);
        textures.spriteYellow = extractSprites(images.spriteYellow);
        // sprite textures are now loaded


        textures.water = [
            extract_single_sprite(images.manyTextures, 11, 8),
            extract_single_sprite(images.manyTextures, 12, 8),
            extract_single_sprite(images.manyTextures, 13, 8),
            extract_single_sprite(images.manyTextures, 12, 8),
        ];

    } catch (error) {
        console.error('Error loading image resource', error);
    }
}
