export class Dialogue {
    // condition = false;
    constructor({
        heading,
        message,
        options,
    }) {
        this.heading = heading ?? "???";
        this.message = message;
        this.options = options ?? null
        // this.condition = condition,
        // this.promptOptions = promptOptions
    }

}
