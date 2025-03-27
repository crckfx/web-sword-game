// Dialogue.js
// usage: put Dialogues in a SetOfDialogues, or instantiate a quick one
export class Dialogue {
    constructor({
        heading,
        message,
        options,
        onFinish,
    }) {
        this.heading = heading ?? "???";
        this.message = message;
        this.options = options ?? null
        this.onFinish = onFinish ?? null;
    }

}
