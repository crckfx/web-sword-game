// experimental scene extension with less parameters needed (step function for example)

import { CutScene } from "../CutScene.js";

export class BoatCutScene extends CutScene {
    constructor({
        passenger, boat, finish, launch
    }) {
        //
        this.boat = boat;
        this.passenger = passenger;
    }

    step() {
        // move boat toward its target
        const distance = moveTowards(this.boat, boatTarget, 2);
        // update the player to track the boat
        this.passenger.position.overwrite(this.boat.position.x, this.boat.position.y);
        this.passenger.destination.overwrite(this.boat.position.x, this.boat.position.y);
        // check if 'hasArrived'
        if (distance < 1) this.finish()
    }

}