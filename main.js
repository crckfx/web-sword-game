import { load_entities, player, swordGame } from "./helper/world-loader.js";
import { Item } from "./classes/objects/Item.js";
import { CELL_PX, NUM_GRID } from "./document.js";
import { load_image_resources } from "./helper/resource-loader.js";

import { modifyInventoryTexture } from "./helper/invMenu.js";
import { GameObject } from "./classes/GameObject.js";
import { Vector2 } from "./classes/Vector2.js";
import { map_5 } from "./maps/map_5.js";
import { Entity } from "./classes/objects/Entity.js";
import { GameLevel } from "./levels/GameLevel.js";
import { map_expedition } from "./maps/map_expedition.js";
import { Trigger } from "./classes/objects/Trigger.js";
import { get_dialogue_choice } from "./helper/gameHelpers.js";
import { SetOfDialogues } from "./classes/interactions/SetOfDialogues.js";
import { map_island } from "./maps/map_island.js";
import { Dialogue } from "./classes/interactions/Dialogue.js";
import { Doodad } from "./classes/objects/Doodad.js";
import { get_game_cutScenes } from "./experimental/cutSceneHelper.js";
import { load_levels } from "./levels/level-helper.js";


// the entry point
async function dummy_init() {
    const startTime = performance.now();

    // async class load
    // swordGame.init_game(NUM_GRID.x, NUM_GRID.y);    
    await load_image_resources(swordGame.images, swordGame.textures);
    await load_entities(swordGame.entities, swordGame.textures);

    swordGame.levels = load_levels();

    swordGame.cutScenes = get_game_cutScenes();

    // bind the renderer to use the 'drawKit' generated from map_5
    swordGame.bindLevel(swordGame.levels[0]);
    // swordGame.bindLevel(testLevel);
    // swordGame.bindLevel(destinationLevel);

    player.texture = swordGame.textures.spriteDefault;
    player.receiveItem(new Item({ name: 'Egg', invTexture: swordGame.images.egg, description: "An egg." }));
    player.receiveItem(new Item({ name: 'Badghetti', texture: swordGame.images.ghetti_16, invTexture: swordGame.images.ghetti_32, description: "Would have been sadghetti, but cook was too sad to make it." }));
    player.receiveItem(new Item({ name: 'ticket', invTexture: swordGame.images.ticket, description: "Ticket to some boat ride." }));

    modifyInventoryTexture(swordGame.textures.inventoryItems);


    // (for debugging) map change buttons on the pauseMenu
    swordGame.controls.HtmlControls.pauseMenu.load_main_map_btn.onclick = () => {
        swordGame.pause();
        swordGame.cacheLevel();
        swordGame.bindLevel(testLevel);
        swordGame.resume();
    }
    swordGame.controls.HtmlControls.pauseMenu.load_expedition_map_btn.onclick = () => {
        swordGame.pause();
        swordGame.cacheLevel();
        swordGame.bindLevel(destinationLevel);
        swordGame.resume();
    };


    swordGame.controls.bind();
    const loadTime = performance.now() - startTime;
    console.log(`starting loop. load time was ${loadTime}`)
    swordGame.gameLoop.start();

}

window.onload = () => {
    dummy_init();
}

window.onblur = () => {
    swordGame.pause();
}

