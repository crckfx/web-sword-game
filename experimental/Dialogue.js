import { wrapText } from "./dialogues.js";

export class Dialogue {
    // condition = false;
    constructor({
        message,
        condition,
        isUnlocked,
        promptOptions,
        // default
    }) {
        this.message = wrapText(message);
        this.condition = condition,
        this.promptOptions = promptOptions
    }

    
}

// this.defaultPromptOptions = [
//     {
//         text: "No",
//         action: this.exitDialogue.bind(this),
//     },
//     {
//         text: "Yes",
//         action: this.exitDialogue.bind(this),
//     }
// ]; 