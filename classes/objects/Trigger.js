import { GameObject } from "../GameObject.js";
import { Vector2 } from "../Vector2.js";

export class Trigger extends GameObject {
    constructor({ name, position, message, condition, action_RUN, action_REJECT }) {
        super({
            position: position ?? new Vector2(0, 0),
        });

        this.name = name ?? "unnamed trigger";
        this.message = message ?? "undefined trigger event message";

        this.condition = condition ?? null;
        this.action_RUN = action_RUN ?? null;
        this.action_REJECT = action_REJECT ?? null;
    }

}