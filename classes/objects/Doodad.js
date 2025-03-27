import { GameObject } from "../GameObject.js";
import { Vector2 } from "../Vector2.js";

export class Doodad extends GameObject {
    constructor({ name, position, texture, trigger }) {
        super({
            position: position ?? new Vector2(0, 0),

        });
        this.name = name ?? "unnamed doodad";
        this.texture = texture ?? null;
        this.trigger = trigger ?? null;
    }

}