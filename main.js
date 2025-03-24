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
        map: map_5,
        images: swordGame.images,
        entities: swordGame.entities,
        triggers: [
            new Trigger({
                name: 'travel trigger',
                setOfDialogues: new SetOfDialogues({
                    // heading: 'boat?? maybe?',
                    dialogues: [
                        get_dialogue_choice(
                            "Travel to level 2?",
                            () => swordGame.load_new_level(swordGame.levels[1]),
                            () => swordGame.exitDialogue(),
                            'boat?? maybe?'
                        ),
                    ]
                }),

            }),
        ],
    });

    const destinationLevel = new GameLevel({
        gridX: 16,
        gridY: 12,
        map: map_expedition,
        images: swordGame.images,
        entities: swordGame.entities,
        triggers: [
            new Trigger({
                name: 'return home trigger',
                message: 'to return back to the first map',
                setOfDialogues: new SetOfDialogues({
                    dialogues: [
                        get_dialogue_choice(
                            "Return to level 1?",
                            () => swordGame.load_new_level(swordGame.levels[0]),
                            () => swordGame.exitDialogue(),
                            'boat'
                        ),
                    ]
                })
            }),
        ],
    });

    const islandLevel = new GameLevel({
        gridX: 16,
        gridY: 12,
        map: map_island,
        images: swordGame.images,
        entities: swordGame.entities,
    });

    swordGame.levels = [
        testLevel,
        destinationLevel,
        islandLevel
    ]

    // bind the renderer to use the 'drawKit' generated from map_5
    swordGame.bindLevel(islandLevel);
    // swordGame.bindLevel(destinationLevel);

    player.texture = swordGame.textures.spriteDefault;
    player.receiveItem(new Item('Egg', null, null, swordGame.images.egg, "An egg."));
    player.receiveItem(new Item('Badghetti', null, swordGame.images.ghetti_16, swordGame.images.ghetti_32, "Would have been sadghetti, but cook was too sad to make it."));

    modifyInventoryTexture(swordGame.textures.inventoryItems);
    // swordGame.entities.harold.hasAlert = true;


    // temporary (untriggered) map change controllers
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
    swordGame.gameLoop.start();

}

window.onload = () => {
    dummy_init();
}

window.onblur = () => {
    swordGame.pause();
}

