import { parseFloorLayout, parseOccupantLayout, applyFloorToGameGrid, applyOccupantsToGameGrid, getMapBackground, getMapOccupants } from "./map-loader.js";
import { Entity } from "../classes/Entity.js";

import { Game } from "../classes/Game.js";
import { Item } from "../classes/Item.js";
import { wrapText } from "./promptMenu.js";


import { get_standard_entity_animations, STAND_DOWN, STAND_LEFT, STAND_RIGHT, STAND_UP, WALK_DOWN, WALK_LEFT, WALK_RIGHT, WALK_UP } from "./walk.js";
import { Player } from "../classes/Player.js";
import { Vector2 } from "../classes/Vector2.js";
import { gridCells } from "./grid.js";
import { Animations } from "../classes/Animations.js";
import { FrameIndexPattern } from "../classes/FrameIndexPattern.js";
import { give_item_to } from "./interactions.js";
import { modifyInventoryTexture } from "./invMenu.js";
import { SetOfDialogues } from "../experimental/SetOfDialogues.js";
import { Dialogue } from "../experimental/Dialogue.js";
import { DialogueOption } from "../experimental/DialogueOption.js";



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
        interactMessage: "Have you seen my apple?",
        interactCondition: () => player.bag.findSlotByName('apple'),
        interactAction: function () {
            const index = player.bag.findSlotByName('apple');
            console.log(`index is ${index}`)
            const item = player.bag.slots[index];
            // console.log(`give ${item.name} to ${this.name}`);
            if (give_item_to(swordGame.grid, item, this, swordGame.textures.mapOccupants)) modifyInventoryTexture(swordGame.textures.inventoryItems);
            // swordGame.give_item_to(swordGame.grid, item, this); // parent method which handles removal from old entity
            // this.renderer.modifyInventoryTexture(); // 

        },
        message_satisfied: "Thank you I was very hungry",
        dialogues: {
            default: wrapText("Have you seen my apple?"),
            complete: wrapText("Thank you I was very hungry"),
        },
        // animations: new Animations({
        //     walkUp: new FrameIndexPattern(WALK_UP),
        //     walkLeft: new FrameIndexPattern(WALK_LEFT),
        //     walkDown: new FrameIndexPattern(WALK_DOWN),
        //     walkRight: new FrameIndexPattern(WALK_RIGHT),

        //     standUp: new FrameIndexPattern(WALK_UP),
        //     standLeft: new FrameIndexPattern(WALK_LEFT),
        //     standDown: new FrameIndexPattern(WALK_DOWN),
        //     standRight: new FrameIndexPattern(WALK_RIGHT),
        // }),        
    });
    entities.george = new Entity({
        name: 'george',
        isFacing: 'right',
        texture: textures.spriteRed,
        interactMessage: new SetOfDialogues(
            [
                new Dialogue({
                    heading: "george",
                    message: "Not now",
                }),
                new Dialogue({
                    heading: "george",
                    message: "Not now! (2)",
                }),
                new Dialogue({
                    heading: "george",
                    message: "Not now!!!!!! (3)",
                }),
                new Dialogue({
                    heading: "george",
                    message: "NOT NOW. (4)",
                }),
            ]
        )
    });
    entities.harold = new Entity({
        name: 'harold',
        texture: textures.spriteYellow,
        interactMessage: "You there...Ogre!",
    });
}

export async function load_map(map, grid, textures, images, entities) {
    // do the map!
    const parsedOccupantLayout = parseOccupantLayout(map.occupants);
    applyOccupantsToGameGrid(grid, parsedOccupantLayout, entities, textures, images);
    const parsedFloorLayout = parseFloorLayout(map.floor);
    applyFloorToGameGrid(grid, parsedFloorLayout);
    textures.mapFloor = await getMapBackground(grid, textures);
    // textures.mapFloor = mapCanvas;
    textures.mapOccupants = [
        await getMapOccupants(grid, textures, images, 0,),
        await getMapOccupants(grid, textures, images, 1,),
        await getMapOccupants(grid, textures, images, 2,),
        await getMapOccupants(grid, textures, images, 3,),
    ];

}



