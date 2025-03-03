import { gridCells } from "../helper/grid.js";
import { Vector2 } from "./Vector2.js";

export class Item {
    constructor(name, position, texture) {
        this.name = name ?? 'unnamed item';
        this.position = position ?? null;
        this.texture = texture ?? null;
        // console.log(this.texture);
        this.isHeldBy = null;
    }



}

