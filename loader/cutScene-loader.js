import { Vector2 } from "../classes/Vector2.js";
import { direction_to_2D } from "../helper/directions.js";
import { gridCells, moveTowards } from "../helper/grid.js";
import { player, swordGame } from "./world-loader.js";
import { CutScene } from "../classes/CutScene.js";
import { CELL_PX } from "../document.js";
import { add_two_vectors } from "../helper/vectorHelper.js";

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

    const level_1_exit = create_exit_boat_cutscene(
        swordGame.levels[0],
        swordGame.levels[1],
        level_2_entrance, // pass a new entrance to the exit
        swordGame.images.boat_down,
        new Vector2(gridCells(12), gridCells(33)),
        'Down',
    );
    const level_2_exit = create_exit_boat_cutscene(
        swordGame.levels[1],
        swordGame.levels[0],
        level_1_entrance, // pass a new entrance to the exit
        swordGame.images.boat_down,
        new Vector2(gridCells(5), gridCells(15)),
        'Down',
    );

    const L2_door_transition = create_door_transition(swordGame.levels[1].triggers.houseDoor, swordGame.levels[3].triggers.door, swordGame.levels[3], 'Up');
    const L2_transition_into_house = create_door_transition(swordGame.levels[3].triggers.door, swordGame.levels[1].triggers.houseDoor, swordGame.levels[1], 'Down');

    return {
        level_1_entrance: level_1_entrance,
        level_2_entrance: level_2_entrance,
        level_1_exit: level_1_exit,
        level_2_exit: level_2_exit,

        L2_door_transition: L2_door_transition,
        L2_transition_into_house: L2_transition_into_house,
        //
    }
}

function create_entry_boat_cutscene(level, texture, boatStart, boatTarget, dismountDirection, travelDirection) {
    const boat = level.doodads.boat;

    return new CutScene({
        // entry scenes launch off screen; just prepare everything and go
        launch: function () {
            // make sure to center the camera to the dismount cell
            const dismountVec = direction_to_2D(dismountDirection);
            swordGame.renderer.camera.centreOn(
                boatTarget.x + gridCells(dismountVec.x),
                boatTarget.y + gridCells(dismountVec.y)
            );
            boat.texture = texture;
            this.boat = boat;
            this.boat = texture;
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
            // check if 'hasArrived'
            if (distance < 1) this.finish()
        },

        finish: function () {
            boat.position.overwrite(boatTarget.x, boatTarget.y);
            //
            player.position.overwrite(boatTarget.x, boatTarget.y);
            player.destination.overwrite(boatTarget.x, boatTarget.y);
            player.isFacing = dismountDirection;
            // 
            const dismountVec = direction_to_2D(dismountDirection);
            const newX = boatTarget.x + gridCells(dismountVec.x);
            const newY = boatTarget.y + gridCells(dismountVec.y);
            player.animations.play(`stand${dismountDirection}`);
            
            setTimeout(() => {
                player.destination.overwrite(newX, newY)
                player.position.overwrite(newX, newY)
                swordGame.currentCutScene = null;
                swordGame.controlsBlocked = false;
            }, 300)

        }
    })
}

// exit scene on a boat
function create_exit_boat_cutscene(level, nextLevel, nextCutScene, texture, boatTarget, travelDirection) {
    const boat = level.doodads.boat;

    return new CutScene({
        launch: function () {
            boat.texture = texture;
            this.boat = boat;
            const boatStart = boat.position.duplicate();
            // boat.position.overwrite(boatStart.x, boatStart.y);
            player.isFacing = travelDirection;
            player.animations.play(`stand${travelDirection}`);
            player.position.overwrite(boatStart.x, boatStart.y);
            player.destination.overwrite(boatStart.x, boatStart.y);
            // return this;
            // this.isRunning = true;
        },
        

        step: function () {
            if (!this.isRunning) return;
            const distance = moveTowards(boat, boatTarget, 2);
            player.position.overwrite(boat.position.x, boat.position.y);
            player.destination.overwrite(boat.position.x, boat.position.y);
            const hasArrived = distance < 1;
            if (hasArrived) {
                this.finish()
            }
        },

        finish: function () {
            this.isRunning = false;
            // being an exit, no need to snap the positions (we should be off-screen)
            swordGame.currentCutScene = null;
            swordGame.controlsBlocked = false;

            swordGame.load_new_level(nextLevel, {
                cutScene: nextCutScene,
            });

        }
    })
}


function create_door_arrive_cutScene(door, travelDirection) {
    const doorPos = door.position.duplicate();
    const exitVec = direction_to_2D(travelDirection);
    exitVec.x *= CELL_PX;
    exitVec.y *= CELL_PX;
    const exitCell = add_two_vectors(doorPos, exitVec);

    return new CutScene({
        launch: function() {
            player.isFacing = travelDirection;
            player.position.overwrite(doorPos.x, doorPos.y);

            swordGame.renderer.camera.centreOn(exitCell.x, exitCell.y)
            player.destination.overwrite(exitCell.x, exitCell.y)
            return this;
        },
        step: function() {
            // no need to handle movement, only need to change the destination in this context and movement will still be handled
            if (player.position.x === exitCell.x && player.position.y === exitCell.y) {
                this.finish();
            }
        },
        finish: function() {
            swordGame.currentCutScene = null;
            swordGame.controlsBlocked = false;
        }
    });
}

function create_door_transition(doorIn, doorOut, newLevel, travelDirection) {
    const inDoorPos = doorIn.position.duplicate();
    const outDoorPos = doorOut.position.duplicate();

    return new CutScene({
        launch: function() {
            player.isFacing = travelDirection;
            player.animations.play(`walk${travelDirection}`);
            player.destination.overwrite(inDoorPos.x, inDoorPos.y);
            return this;
        },

        step: function () {
            if (player.position.x === inDoorPos.x && player.position.y === outDoorPos.y) {
                this.finish();
            }
        },
        finish: function() {
            swordGame.load_new_level(newLevel, {
                cutScene: create_door_arrive_cutScene(doorOut, travelDirection),
            })
        }
    })
}