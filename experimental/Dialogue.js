import { wrapText } from "./dialogues.js";

export class Dialogue {
    // condition = false;
    constructor({
        message,
        condition,
        isUnlocked,
        // default
    }) {
        this.message = wrapText(message);
        this.condition = condition
    }

    
}