import { canvas, ctx, panelCenter, resize } from "./document.js";

import { player, CAMERA_CELLS_Y, CAMERA_CELLS_X, NUM_GRID_X, NUM_GRID_Y, } from "./game.js";
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

// the entry point
async function dummy_init() {

    
    // async class load
    game_class.init_game(NUM_GRID_X, NUM_GRID_Y, game_class.textures, game_class.images);    
    await load_image_resources(game_class.images, game_class.textures);
    await load_entities(game_class.entities, game_class.textures);
    await load_map(map_1, game_class.grid, game_class.textures, game_class.images, game_class.entities);
    const mapOccupantCanvases_2 = [
        await getMapOccupants(game_class.grid, game_class.textures, game_class.images, 0,),
        await getMapOccupants(game_class.grid, game_class.textures, game_class.images, 1,),
        await getMapOccupants(game_class.grid, game_class.textures, game_class.images, 2,),
        await getMapOccupants(game_class.grid, game_class.textures, game_class.images, 3,),
    ];
    player.texture = game_class.textures.spriteDefault;
    // game_class.entities.harold.hasAlert = true;
    game_class.textures.gameOccupants = mapOccupantCanvases_2;


    // assign pointer and keyboard listeners
    game_class.controls.bind();
    // watch for resize on the canvas container
    const observer = new ResizeObserver(resize);
    observer.observe(panelCenter);


    game_class.gameLoop.start();

}

window.onload = () => {
    dummy_init();
}



