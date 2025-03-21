import { hackyTextureChooser, load_entities, load_map, player, swordGame } from "./helper/world-loader.js";
import { Item } from "./classes/objects/Item.js";
import { CELL_PX, NUM_GRID } from "./document.js";
import { load_image_resources } from "./helper/resource-loader.js";
import { map_1 } from "./maps/map_1.js";
import { map_2 } from "./maps/map_2.js";
import { modifyInventoryTexture } from "./helper/invMenu.js";
import { GameObject } from "./classes/GameObject.js";
import { Vector2 } from "./classes/Vector2.js";
import { Sprite } from "./classes/Sprite.js";
import { GameLevel } from "./experimental/GameLevel.js";
import { map_5 } from "./maps/map_5.js";
import { Entity } from "./classes/objects/Entity.js";


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

    swordGame.test_level = new GameLevel({
        gridX: 29,
        gridY: 28,
    });


    // this is where we start messing with LEVEL loading
    const testLevel = swordGame.test_level;
    await testLevel.load_map_floors(map_5);
    await testLevel.load_map_occupants(map_5, swordGame.textures, swordGame.images, swordGame.entities);



    // swordGame.textures.mapFloor.ctx.clearRect(0,0, swordGame.textures.mapFloor.canvas.width,swordGame.textures.mapFloor.canvas.height)

    // for (let i = 0; i < testLevel.mapLayers.length; i++) {
    //     const layer = testLevel.mapLayers[i];
    //     // swordGame.textures.mapFloor.ctx.drawImage(
    //     //     layer.texture.mapFloor.canvas, 
    //     //     0,0
    //     // )
    //     swordGame.renderer.ctx.drawImage(
    //         layer.texture.mapFloor.canvas,
    //         0, 0
    //     )
    //     // swordGame.renderer.ctx.drawImage(
    //     //     layer.texture.mapFloor.canvas, 
    //     //     12 * CELL_PX, 0 * CELL_PX,
    //     //     layer.texture.mapFloor.canvas.width, layer.texture.mapFloor.canvas.height,
    //     //     0, layer.z * -8,
    //     //     layer.texture.mapFloor.canvas.width, layer.texture.mapFloor.canvas.height
    //     // )
    // }

    // for (const key in swordGame.entities) {
    //     const entity = swordGame.entities[key]
    //     const camX = 6 * CELL_PX;
    //     const camY = 4 * CELL_PX;
    //     // draw an entity specifically
    //     swordGame.renderer.ctx.drawImage(
    //             entity.getEntitySprite(),
    //             // entity.texture[entity.frame],
    //             // this.textures.sword,
    //             entity.position.x - camX,
    //             entity.position.y - 8 - camY,
    //             CELL_PX,
    //             CELL_PX
    //         );
        
    // }

    // console.log(testLevel);

    swordGame.controls.bind();
    swordGame.gameLoop.start();

}

window.onload = () => {
    dummy_init();
}

window.onblur = () => {
    swordGame.pause();
}

