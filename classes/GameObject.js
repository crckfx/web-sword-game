import { Vector2 } from "../classes/Vector2.js";

export class GameObject {
    constructor({position}) {
        this.position = position ?? new Vector2(0,0);
        this.children = [];
    }

}