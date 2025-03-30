import { Dialogue } from "../classes/dialogue/Dialogue.js";
import { SetOfDialogues } from "../classes/dialogue/SetOfDialogues.js";
import { Doodad } from "../classes/objects/Doodad.js";
import { Trigger } from "../classes/objects/Trigger.js";
import { Vector2 } from "../classes/Vector2.js";
import { NUM_GRID } from "../document.js";
import { get_dialogue_choice } from "../helper/gameHelpers.js";
import { player, swordGame } from "../loader/world-loader.js";
import { map_5 } from "../maps/map_5.js";
import { map_expedition } from "../maps/map_expedition.js";
import { map_indoors } from "../maps/map_indoors.js";
import { map_island } from "../maps/map_island.js";
import { GameLevel } from "./GameLevel.js";

export function load_levels() {
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
                                        setTimeout(function () {
                                            swordGame.currentCutScene = swordGame.cutScenes.level_1_exit.load();
                                            setTimeout(function () {
                                                swordGame.currentCutScene = swordGame.cutScenes.level_1_exit.launch();
                                            }, 300)
                                        }, 300)
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

        triggers: {
            houseDoor: new Trigger({
                name: 'doorTrigger',
                message: 'to go into da house',
                position: new Vector2(0,0),
                action_RUN: function () {
                    player.destination.overwrite(player.position.x, player.position.y);
                    swordGame.controlsBlocked = true;
                    player.animations.play('standUp')
                    setTimeout(() => {
                        swordGame.currentCutScene = swordGame.cutScenes.L2_door_transition.launch();
                    }, 200);
                },
                walkable: true,
            })
        },


        doodads: {
            house: new Doodad({
                name: 'house',
                position: null,
                texture: swordGame.images.house
            }),

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
                                            swordGame.exitDialogue();
                                            swordGame.controlsBlocked = true;
                                            setTimeout(function () {
                                                swordGame.cutScenes.level_2_exit.load();
                                                setTimeout(function () {
                                                    swordGame.currentCutScene = swordGame.cutScenes.level_2_exit.launch();
                                                }, 300)
                                            }, 300)
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

    const indoorsLevel = new GameLevel({
        gridX: 9,
        gridY: 7,
        map: map_indoors,
        images: swordGame.images,
        entities: swordGame.entities,

        triggers: {
            door: new Trigger({
                name: 'door',
                message: 'to go back outta da house',
                position: new Vector2(null, null),
                action_RUN: function () {
                    swordGame.controlsBlocked = true;
                    player.animations.play('standDown')
                    setTimeout(() => {
                        swordGame.currentCutScene = swordGame.cutScenes.L2_transition_into_house.launch();
                    }, 200);                    
                },
                walkable: true,
            })
        },

    })

    return [
        testLevel,
        destinationLevel,
        islandLevel,
        indoorsLevel,
    ];

}