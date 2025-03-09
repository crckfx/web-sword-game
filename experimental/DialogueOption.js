export class DialogueOption {
    constructor(label, action) {
        this.label = label ?? "???";
        this.action = action ?? null;
    }
}