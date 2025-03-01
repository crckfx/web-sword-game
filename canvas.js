import { canvas, ctx, panelCenter, resize } from "./document.js";

import { player, game, update, CAMERA_CELLS_Y, CAMERA_CELLS_X, render, NUM_GRID_X, NUM_GRID_Y, } from "./game.js";
import { parseFloorMap, parseOccupantMap, applyFloorToGameGrid, applyOccupantsToGameGrid, getMapBackground, getMapOccupants } from "./helper/map-loader.js";
import { Entity } from "./classes/Entity.js";
import { Renderer } from "./classes/Renderer.js";
import { GameLoop } from "./classes/GameLoop.js";
import { map_1 } from "./maps/map_1.js";
import { load_image_resources } from "./helper/resource-loader.js";
import { Game } from "./experimental/Game.js";

export const game_class = new Game();



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

async function load_map(map, grid, textures, images, entities) {
    // do the map!
    const parsedOccupantMap = parseOccupantMap(map.occupants);
    applyOccupantsToGameGrid(grid, parsedOccupantMap, entities);
    const parsedFloorMap = parseFloorMap(map.floor);
    applyFloorToGameGrid(grid, parsedFloorMap);
    const mapCanvas = await getMapBackground(grid, textures);
    images.gameMap = mapCanvas;
}

// create the renderer
game.renderer = new Renderer({
    canvas: document.getElementById('game_canv'),
    ctx: document.getElementById('game_canv').getContext("2d"),
    grid: game.grid,
    cameraCellsX: CAMERA_CELLS_X,
    cameraCellsY: CAMERA_CELLS_Y,
    textures: game.textures,
    images: game.images,
    game: game,
});
// create the gameLoop
game.gameLoop = new GameLoop(update, render);

// the entry point
async function dummy_init() {


    // async load image stuff
    await load_image_resources(game.images, game.textures);
    await load_entities(game.entities, game.textures);
    await load_map(map_1, game.grid, game.textures, game.images, game.entities);
    const mapOccupantCanvases = [
        await getMapOccupants(game.grid, game.textures, game.images, 0,),
        await getMapOccupants(game.grid, game.textures, game.images, 1,),
        await getMapOccupants(game.grid, game.textures, game.images, 2,),
        await getMapOccupants(game.grid, game.textures, game.images, 3,),
    ];
    player.texture = game.textures.spriteDefault;
    game.entities.harold.hasAlert = true;
    game.textures.gameOccupants = mapOccupantCanvases;

    // async class load
    game_class.init_game(24, 24, game_class.textures, game_class.images);    
    await load_image_resources(game_class.images, game_class.textures);
    await load_entities(game_class.entities, game_class.textures);
    await load_map(map_1, game_class.grid, game_class.textures, game_class.images, game_class.entities);
    const mapOccupantCanvases_2 = [
        await getMapOccupants(game_class.grid, game_class.textures, game_class.images, 0,),
        await getMapOccupants(game_class.grid, game_class.textures, game_class.images, 1,),
        await getMapOccupants(game_class.grid, game_class.textures, game_class.images, 2,),
        await getMapOccupants(game_class.grid, game_class.textures, game_class.images, 3,),
    ];
    game_class.textures.gameOccupants = mapOccupantCanvases_2;
    game_class.init_game(
        NUM_GRID_X, 
        NUM_GRID_Y, 
        game_class.textures, 
        game_class.images
    );


    // assign pointer and keyboard listeners
    game.controls.bind();
    // watch for resize on the canvas container
    const observer = new ResizeObserver(resize);
    observer.observe(panelCenter);


    game.gameLoop.start();

}

window.onload = () => {
    dummy_init();
}



