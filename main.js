import { load_entities, load_map, player, swordGame } from "./helper/world-loader.js";
import { Item } from "./classes/Item.js";
import { NUM_GRID } from "./document.js";
import { load_image_resources } from "./helper/resource-loader.js";
import { map_1 } from "./maps/map_1.js";
import { map_2 } from "./maps/map_2.js";
import { modifyInventoryTexture } from "./helper/invMenu.js";




// the entry point
async function dummy_init() {
    // async class load
    // swordGame.init_game(NUM_GRID.x, NUM_GRID.y);    
    await load_image_resources(swordGame.images, swordGame.textures);
    await load_entities(swordGame.entities, swordGame.textures);
    await load_map(map_2, swordGame.grid, swordGame.textures, swordGame.images, swordGame.entities);

    player.texture = swordGame.textures.spriteDefault;
    player.receiveItem(new Item('Egg', null, null, swordGame.textures.egg, "An egg."));

    modifyInventoryTexture(swordGame.textures.inventoryItems);
    // swordGame.entities.harold.hasAlert = true;
    // assign pointer and keyboard listeners
    swordGame.controls.bind();
    swordGame.gameLoop.start();

}

window.onload = () => {
    dummy_init();
}

window.onblur = () => {
    swordGame.pause();
}
