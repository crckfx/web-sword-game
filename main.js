import { load_entities, load_map, player, swordGame } from "./helper/world-loader.js";
import { Item } from "./classes/objects/Item.js";
import { NUM_GRID } from "./document.js";
import { load_image_resources } from "./helper/resource-loader.js";
import { map_1 } from "./maps/map_1.js";
import { map_2 } from "./maps/map_2.js";
import { modifyInventoryTexture } from "./helper/invMenu.js";
import { GameObject } from "./classes/GameObject.js";
import { Vector2 } from "./classes/Vector2.js";
import { Sprite } from "./classes/Sprite.js";


// the entry point
async function dummy_init() {
    // async class load
    // swordGame.init_game(NUM_GRID.x, NUM_GRID.y);    
    await load_image_resources(swordGame.images, swordGame.textures);
    await load_entities(swordGame.entities, swordGame.textures);
    await load_map(map_2, swordGame.grid, swordGame.textures, swordGame.images, swordGame.entities);

    player.texture = swordGame.textures.spriteDefault;


    player.receiveItem(new Item('Egg', null, null, swordGame.textures.egg, "An egg."));
    player.receiveItem(new Item('Badghetti', null, swordGame.images.ghetti_16, swordGame.images.ghetti_32, "Would have been sadghetti, but cook was too sad to make it."));

    modifyInventoryTexture(swordGame.textures.inventoryItems);
    // swordGame.entities.harold.hasAlert = true;
    // assign pointer and keyboard listeners

    console.log(`let's create a new texture`);

    swordGame.controls.bind();
    swordGame.gameLoop.start();

    // swordGame.launch_set_of_dialogues(swordGame.setOfDialogues_1); // proving an init dialogue on game load

}

window.onload = () => {
    dummy_init();
}

window.onblur = () => {
    swordGame.pause();
}


// North edge = 1
// NorthEast corner = 2
// East edge = 4
// SouthEast corner = 8
// South edge = 16
// Sout-West corner = 32
// West edge = 64
// NorthWest corner = 128 

const map6x8 = [
    20, 68, 92, 112, 28, 124, 116, 80,
    21, 84, 87, 221, 127, 255, 241, 17,
    29, 117, 85, 95, 247, 215, 209, 1,
    23, 213, 81, 31, 253, 125, 113, 16,
    5, 69, 93, 119, 223, 255, 245, 65,
    0, 4, 71, 193, 7, 199, 197, 64
];