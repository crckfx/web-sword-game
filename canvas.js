import { canvas, ctx, panelCenter, player, NUM_GRID } from "./document.js";

import { parseFloorLayout, parseOccupantLayout, applyFloorToGameGrid, applyOccupantsToGameGrid, getMapBackground, getMapOccupants } from "./helper/map-loader.js";
import { Entity } from "./classes/Entity.js";
import { Renderer } from "./classes/Renderer.js";
import { GameLoop } from "./classes/GameLoop.js";
import { map_1 } from "./maps/map_1.js";
import { map_2 } from "./maps/map_2.js";
import { load_image_resources } from "./helper/resource-loader.js";
import { Game } from "./classes/Game.js";

export const swordGame = new Game();



async function load_entities(entities, textures) {
    // after we have the textures prepared, we can init the entities without fuss
    entities.gary = new Entity({
        name: 'gary',
        // isFacing: 'down',
        texture: textures.spriteRed,
        interactMessage: "hello my name a gary",
    });
    entities.fred = new Entity({
        name: 'fred',
        isFacing: 'up',
        texture: textures.spriteYellow,
        interactMessage: "Have you seen my apple?",
        interactCondition: () => player.findInInventory('apple'),
        interactAction: function () {
            const index = player.findInInventory('apple');
            const item = player.inventory[index];
            console.log(`give ${item.name} to ${this.name}`)
            swordGame.give_item_to(item, this);
        },
        message_satisfied: "Thank you I was very hungry",
    });
    entities.george = new Entity({
        name: 'george',
        isFacing: 'right',
        texture: textures.spriteRed,
        interactMessage: "Not now",
    });
    entities.harold = new Entity({
        name: 'harold',
        texture: textures.spriteYellow,
        interactMessage: "You there...Ogre!",
    });
}

async function load_map(map, grid, textures, images, entities) {
    // do the map!
    const parsedOccupantLayout = parseOccupantLayout(map.occupants);
    applyOccupantsToGameGrid(grid, parsedOccupantLayout, entities, textures);
    const parsedFloorLayout = parseFloorLayout(map.floor);
    applyFloorToGameGrid(grid, parsedFloorLayout);
    const mapCanvas = await getMapBackground(grid, textures);
    textures.gameMap = mapCanvas;
}

// the entry point
async function dummy_init() {
    // async class load
    swordGame.init_game(NUM_GRID.x, NUM_GRID.y, swordGame.textures, swordGame.images);    
    await load_image_resources(swordGame.images, swordGame.textures);
    await load_entities(swordGame.entities, swordGame.textures);
    await load_map(map_2, swordGame.grid, swordGame.textures, swordGame.images, swordGame.entities);
    const mapOccupantCanvases = [
        await getMapOccupants(swordGame.grid, swordGame.textures, swordGame.images, 0,),
        await getMapOccupants(swordGame.grid, swordGame.textures, swordGame.images, 1,),
        await getMapOccupants(swordGame.grid, swordGame.textures, swordGame.images, 2,),
        await getMapOccupants(swordGame.grid, swordGame.textures, swordGame.images, 3,),
    ];
    player.texture = swordGame.textures.spriteDefault;
    // swordGame.entities.harold.hasAlert = true;
    swordGame.textures.gameOccupants = mapOccupantCanvases;
    // assign pointer and keyboard listeners
    swordGame.controls.bind();
    swordGame.gameLoop.start();

}

window.onload = () => {
    dummy_init();
}

window.onblur = () => {
    swordGame.pause();
}

