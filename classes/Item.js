import { gridCells } from "../helper/grid.js";
import { Vector2 } from "./Vector2.js";

export class Item {
    constructor(name, position, texture, invTexture) {
        this.name = name ?? 'unnamed item';
        this.position = position ?? null;
        this.texture = texture ?? null;
        // console.log(this.texture);
        this.isHeldBy = null;
        this.invTexture = invTexture ?? null;
    }



}

