import { parseFloorLayout, parseOccupantLayout, applyFloorToGameGrid, applyOccupantsToGameGrid, getMapTextures, parsePathLayout } from "./map-loader.js";
import { Entity } from "../classes/objects/Entity.js";

import { Game } from "../classes/Game.js";
import { Item } from "../classes/objects/Item.js";
import { wrapText } from "./promptMenu.js";


import { get_standard_entity_animations } from "./walk.js";
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
import { appleMission } from "../experimental/missions.js";
import { GameLevel } from "../experimental/GameLevel.js";
import { NUM_GRID } from "../document.js";



export const player = new Player({
    name: 'lachie',
    position: new Vector2(gridCells(1), gridCells(1)),
    isFacing: 'up',
    animations: get_standard_entity_animations(),
    speed: 2,

});


export const swordGame = new Game({
    levels: [
        new GameLevel({
            gridX: NUM_GRID.x,
            gridY: NUM_GRID.y,
        })
    ]

});


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
        interactAction: () => appleMission(swordGame, entities.fred),
        message_satisfied: "Thank you I was very hungry",
    });


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


export function hackyTextureChooser(index) {
    // let texture = null;
    if (index > 6) return swordGame.images.dirtGrass;
    if (index === 6) return swordGame.images.dirtGrass;
    if (index === 5) return swordGame.images.stoneDirt;
    if (index === 4) return swordGame.images.dirtGrass;
    if (index === 3) return swordGame.images.sandGrass;
    if (index === 2) return swordGame.images.grassDirt;
    if (index === 1) return swordGame.textures.grass2;
    if (index === 0) return swordGame.textures.water[0];
}