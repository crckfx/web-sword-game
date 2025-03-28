import { Vector2 } from "../classes/Vector2.js";
import { CELL_PX } from "../document.js";
import { player, swordGame } from "../helper/world-loader.js";
import { SceneOverride } from "./sceneOverride.js";


export const OVERRIDE_BOAT_LEVEL_1_EXIT = new SceneOverride({
    game: swordGame,
    step: function () {
        const newY = swordGame.currentLevel.doodads.boat.position.y += 1;
        if (newY > swordGame.renderer.camera.pos.y + swordGame.renderer.camera.size.y + CELL_PX + 8) {
            console.log("finished yo")
            swordGame.currentSceneOverride = null;
            swordGame.controlsBlocked = false;
            const positionVector = new Vector2(5 * CELL_PX, 16 * CELL_PX);
            swordGame.load_new_level(swordGame.levels[1], {
                player: {
                    isFacing: 'up',
                    position: positionVector.duplicate(),
                },
                boat: {
                    position: positionVector.duplicate(),
                },
                camera: {
                    pos: new Vector2(CELL_PX, 5 * CELL_PX),
                },
                initOverride: OVERRIDE_BOAT_LEVEL_2_ENTRY,

            });
        } else {
            swordGame.currentLevel.doodads.boat.position.y = newY;
            player.position.y = newY;
            player.destination.y = newY;
        }
    },
});

export const OVERRIDE_BOAT_LEVEL_2_ENTRY = new SceneOverride({
    game: swordGame,    
    step: function () {
        const boat = swordGame.levels[1].doodads.boat;
        const newY = boat.position.y -= 1;
        const targetY = 9 * CELL_PX;

        if (newY <= targetY) {
            console.log(swordGame.renderer.camera.pos)
            boat.position.y = targetY;
            player.position.y = targetY;
            player.destination.y = targetY;

            player.isFacing = 'right';
            player.destination.x += CELL_PX
            player.position.x += CELL_PX

            console.log("finished yo")
            swordGame.currentSceneOverride = null;
            swordGame.controlsBlocked = false;
        } else {
            // console.log(swordGame.renderer.camera.pos)
            boat.position.y = newY;
            player.position.y = newY;
            player.destination.y = newY;
        }
    },
});
