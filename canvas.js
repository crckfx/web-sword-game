import { canvas, ctx, getHtmlControls, panelCenter, resize } from "./document.js";


import { HtmlControls, bindControls } from "./controls.js";
import { NUM_GRID_X, NUM_GRID_Y, doodads, entities, player, game, update, CAMERA_CELLS_Y, CAMERA_CELLS_X, render, images, textures, } from "./game.js";
import { extractSprites, loadImage, extract_single_sprite } from "./sprite.js";
import { map_1, parseFloorMap, parseOccupantMap, applyFloorToGameGrid, applyOccupantsToGameGrid, getMapBackground, getMapOccupants } from "./map.js";
import { Entity } from "./classes/Entity.js";
import { Vector2 } from "./classes/Vector2.js";
import { gridCells } from "./helper/grid.js";
import { Renderer } from "./classes/Renderer.js";
import { GameLoop } from "./classes/GameLoop.js";


async function load_image_resources(images, textures) {
    try {
        // fetch the resources
        images.tree = await loadImage('images/tree_1.png');
        images.spriteDefault = await loadImage('images/sprites_transparent.png');
        images.spriteRed = await loadImage('images/sprites_transparent_red.png');
        images.spriteYellow = await loadImage('images/sprites_transparent_yellow.png');
        images.cobblestone = await loadImage('images/cobblestone.png');
        images.dirt = await loadImage('images/dirt.png');

        images.manyTextures = await loadImage('images/Textures-16.png');

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

async function load_entities(entities, textures) {
    // after we have the textures prepared, we can init the entities without fuss
    entities.gary = new Entity({
        name: 'gary',
        // isFacing: 'down',
        texture: textures.spriteRed,
    });
    entities.fred = new Entity({
        name: 'fred',
        isFacing: 'up',
        texture: textures.spriteYellow,
    });
    entities.george = new Entity({
        name: 'george',
        isFacing: 'right',
        texture: textures.spriteRed,
    });
    entities.harold = new Entity({
        name: 'harold',
        texture: textures.spriteYellow,
    });

}

async function load_map(map, grid, textures, entities) {
    // do the map!
    const parsedOccupantMap = parseOccupantMap(map.occupants);
    applyOccupantsToGameGrid(grid, parsedOccupantMap, entities);
    const parsedFloorMap = parseFloorMap(map.floor);
    applyFloorToGameGrid(grid, parsedFloorMap);
    const mapCanvas = await getMapBackground(grid, textures);
    game.images.gameMap = mapCanvas;
}

// create the renderer
game.renderer = new Renderer({
    ctx: ctx,
    canvas: canvas,
    grid: game.grid,
    cameraCellsX: CAMERA_CELLS_X,
    cameraCellsY: CAMERA_CELLS_Y,
    textures: game.textures,
    images: game.images,
});


async function dummy_init() {
    // async load image stuff
    await load_image_resources(game.images, game.textures);
    await load_entities(game.entities, game.textures);
    await load_map(map_1, game.grid, game.textures, game.entities);

    const mapOccupantCanvases = [
        await getMapOccupants(game.grid, game.textures, game.images, 0,),
        await getMapOccupants(game.grid, game.textures, game.images, 1,),
        await getMapOccupants(game.grid, game.textures, game.images, 2,),
        await getMapOccupants(game.grid, game.textures, game.images, 3,),
    ];
    game.gameLoop = new GameLoop(update, render);



    // manually set some
    player.texture = game.textures.spriteDefault;
    game.entities.harold.hasAlert = true;



    game.textures.gameOccupants = mapOccupantCanvases;

    // assign pointer and keyboard listeners
    bindControls();
    // watch for resize on the canvas container
    const observer = new ResizeObserver(resize);
    observer.observe(panelCenter);


    game.gameLoop.start();

}

window.onload = () => {
    dummy_init();
}



