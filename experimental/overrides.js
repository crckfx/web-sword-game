import { Vector2 } from "../classes/Vector2.js";
import { CELL_PX } from "../document.js";
import { player, swordGame } from "../helper/world-loader.js";
import { SceneOverride } from "./SceneOverride.js";

export const OVERRIDE_BOAT_LEVEL_1_ENTRY = new SceneOverride({
    launch: function () {
        this.boat = swordGame.levels[0].doodads.boat;
        this.boat.texture = swordGame.images.boat_up;
        this.targetY = 30 * CELL_PX;
        const t = this.boat.position.duplicate();
        player.destination.overwrite(t.x, t.y);
        player.position.overwrite(t.x, t.y);
        return this;
    },

    step: function () {
        const newY = this.boat.position.y -= 1;
        if (newY <= this.targetY) {
            console.log(swordGame.renderer.camera.pos)
            this.finish()
        } else {
            // console.log(swordGame.renderer.camera.pos)
            this.boat.position.y = newY;
            player.position.y = newY;
            player.destination.y = newY;
        }
    },

    finish: function () {
        this.boat.position.y = this.targetY;
        player.isFacing = 'up';
        player.position.y = this.targetY - CELL_PX;
        player.destination.y = this.targetY - CELL_PX;
        swordGame.currentSceneOverride = null;
        swordGame.controlsBlocked = false;
    }

})

export const OVERRIDE_BOAT_LEVEL_1_EXIT = new SceneOverride({

    launch: function () {
        this.boat = swordGame.levels[0].doodads.boat;
        const t = this.boat.position.duplicate();
        player.destination.overwrite(t.x, t.y);
        player.position.overwrite(t.x, t.y);
        return this;
    },

    step: function () {
        // const boat = swordGame.levels[0].doodads.boat;
        const newY = this.boat.position.y += 1;
        if (newY > swordGame.renderer.camera.pos.y + swordGame.renderer.camera.size.y + CELL_PX + 8) {
            // console.log("finished yo")
            this.finish();
        } else {
            this.boat.position.y = newY;
            player.position.y = newY;
            player.destination.y = newY;
        }
    },

    finish: function () {
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
    }
});

export const OVERRIDE_BOAT_LEVEL_2_ENTRY = new SceneOverride({
    game: swordGame,

    launch: function () {
        this.boat = swordGame.levels[1].doodads.boat;
        this.targetY = 9 * CELL_PX;
        const t = this.boat.position.duplicate();
        player.destination.overwrite(t.x, t.y);
        player.position.overwrite(t.x, t.y);
        return this;
    },

    step: function () {
        const newY = this.boat.position.y -= 1;
        if (newY <= this.targetY) {
            console.log(swordGame.renderer.camera.pos)
            this.finish()
        } else {
            // console.log(swordGame.renderer.camera.pos)
            this.boat.position.y = newY;
            player.position.y = newY;
            player.destination.y = newY;
        }
    },

    finish: function () {
        this.boat.position.y = this.targetY;
        player.position.y = this.targetY;
        player.destination.y = this.targetY;

        player.isFacing = 'right';
        player.destination.x += CELL_PX
        player.position.x += CELL_PX

        // console.log("finished yo")
        swordGame.currentSceneOverride = null;
        swordGame.controlsBlocked = false;
    }
});

export const OVERRIDE_BOAT_LEVEL_2_EXIT = new SceneOverride({
    launch: function () {
        this.boat = swordGame.levels[1].doodads.boat; // level 2's instance of boat
        this.targetY = this.boat.position.y + 6 * CELL_PX;   
        this.boat.texture = swordGame.images.boat_down;
        const t = this.boat.position.duplicate();
        player.destination.overwrite(t.x, t.y);
        player.position.overwrite(t.x, t.y);
        player.isFacing = 'down';
        return this;
    },

    step: function () {
        const newY = this.boat.position.y += 1;
        if (newY >= this.targetY) {
            this.finish();
        } else {
            // console.log(swordGame.renderer.camera.pos)
            this.boat.position.y = newY;
            player.position.y = newY;
            player.destination.y = newY;
        }
    },

    finish: function () {
        console.log(swordGame.renderer.camera.pos)
        this.boat.position.y = this.targetY;
        player.position.y = this.targetY;
        player.destination.y = this.targetY;

        const positionVector = new Vector2(12 * CELL_PX, 33 * CELL_PX);
        // swordGame.load_new_level(swordGame.levels[0]);
        swordGame.load_new_level(swordGame.levels[0], {
            player: {
                isFacing: 'up',
                position: positionVector.duplicate(),
            },
            boat: {
                position: positionVector.duplicate(),
            },
            camera: {
                pos: new Vector2(7 * CELL_PX, 25 * CELL_PX),
            },
            initOverride: OVERRIDE_BOAT_LEVEL_1_ENTRY,

        });

    },
});
