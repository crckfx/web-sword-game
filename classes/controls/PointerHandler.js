export class PointerHandler {
    constructor(controls) {
        //
        this.controls = controls;
        this.dpadPointerId = null; // Track the active pointer ID

        this.handlePointerUp = this.handlePointerUp.bind(this); // 1. maybe like this?
        this.handlePointerMove = this.handlePointerMove.bind(this); // 2. and this?
     
        this.handlePointerDown_dpad = this.handlePointerDown_dpad.bind(this); // 2. and this?
        this.handlePointerDown_button = this.handlePointerDown_button.bind(this); // 2. and this?
        this.handlePointerUp_button = this.handlePointerUp_button.bind(this); // 2. and this?
        // 3. and more?
    }

    handlePointerDown_dpad(direction, event) {
        if (this.dpadPointerId === null) { // Only set if no active pointer
            this.dpadPointerId = event.pointerId; // assign the new pointer as the dpad's active one
            this.controls.fire_control_event(direction, true);
        }
    }

    handlePointerUp(event) {
        if (this.dpadPointerId === event.pointerId) { // Only release if the same pointer
            this.dpadPointerId = null; // Clear the active pointer
            this.controls.fire_control_event(this.controls.current_dpad_dir, false);
        }
    }
    handlePointerMove(event) {
        if (this.dpadPointerId === event.pointerId) { // Only track movements for the active pointer
            const target = document.elementFromPoint(event.clientX, event.clientY);
            if (target && target.dataset.dpad) { // Ensure it's a valid dpad button
                const direction = target.dataset.dpad;
                if (direction !== this.controls.current_dpad_dir) { // Change direction if it's different
                    this.controls.fire_control_event(direction, true);
                }
            }
        }
    }
    handlePointerDown_button(name) {
        if (this.controls.buttonStates[name] !== true) {
            this.controls.fire_control_event(name, true);
        }
    }
    handlePointerUp_button(name) {
        if (this.controls.buttonStates[name] === true) {
            this.controls.fire_control_event(name, false);
        }
    }
}