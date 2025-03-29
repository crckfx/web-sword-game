import { Entity } from "../classes/objects/Entity.js";

import { Game } from "../classes/Game.js";
import { Item } from "../classes/objects/Item.js";
import { wrapText } from "./promptMenu.js";


import { get_standard_entity_animations } from "./walk.js";
import { Player } from "../classes/objects/Player.js";
import { Vector2 } from "../classes/Vector2.js";
import { gridCells } from "./grid.js";

import { SetOfDialogues } from "../classes/interactions/SetOfDialogues.js";
import { Dialogue } from "../classes/interactions/Dialogue.js";
import { DialogueOption } from "../classes/interactions/DialogueOption.js";
import { appleMission } from "../experimental/missions.js";
import { NUM_GRID } from "../document.js";


export const player = new Player({
    name: 'lachie',
    position: new Vector2(gridCells(1), gridCells(1)),
    isFacing: 'Up',
    animations: get_standard_entity_animations(),
    speed: 2,

});


export const swordGame = new Game();


export async function load_entities(entities, textures) {
    // after we have the textures prepared, we can init the entities without fuss
    entities.gary = new Entity({
        name: 'gary',
        texture: textures.spriteRed,
        interactMessage: "hello my name a gary",
    });

    entities.fred = new Entity({
        name: 'fred',
        texture: textures.spriteYellow,
        interactMessage: new SetOfDialogues({
            dialogues: [
                "Have you seen my apple?",
                "I think I left it somewhere around here."
            ],
            heading: 'fred'
        }),
        interactCondition: () => player.bag.findSlotByName('apple'),
        interactAction: () => appleMission(swordGame, entities.fred),
        message_satisfied: "Thank you I was very hungry",
    });


    entities.george = new Entity({
        name: 'george',
        isFacing: 'Right',
        texture: textures.spriteRed,
        interactMessage: new SetOfDialogues({
            dialogues:
                [
                    "Not now",
                    "Not now! (2)",
                    "Not now!!!!!! (3)",
                    "NOT NOW. (4)"
                ],
            heading: 'george',
            canExit: true
        })
    });
    entities.harold = new Entity({
        name: 'harold',
        texture: textures.spriteYellow,
        interactMessage: new SetOfDialogues({
            dialogues: [
                "You there...Ogre!",
                "Somebody once told me the world was gonna roll me."
            ],
            heading: 'harold',
            canExit: true,
        })
    });

}
