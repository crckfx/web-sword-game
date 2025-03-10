export class SetOfDialogues {
    dialogues = [];
    count = 0;
    constructor(dialogues) {
        for (let i=0; i<dialogues.length; i++) {
            this.dialogues.push(dialogues[i]);
            
        }
    }

    launch() {
        this.count = 0;

    }

    getDialogue() {
        return this.dialogues[this.count];
    }

    progress() {
        this.count ++;
        if (this.count > this.dialogues.length-1) {
            this.count = 0;
            return null;
        }
        return this.getDialogue();
    }
}