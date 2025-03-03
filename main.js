import { load_entities, load_map, swordGame } from "./canvas.js";
import { Item } from "./classes/Item.js";
import { NUM_GRID, player } from "./document.js";
import { load_image_resources } from "./helper/resource-loader.js";
import { map_1 } from "./maps/map_1.js";
import { map_2 } from "./maps/map_2.js";




// the entry point
async function dummy_init() {
    // async class load
    swordGame.init_game(NUM_GRID.x, NUM_GRID.y, swordGame.textures, swordGame.images);    
    await load_image_resources(swordGame.images, swordGame.textures);
    await load_entities(swordGame.entities, swordGame.textures);
    await load_map(map_2, swordGame.grid, swordGame.textures, swordGame.images, swordGame.entities);

    player.texture = swordGame.textures.spriteDefault;
    player.receiveItem(new Item('sneed', null, null, swordGame.textures.egg));
    // .modifyInventoryTexture();

    swordGame.renderer.inventoryCtx = swordGame.textures.inventoryItems.getContext('2d');
    swordGame.renderer.modifyInventoryTexture();
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
