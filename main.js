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
import { OVERRIDE_BOAT_LEVEL_1_EXIT, OVERRIDE_BOAT_LEVEL_2_EXIT } from "./experimental/overrides.js";






// the entry point
async function dummy_init() {
    const startTime = performance.now();

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

        doodads: {
            boat: new Doodad({
                name: 'boat',
                position: null,
                texture: swordGame.images.boat_down,
                trigger: new Trigger({
                    name: 'travel trigger 1 --> 2',
                    // texture: swordGame.images.boat,
                    condition: function () {
                        const index = player.bag.findSlotByName('ticket');
                        return index > -1
                    },

                    action_RUN: function () {
                        swordGame.launch_set_of_dialogues(new SetOfDialogues({
                            // heading: 'boat?? maybe?',
                            dialogues: [
                                get_dialogue_choice(
                                    "Travel to level 2?",
                                    // () => swordGame.load_new_level(swordGame.levels[1]),
                                    () => {
                                        swordGame.exitDialogue();
                                        swordGame.controlsBlocked = true;
                                        swordGame.currentSceneOverride = OVERRIDE_BOAT_LEVEL_1_EXIT.launch();
                                    },
                                    () => swordGame.exitDialogue(),
                                    'boat?? maybe?'
                                ),
                            ]
                        }))
                    },

                    action_REJECT: function () {
                        swordGame.launch_single_dialogue(
                            new Dialogue({
                                heading: 'no boat for you',
                                message: 'You need a ticket to board the boat.',
                                // canExit: true
                            })
                        )
                    },
                }),
            })

        },

    });

    const destinationLevel = new GameLevel({
        gridX: 19,
        gridY: 15,
        map: map_expedition,
        images: swordGame.images,
        entities: swordGame.entities,


        doodads: {
            boat: new Doodad({
                name: 'boat',
                position: null,
                texture: swordGame.images.boat_up,
                trigger: new Trigger({
                    name: 'return home trigger',
                    // texture: swordGame.images.boat_up,
                    message: 'to return back to the first map',
                    action_RUN: function () {
                        swordGame.launch_set_of_dialogues(
                            new SetOfDialogues({
                                dialogues: [
                                    get_dialogue_choice(
                                        "Return to level 1?",
                                        () => {
                                            // swordGame.load_new_level(swordGame.levels[0]);
                                            swordGame.exitDialogue();
                                            swordGame.controlsBlocked = true;
                                            swordGame.currentSceneOverride = OVERRIDE_BOAT_LEVEL_2_EXIT.launch();                                            
                                        },
                                        () => swordGame.exitDialogue(),
                                        'boat'
                                    ),
                                ]
                            }),

                        )
                    },
                }),
            })
        },
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
    swordGame.bindLevel(testLevel);
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

