import { hackyTextureChooser, load_entities, player, swordGame } from "./helper/world-loader.js";
import { Item } from "./classes/objects/Item.js";
import { CELL_PX, NUM_GRID } from "./document.js";
import { load_image_resources } from "./helper/resource-loader.js";

import { modifyInventoryTexture } from "./helper/invMenu.js";
import { GameObject } from "./classes/GameObject.js";
import { Vector2 } from "./classes/Vector2.js";
import { Sprite } from "./classes/Sprite.js";
import { map_5 } from "./maps/map_5.js";
import { Entity } from "./classes/objects/Entity.js";
import { load_map_floors, load_map_occupants } from "./levels/map-loader.js";
import { GameLevel } from "./levels/GameLevel.js";
import { map_expedition } from "./maps/map_expedition.js";


// the entry point
async function dummy_init() {
    // async class load
    // swordGame.init_game(NUM_GRID.x, NUM_GRID.y);    
    await load_image_resources(swordGame.images, swordGame.textures);
    await load_entities(swordGame.entities, swordGame.textures);

    // this is where we start messing with LEVEL loading
    const testLevel = new GameLevel({
        gridX: NUM_GRID.x,
        gridY: NUM_GRID.y,
    });
    testLevel.drawKit = await load_map_floors(testLevel, map_5);
    await load_map_occupants(testLevel, map_5, swordGame.textures, swordGame.images, swordGame.entities);
    

    // this is where we start messing with LEVEL loading
    const destinationLevel = new GameLevel({
        gridX: 16,
        gridY: 12,
    });
    destinationLevel.drawKit = await load_map_floors(destinationLevel, map_expedition);
    await load_map_occupants(destinationLevel, map_expedition, swordGame.textures, swordGame.images, swordGame.entities);
    
    // bind the renderer to use the 'drawKit' generated from map_5
    swordGame.bindLevel(testLevel);
    // swordGame.bindLevel(destinationLevel);

    player.texture = swordGame.textures.spriteDefault;
    player.receiveItem(new Item('Egg', null, null, swordGame.textures.egg, "An egg."));
    player.receiveItem(new Item('Badghetti', null, swordGame.images.ghetti_16, swordGame.images.ghetti_32, "Would have been sadghetti, but cook was too sad to make it."));

    modifyInventoryTexture(swordGame.textures.inventoryItems);
    // swordGame.entities.harold.hasAlert = true;


    swordGame.controls.HtmlControls.pauseMenu.load_main_map_btn.onclick = () => swordGame.pause();
    swordGame.controls.HtmlControls.pauseMenu.load_expedition_map_btn.onclick = () => {
        swordGame.pause();
        
        swordGame.bindLevel(destinationLevel);

        swordGame.resume();
    };


    swordGame.controls.bind();
    swordGame.gameLoop.start();

}

window.onload = () => {
    dummy_init();
}

window.onblur = () => {
    swordGame.pause();
}

