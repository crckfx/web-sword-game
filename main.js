import { load_entities, load_map, player, swordGame } from "./helper/world-loader.js";
import { Item } from "./classes/Item.js";
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
    // player.sprite = new Sprite({
    //     resource: swordGame.images.spriteDefault,
    //     position: player.position,
    //     vFrames: 8,
    //     hFrames: 4,
    // })

    player.receiveItem(new Item('Egg', null, null, swordGame.textures.egg, "An egg."));
    player.receiveItem(new Item('Badghetti', null, null, null, "Would have been sadghetti, but cook was too sad to make it."));

    modifyInventoryTexture(swordGame.textures.inventoryItems);
    // swordGame.entities.harold.hasAlert = true;
    // assign pointer and keyboard listeners



    swordGame.controls.bind();
    swordGame.gameLoop.start();

    swordGame.launch_set_of_dialogues(swordGame.setOfDialogues_1);

}

window.onload = () => {
    dummy_init();
}

window.onblur = () => {
    swordGame.pause();
}
