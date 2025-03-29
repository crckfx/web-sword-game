import { GameObject } from "./GameObject.js";
import { Vector2 } from "../Vector2.js";

export class Trigger extends GameObject {
    constructor({ name, position, message, condition, action_RUN, action_REJECT }) {
        super({
            position: position ?? new Vector2(0, 0),
        });

        this.name = name ?? "unnamed trigger";
        this.message = message ?? "undefined trigger event message";
        
        this.condition = condition ?? null;
        this.action_RUN =
            action_RUN ??
            function () { console.log(`unhandled run case for trigger '${this.name}'`) };;
        this.action_REJECT =
            action_REJECT ??
            function () { console.log(`unhandled reject case for trigger '${this.name}'`) };
    }

    tryRun() {
        // default to true
        let shouldRun = true;
        // if there's a condition function, overwrite shouldRun by running it
        if (this.condition)
            shouldRun = this.condition();
        // now run the appropriate action;
        if (shouldRun)
            this.action_RUN();
        else
            this.action_REJECT();


    }

}