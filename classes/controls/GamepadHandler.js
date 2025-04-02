// GamepadHandler.js

import { Vector2 } from "../Vector2.js";

// something like 
// 0: A 
// 1: B ?

export class GamepadHandler {
    gamepad = null;

    buttons = new Array(17).fill(false);
    constructor(controls) {
        this.controls = controls;


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
        const readButtons = { ...this.gamepad.buttons }

        // handle buttons
        for (let i = 0; i < 4; i++) {
            const pressed = readButtons[i].pressed;
            
            if (pressed !== this.buttons[i]) {
                this.buttons[i] = pressed;
                // console.log(i) 
                this.controls.fire_control_event(this.lolABXY(i), pressed)                
            }
        }


        // handle dpad
        for (let i = 12; i < 16; i++) {
            const pressed = readButtons[i].pressed;
            if (pressed !== this.buttons[i]) {

                this.buttons[i] = pressed;
                // console.log(`changed state button ${i}`);
                this.controls.fire_control_event(this.lolDirection(i), pressed)

            }
        }
    };


    lolDirection(i) {
        if (i === 12) return 'Up';
        if (i === 13) return 'Down';
        if (i === 14) return 'Left';
        if (i === 15) return 'Right';
        return null;
    }


    lolABXY(i) {
        if (i === 0) return 'A';
        if (i === 1) return 'B';
        if (i === 2) return 'X';
        if (i === 3) return 'Y';
        return null;
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