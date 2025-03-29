import { Vector2 } from "../Vector2.js";

export class GameObject {
    constructor({position}) {
        this.position = position ?? new Vector2(0,0);
    }

}