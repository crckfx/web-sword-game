import { Dialogue } from "./Dialogue.js";

export class SetOfDialogues {
    dialogues = []; // an array we (the constructor) will push stuff into 
    count = 0; // it's like 'promptIndex', but local?
    constructor({dialogues, heading, canExit }) {
        this.canExit = canExit ?? false;
        // unify Dialogues with (presumably) Strings by checking for 'instanceof Dialogue'
        if (dialogues !== null) {
            for (let i = 0; i < dialogues.length; i++) {
                if (dialogues[i] instanceof Dialogue) {
                    // it's already a dialogue; push it straight in
                    this.dialogues.push(dialogues[i]);
                } else {
                    // it's just a String, so make a dialogue out of it
                    const m = dialogues[i];
                    this.dialogues.push(new Dialogue({
                        heading: heading ?? "Hello from SetOfDialogues",
                        message: m,
                        options: null, // assume no options for a String
                    }));
                }
            }
        }
    }

    getDialogue() { return this.dialogues[this.count]; }

    launch() {
        this.count = 0;
        return this.getDialogue();
    }

    progress() {
        this.count++;
        if (this.count > this.dialogues.length - 1) {
            // this.count = 0;
            return null;
        }
        return this.getDialogue();
    }
}