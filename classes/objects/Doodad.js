import { GameObject } from "../GameObject.js";

export class Doodad extends GameObject {
    constructor({ name, position, texture,  }) {
        super({
            position: position ?? new Vector2(0, 0),

        });
        this.name = name ?? "unnamed doodad";
        // this.texture = texture ?? null;
    }

}