import { load_entities, player, swordGame } from "./loader/world-loader.js";
import { Item } from "./classes/objects/Item.js";
import { load_image_resources } from "./loader/resource-loader.js";
import { modifyInventoryTexture } from "./helper/invMenu.js";
import { get_game_cutScenes } from "./loader/cutScene-loader.js";
import { load_levels } from "./levels/level-helper.js";

// the entry point
async function start_game() {
    const startTime = performance.now(); // debug - for logging time at end
    // async resource load
    await load_image_resources(swordGame.images, swordGame.textures);
    load_entities(swordGame.entities, swordGame.textures);
    swordGame.levels = load_levels();
    swordGame.cutScenes = get_game_cutScenes();
    // do player post-texture-load changes
    player.texture = swordGame.textures.spriteDefault;
    player.receiveItem(new Item({ name: 'Egg', invTexture: swordGame.images.egg, description: "An egg." }));
    player.receiveItem(new Item({ name: 'Badghetti', texture: swordGame.images.ghetti_16, invTexture: swordGame.images.ghetti_32, description: "Would have been sadghetti, but cook was too sad to make it." }));
    // player.receiveItem(new Item({ name: 'ticket', invTexture: swordGame.images.ticket, description: "Ticket to some boat ride." }));
    modifyInventoryTexture(swordGame.textures.inventoryItems);

    // (for debugging) map change buttons on the pauseMenu
    swordGame.controls.HtmlControls.pauseMenu.load_main_map_btn.onclick = () =>
        swordGame.load_new_level(swordGame.levels[0]);
    swordGame.controls.HtmlControls.pauseMenu.load_expedition_map_btn.onclick = () =>
        swordGame.load_new_level(swordGame.levels[1]);

    swordGame.controls.bind();

    swordGame.bindLevel(swordGame.levels[0]);
    const loadTime = performance.now() - startTime;
    console.log(`starting loop. load time was ${loadTime}`)
    swordGame.gameLoop.start();

}

window.onload = () => {
    start_game();
}

window.onblur = () => {
    swordGame.pause();
}

