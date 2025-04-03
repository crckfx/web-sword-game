// GamepadHandler.js

import { Vector2 } from "../Vector2.js";

// something like 
// 0: A 
// 1: B ?

export class GamepadHandler {
    gamepad = null;

    buttonAliases = new Array(17).fill(null);

    buttons = new Array(17).fill(false);
    constructor(controls) {
        this.controls = controls;

        this.createButtonAliases();

        window.addEventListener("gamepadconnected", (e) => {
            console.log(
                "Gamepad connected at index %d: %s. %d buttons, %d axes.",
                e.gamepad.index,
                e.gamepad.id,
                e.gamepad.buttons.length,
                e.gamepad.axes.length,
            );
            this.gamepad = e.gamepad;
        });
    }


    pollGamepad() {
        // read the buttons from the gamepad
        const readButtons = { ...this.gamepad.buttons }

        // handle buttons
        for (let i = 0; i < 4; i++) {
            const pressed = readButtons[i].pressed;
            
            if (pressed !== this.buttons[i]) {
                this.buttons[i] = pressed;
                // console.log(i) 
                this.controls.fire_control_event(this.buttonAliases[i], pressed)                
            }
        }

        if (this.buttons[9] !== readButtons[9].pressed) {
            this.buttons[9] = readButtons[9].pressed;
            this.controls.fire_control_event(this.buttonAliases[9], this.buttons[9])
        }
        

        // handle dpad (buttons 12, 13, 14, 15)
        for (let i = 12; i < 16; i++) {
            // check if the button is is pressed
            const pressed = readButtons[i].pressed;
            if (pressed !== this.buttons[i]) {
                // update the local state for the button
                this.buttons[i] = pressed;
                // fire the control event for a dpad state change
                this.controls.fire_control_event(this.buttonAliases[i], pressed)
            }
        }

        
    };



    createButtonAliases() {

        this.buttonAliases[0] = 'A';
        this.buttonAliases[1] = 'B';
        this.buttonAliases[2] = 'X';
        this.buttonAliases[3] = 'Y';
        
        this.buttonAliases[9] = 'ESCAPE';

        this.buttonAliases[12] = 'Up';
        this.buttonAliases[13] = 'Down';
        this.buttonAliases[14] = 'Left';
        this.buttonAliases[15] = 'Right';
    }
}


// Index 	Button .pressed Code 	        Button on Xbox 	    Button on PlayStation
// 0 	    gamepad.buttons[0].pressed 	    A 	                X
// 1 	    gamepad.buttons[1].pressed 	    B 	                O
// 2 	    gamepad.buttons[2].pressed 	    X 	                Square
// 3 	    gamepad.buttons[3].pressed 	    Y 	                Triangle
// 4 	    gamepad.buttons[4].pressed 	    LB 	                L1
// 5 	    gamepad.buttons[5].pressed 	    RB 	                R1
// 6 	    gamepad.buttons[6].pressed 	    LT 	                L2
// 7 	    gamepad.buttons[7].pressed 	    RT 	                R2
// 8 	    gamepad.buttons[8].pressed 	    Show Address Bar 	Share
// 9 	    gamepad.buttons[9].pressed 	    Show Menu 	        Options
// 10 	    gamepad.buttons[10].pressed 	Left Stick Pressed 	Left Stick Pressed
// 11 	    gamepad.buttons[11].pressed 	Right Stick Pressed Right Stick Pressed
// 12 	    gamepad.buttons[12].pressed 	Directional Up 	    Directional Up
// 13 	    gamepad.buttons[13].pressed 	Directional Down 	Directional Down
// 14 	    gamepad.buttons[14].pressed 	Directional Left 	Directional Left
// 15 	    gamepad.buttons[15].pressed 	Directional Right 	Directional Right
// 16 	    gamepad.buttons[16].pressed 	Xbox Light-Up Logo 	PlayStation Logo