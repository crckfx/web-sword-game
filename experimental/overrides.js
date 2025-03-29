import { Vector2 } from "../classes/Vector2.js";
import { CELL_PX } from "../document.js";
import { direction_to_2D } from "../helper/directions.js";
import { cellCoords, gridCells, moveTowards } from "../helper/grid.js";
import { player, swordGame } from "../helper/world-loader.js";
import { SceneOverride } from "./SceneOverride.js";

export function get_game_cutScenes() {

    const level_1_entrance = create_entry_boat_cutscene(
        swordGame.levels[0],
        swordGame.images.boat_up,
        new Vector2(gridCells(12), gridCells(33)),
        new Vector2(gridCells(12), gridCells(30)),
        'Up',
        'Up',
    );

    const level_2_entrance = create_entry_boat_cutscene(
        swordGame.levels[1],
        swordGame.images.boat_up,
        new Vector2(gridCells(5), gridCells(15)),
        new Vector2(gridCells(5), gridCells(9)),
        'Right',
        'Up',
    );

    return {
        level_1_entrance: level_1_entrance,

        level_2_entrance: level_2_entrance,



        level_1_exit: create_exit_boat_cutscene(
            swordGame.levels[0],
            swordGame.levels[1],
            level_2_entrance,
            swordGame.images.boat_down,
            new Vector2(gridCells(12), gridCells(33)),
            'Down',
        ),
        level_2_exit: create_exit_boat_cutscene(
            swordGame.levels[1],
            swordGame.levels[0],
            level_1_entrance,
            swordGame.images.boat_down,
            new Vector2(gridCells(5), gridCells(15)),
            'Down',
        ),
    }
}

function create_entry_boat_cutscene(level, texture, boatStart, boatTarget, dismountDirection, travelDirection) {
    const boat = level.doodads.boat;

    return new SceneOverride({
        launch: function () {
            // make sure to center the camera to the dismount cell
            const dismountVec = direction_to_2D(dismountDirection);
            // you can centre the camera to this cell?
            swordGame.renderer.camera.centreOn(
                boatTarget.x + gridCells(dismountVec.x),
                boatTarget.y + gridCells(dismountVec.y)
            );
            boat.texture = texture;
            this.boat = boat;
            boat.position.overwrite(boatStart.x, boatStart.y);
            player.isFacing = travelDirection;
            player.animations.play(`stand${travelDirection}`)
            player.position.overwrite(boatStart.x, boatStart.y);
            player.destination.overwrite(boatStart.x, boatStart.y);
            return this;
        },

        step: function () {
            // move boat toward its target
            const distance = moveTowards(boat, boatTarget, 2);
            // update the player to track the boat
            player.position.overwrite(boat.position.x, boat.position.y);
            player.destination.overwrite(boat.position.x, boat.position.y);
            // 
            const hasArrived = distance < 1;
            if (hasArrived) {
                this.finish()
            }


        },

        finish: function () {
            //
            boat.position.overwrite(boatTarget.x, boatTarget.y);
            player.position.overwrite(boatTarget.x, boatTarget.y);
            player.destination.overwrite(boatTarget.x, boatTarget.y);

            player.isFacing = dismountDirection;

            const dismountVec = direction_to_2D(dismountDirection);
            const newX = boatTarget.x + gridCells(dismountVec.x);
            const newY = boatTarget.y + gridCells(dismountVec.y);

            player.destination.overwrite(newX, newY)
            player.position.overwrite(newX, newY)

            swordGame.currentSceneOverride = null;
            swordGame.controlsBlocked = false;
        }
    })
}

// exit scene on a boat
function create_exit_boat_cutscene(level, nextLevel, nextCutScene, texture, boatTarget, travelDirection) {
    const boat = level.doodads.boat;

    return new SceneOverride({
        launch: function () {
            boat.texture = texture;
            this.boat = boat;
            const boatStart = boat.position.duplicate();
            // boat.position.overwrite(boatStart.x, boatStart.y);
            player.isFacing = travelDirection;
            player.animations.play(`stand${travelDirection}`);
            player.position.overwrite(boatStart.x, boatStart.y);
            player.destination.overwrite(boatStart.x, boatStart.y);
            return this;
        },

        step: function () {
            //
            const distance = moveTowards(boat, boatTarget, 2);
            player.position.overwrite(boat.position.x, boat.position.y);
            player.destination.overwrite(boat.position.x, boat.position.y);
            const hasArrived = distance < 1;

            if (hasArrived) {
                this.finish()
            }


        },

        finish: function () {
            // being an exit, no need to snap the positions (we should be off-screen)
            swordGame.currentSceneOverride = null;
            swordGame.controlsBlocked = false;

            swordGame.load_new_level(nextLevel, {
                cutScene: nextCutScene,

            });
        }
    })
}