import { handleKeyDown, handleKeyUp } from "../keyboard.js";
import {
    handlePointerDown_button,
    handlePointerUp_button,
    handlePointerDown_dpad,
    handlePointerUp,
    handlePointerMove
} from "../pointer.js";

export class GameControls {
    constructor({ HtmlControls }) {
        //
        this.current_dpad_dir = null;
        this.buttonStates = {
            A: false,
            B: false,
            X: false,
            Y: false,
        };
        this.HtmlControls = HtmlControls;
    }

    // function to translate keyboard events to the 'game'
    fire_control_event(name, on) {
        switch (name) {
            // handle the dpad cases
            case 'left':
            case 'up':
            case 'right':
            case 'down':
                if (on) {
                    this.press_dpad(name);
                } else {
                    if (this.current_dpad_dir === name) {
                        this.release_dpad();
                    }
                }
                break;
            // if not DPAD, assume we're dealing with a button
            default:
                on ? this.press_btn(name) : this.release_btn(name);
        }
    }

    // --------------------------------------------
    // the dpad
    press_dpad(direction) {
        if (this.current_dpad_dir !== null) {
            this.HtmlControls.dpad[this.current_dpad_dir].classList.remove('active');
        }
        this.current_dpad_dir = direction;
        this.HtmlControls.dpad[this.current_dpad_dir].classList.add('active');
    }

    release_dpad() {
        if (this.current_dpad_dir !== null) {
            this.HtmlControls.dpad[this.current_dpad_dir].classList.remove('active');
            this.current_dpad_dir = null;
            // console.log(`released ${current_dpad_dir}.`);
        }
    }
    // --------------------------------------------


    // --------------------------------------------
    // the buttons (ABXY)
    // function to press a button
    press_btn(input) {
        console.log(`pressed ${input}.`);
        this.HtmlControls.buttons[input].classList.add('active');
        switch (input) {
            case 'X':
                // clearCanvas();
                this.buttonStates[input] = true;
                break;
            case 'A':
                this.buttonStates[input] = true;
                break;
            case 'B':
                this.buttonStates[input] = true;
                // clearCanvas();
                break;
            case 'Y':
                this.buttonStates[input] = true;
                break;
            default:
                console.log(`sent <default?> to press btn`);
        }

    }
    // function to release a button
    release_btn(input) {
        this.buttonStates[input] = false;
        this.HtmlControls.buttons[input].classList.remove('active');
        console.log(`released ${input}.`);
    }
    // --------------------------------------------

    bind() {
        // Bind pointer down for each dpad button
        Object.entries(this.HtmlControls.dpad).forEach(([direction, element]) => {
            element.dataset.dpad = direction; // Add a custom attribute to identify the direction
            element.addEventListener('pointerdown', (event) => handlePointerDown_dpad(direction, event));
        });    
        // Bind pointer down for each button (ABXY)
        Object.entries(this.HtmlControls.buttons).forEach(([name, element]) => {
            element.dataset.buttons = name; // Add a custom attribute to identify the direction
            element.addEventListener('pointerdown', () => handlePointerDown_button(name));
            // assign the UP pointer events to 'outside of button' (doesn't catch properly for touch, but is workable)
            element.addEventListener('pointerup', () => handlePointerUp_button(name));
            element.addEventListener('pointerout', () => handlePointerUp_button(name));
            element.addEventListener('pointerleave', () => handlePointerUp_button(name));
            element.addEventListener('pointercancel', () => handlePointerUp_button(name));
            // disable right-click
            element.addEventListener("contextmenu", (event) => {
                event.preventDefault();
            });
    
        });
        // Listen for all key presses / releases
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    
        // Listen for pointerup and pointermove on the document
        document.addEventListener('pointerup', handlePointerUp);
        document.addEventListener('pointermove', handlePointerMove);
    
    }
    

}