import { Dialogue } from "./Dialogue.js";

export class SetOfDialogues {
    dialogues = [];
    count = 0;
    constructor(dialogues = null, heading = null, canExit = false) {
        // if Dialogue instances were provided, push them in first
        // extra messages? - intended for shorthands
        // if (messages !== null) {
        //     for (let i = 0; i < messages.length; i++) {
        //         const m = messages[i];
        //         this.dialogues.push(new Dialogue({
        //             heading: heading ?? "Hello from SetOfDialogues",
        //             message: m,
        //             options: null,
        //         }));
        //     }
        // }
        if (dialogues !== null) {
            for (let i = 0; i < dialogues.length; i++) {

                if (dialogues[i] instanceof Dialogue) {
                    this.dialogues.push(dialogues[i]);
                } else {
                    const m = dialogues[i];
                    this.dialogues.push(new Dialogue({
                        heading: heading ?? "Hello from SetOfDialogues",
                        message: m,
                        options: null,
                    }));                    
                }

            }
        }


        this.canExit = canExit;
    }


    getDialogue() {
        return this.dialogues[this.count];
    }


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