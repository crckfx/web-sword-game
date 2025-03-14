import { parseFloorLayout, parseOccupantLayout, applyFloorToGameGrid, applyOccupantsToGameGrid, getMapBackground, getMapOccupants, parsePathLayout } from "./map-loader.js";
import { Entity } from "../classes/objects/Entity.js";

import { Game } from "../classes/Game.js";
import { Item } from "../classes/objects/Item.js";
import { wrapText } from "./promptMenu.js";


import { get_standard_entity_animations, STAND_DOWN, STAND_LEFT, STAND_RIGHT, STAND_UP, WALK_DOWN, WALK_LEFT, WALK_RIGHT, WALK_UP } from "./walk.js";
import { Player } from "../classes/objects/Player.js";
import { Vector2 } from "../classes/Vector2.js";
import { gridCells } from "./grid.js";
import { Animations } from "../classes/Animations.js";
import { FrameIndexPattern } from "../classes/FrameIndexPattern.js";
import { give_item_to } from "./interactions.js";
import { modifyInventoryTexture } from "./invMenu.js";
import { SetOfDialogues } from "../classes/interactions/SetOfDialogues.js";
import { Dialogue } from "../classes/interactions/Dialogue.js";
import { DialogueOption } from "../classes/interactions/DialogueOption.js";



export const player = new Player({
    name: 'lachie',
    position: new Vector2(gridCells(1), gridCells(1)),
    isFacing: 'up',
    animations: get_standard_entity_animations(),
    speed: 2,

});


export const swordGame = new Game();


export async function load_entities(entities, textures) {
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
        interactMessage: new SetOfDialogues(
            [
                "Have you seen my apple?",
                "I think I left it somewhere around here."
            ],
            'fred'
        ),

        interactCondition: () => player.bag.findSlotByName('apple'),
        // interactAction: function () {
        //     const index = player.bag.findSlotByName('apple');
        //     console.log(`index is ${index}`)
        //     const item = player.bag.slots[index];
        //     if (give_item_to(swordGame, item, this)) modifyInventoryTexture(swordGame.textures.inventoryItems);
        // },

        interactAction: function () {
            const self = this;
            // swordGame.launch_a_dialogue(swordGame.get_dialogue_choice(
            //     "Give Fred an apple?",
            //     function () {
            //         const index = player.bag.findSlotByName('apple');
            //         console.log(`index is ${index}`)
            //         const item = player.bag.slots[index];
            //         if (give_item_to(swordGame, item, self)) {
            //             modifyInventoryTexture(swordGame.textures.inventoryItems);
            //             self.isSatisfied = true;
            //             swordGame.exitDialogue();

            //             swordGame.worldInteract_Entity(self);
            //         }

            //     },
            //     function () {
            //         swordGame.exitDialogue();
            //     }
            // ), null);


            swordGame.launch_set_of_dialogues(
                new SetOfDialogues(
                    // include the interact ones
                    [   
                        ...self.interactMessage.dialogues,

                        swordGame.get_dialogue_choice(
                            // the body message
                            "Give Fred an apple?",
                            // the yes function
                            function () {
                                const index = player.bag.findSlotByName('apple');
                                console.log(`index is ${index}`)
                                const item = player.bag.slots[index];
                                if (give_item_to(swordGame, item, self)) {
                                    modifyInventoryTexture(swordGame.textures.inventoryItems);
                                    self.isSatisfied = true;
                                    swordGame.exitDialogue();
                                    // swordGame.worldInteract_Entity(self);
                                    swordGame.launch_set_of_dialogues(
                                        new SetOfDialogues(
                                            [
                                                new Dialogue({
                                                    heading: "Inventory",
                                                    message: "gave fred an apple.",
                                                }),

                                                new Dialogue({
                                                    heading: "Fred",
                                                    message: self.message_satisfied,
                                                }),
                                            ],
                                        ))
                                } else {
                                    console.log("could not give to the fred?");
                                }

                            },
                            // the no function
                            function () {
                                swordGame.exitDialogue();
                                swordGame.launch_a_dialogue(new Dialogue({
                                    heading: 'Fred',
                                    message: "Come on man, let me hold something!"
                                }))
                            }
                        ),
                    ],
                    'FRED CHECK',
                    false
                ),
                null
            );
        },

        message_satisfied: "Thank you I was very hungry",
    });

    console.log(entities.fred)

    entities.george = new Entity({
        name: 'george',
        isFacing: 'right',
        texture: textures.spriteRed,
        interactMessage: new SetOfDialogues(
            [
                "Not now",
                "Not now! (2)",
                "Not now!!!!!! (3)",
                "NOT NOW. (4)"
            ],
            'george',
            true
        )
    });
    entities.harold = new Entity({
        name: 'harold',
        texture: textures.spriteYellow,
        interactMessage: new SetOfDialogues(
            [
                "You there...Ogre!",
                "Somebody once told me the world was gonna roll me."
            ],
            'harold',
            true
        )
    });
}

export async function load_map(map, grid, textures, images, entities) {
    // do the map!
    // turn text map into a bunch of coord objects
    const parsedOccupantLayout = parseOccupantLayout(map.occupants);
    applyOccupantsToGameGrid(grid, parsedOccupantLayout, entities, textures, images);

    const parsedPathLayout = parsePathLayout(map.paths);

    const parsedFloorLayout = parseFloorLayout(map.floor);
    applyFloorToGameGrid(grid, parsedFloorLayout);

    textures.mapFloor = await getMapBackground(grid, textures, parsedPathLayout);
    textures.mapOverlays = await getMapOccupants(grid, textures, images, textures.mapFloor);

}



