export class KeyboardHandler {
    constructor(controls) {
        //
        this.controls = controls;
        // Bind methods to the correct 'this'
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    keyboard = {
        arrowleft: false,
        arrowup: false,
        arrowright: false,
        arrowdown: false,
        z: false,
        x: false,
        a: false,
        s: false,
        escape: false,
    };
    keyAliases = {
        arrowleft: 'left',
        arrowup: 'up',
        arrowright: 'right',
        arrowdown: 'down',
        z: 'A',
        x: 'B',
        a: 'X',
        s: 'Y',
        escape: 'ESCAPE',
    };

    handleKeyDown(event) {
        const key = event.key.toLowerCase();
        if (key in this.keyboard) {
            event.preventDefault();
            // only handle if not already pressed
            if (this.keyboard[key] !== true) {
                this.keyboard[key] = true;
                this.controls.fire_control_event(this.keyAliases[key], true); // lookup the keycode in keyAliases[] for its control alias
            }
        }
    }

    handleKeyUp(event) {
        const key = event.key.toLowerCase();
        if (key in this.keyboard) {
            // only handle if already pressed
            event.preventDefault();
            if (this.keyboard[key] === true) {
                this.keyboard[key] = false;
                this.controls.fire_control_event(this.keyAliases[key], false); // lookup the keycode in keyAliases[] for its control alias
            }
        }
    }

}


