import { gridCells } from "../../helper/grid.js";
import { GameObject } from "../GameObject.js";
import { Vector2 } from "../Vector2.js";

export class Item extends GameObject{
    constructor(name, position, texture, invTexture, description) {
        super({position: position ?? null})
        this.name = name ?? 'unnamed item';
        // this.position = position ?? null;
        this.texture = texture ?? null;
        // console.log(this.texture);
        this.isHeldBy = null;
        this.invTexture = invTexture ?? null;
        this.description = description ?? "some item";
    }
}

