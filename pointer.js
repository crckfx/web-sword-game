import { game } from "./game.js";
// --- DPAD POINTERS ---
let dpadPointerId = null; // Track the active pointer ID
// (specific) this pointerDOWN handler is assigned to the DPAD elements (paths) only
export function handlePointerDown_dpad(direction, event) {
    if (dpadPointerId === null) { // Only set if no active pointer
        dpadPointerId = event.pointerId; // assign the new pointer as the dpad's active one
        // fire_control_event(direction, true);
        game.controls.fire_control_event(direction, true);
        
    }
}
// the (general) pointerUP handler checks ALL 'ups' against the dpadPointerId
export function handlePointerUp(event) {
    if (dpadPointerId === event.pointerId) { // Only release if the same pointer
        dpadPointerId = null; // Clear the active pointer
        // fire_control_event(current_dpad_dir, false);
        game.controls.fire_control_event(game.controls.current_dpad_dir, false);
    }
}
// the (general) pointer MOVE handler checks ALL 'moves' against the dpadPointerId
export function handlePointerMove(event) {
    if (dpadPointerId === event.pointerId) { // Only track movements for the active pointer
        const target = document.elementFromPoint(event.clientX, event.clientY);
        if (target && target.dataset.dpad) { // Ensure it's a valid dpad button
            const direction = target.dataset.dpad;
            if (direction !== game.controls.current_dpad_dir) { // Change direction if it's different
                game.controls.fire_control_event(direction, true);
            }
        }
    }
}
// --- BUTTON POINTERS ---
// DOWN handler, assigned only to the buttons
export function handlePointerDown_button(name) {
    if (game.controls.buttonStates[name] !== true) {
        // buttonStates[name] = true;
        game.controls.fire_control_event(name, true);
    }
}
// UP handler, assigned only to the buttons
export function handlePointerUp_button(name) {
    if (game.controls.buttonStates[name] === true) {
        // buttonStates[name] = false;
        game.controls.fire_control_event(name, false);
    }
}

