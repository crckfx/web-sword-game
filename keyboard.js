// keyoard.js
// - defines a way to catch specified key events 
// - defines a translation of *keyboard actions* => *control messages*
// - maps actions to `fire_control_event` (imported function which accepts control messages)

import { gameControls } from "./game.js";
// --------------------------------------------
// the keyboard
// define the keyAliases we want to handle
const keyboard = {
    arrowleft: false,
    arrowup: false,
    arrowright: false,
    arrowdown: false,
    z: false,
    x: false,
    a: false,
    s: false,
}
// map keyboard keys to control messages
const keyAliases = {
    arrowleft: 'left',
    arrowup: 'up',
    arrowright: 'right',
    arrowdown: 'down',
    z: 'A',
    x: 'B',
    a: 'X',
    s: 'Y',
};
// handler function for (all) key presses
export function handleKeyDown(event) {
    const key = event.key.toLowerCase();
    if (key in keyboard) {
        event.preventDefault();
        // only handle if not already pressed
        if (keyboard[key] !== true) {
            keyboard[key] = true;
            // fire_control_event(keyAliases[key], true); // lookup the keycode in keyAliases[] for its control alias
            gameControls.fire_control_event(keyAliases[key], true); // lookup the keycode in keyAliases[] for its control alias
        }
    }
}
// handler function for (all) key releases
export function handleKeyUp(event) {
    const key = event.key.toLowerCase();
    if (key in keyboard) {
        // only handle if already pressed
        event.preventDefault();
        if (keyboard[key] === true) {
            keyboard[key] = false;
            // fire_control_event(keyAliases[key], false); // lookup the keycode in keyAliases[] for its control alias
            gameControls.fire_control_event(keyAliases[key], false); // lookup the keycode in keyAliases[] for its control alias
        }
    }
}