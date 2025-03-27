import { GameObject } from "../GameObject.js";
import { Vector2 } from "../Vector2.js";

export class Trigger extends GameObject {
    constructor({ name, position, message, condition, action, setOfDialogues, rejectDialogues }) {
        super({
            position: position ?? new Vector2(0, 0),
        });

        this.name = name ?? "unnamed trigger";
        this.message = message ?? "undefined trigger event message";

        this.condition = condition ?? null;
        this.action = action ?? null;
        this.setOfDialogues = setOfDialogues ?? null;
        this.rejectDialogues = rejectDialogues ?? null;
    }

}