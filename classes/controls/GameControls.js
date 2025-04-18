import { GamepadHandler } from "./GamepadHandler.js";
import { KeyboardHandler } from "./KeyboardHandler.js";
import { PointerHandler } from "./PointerHandler.js";

export class GameControls {
    current_dpad_dir = null;
    game = null;
    buttonStates = {
        A: false,
        B: false,
        X: false,
        Y: false,
    };
    constructor({
        HtmlControls,
        bang_A = null,
        bang_B = null,
        bang_Y = null,
        bang_X = null,
        bang_pause = null,
        bang_resume = null,
        game = null,
        bang_dpad = null,
    }) {
        //
        this.HtmlControls = HtmlControls;
        this.pointerHandler = new PointerHandler(this);
        this.keyboardHandler = new KeyboardHandler(this);
        this.gamepadHandler = new GamepadHandler(this);

        this.bang_A = bang_A;               // pass in functions
        this.bang_B = bang_B;               // pass in functions
        this.bang_Y = bang_Y;               // pass in functions
        this.bang_X = bang_X;               // pass in functions
        this.bang_pause = bang_pause;       // pass in functions
        this.bang_resume = bang_resume;     // pass in functions (game resume)
        this.bang_dpad = bang_dpad;         // pass in functions (DPAD)
        this.game = game;
    }

    // function to translate keyboard events to the 'game'
    fire_control_event(name, on) {
        switch (name) {
            // handle the dpad cases
            case 'Left':
            case 'Up':
            case 'Right':
            case 'Down':
                if (on) {
                    this.press_dpad(name);
                } else {
                    if (this.current_dpad_dir === name) {
                        this.release_dpad();
                    }
                }
                break;
            // if not DPAD, assume we're dealing with a button
            case 'A': case 'B': case 'X': case 'Y':
                on ? this.press_btn(name) : this.release_btn(name);
                break;
            case 'ESCAPE':
                if (on) {
                    this.bang_pause(this.game);
                }
                break;
            default:
                // on ? this.press_btn(name) : this.release_btn(name);
                let state = on ? "on" : "off";
                console.log(`sent ${state} to ${name}`);
        }
    }

    // --------------------------------------------
    // the dpad
    press_dpad(direction) {
        // remove any old if exists
        if (this.current_dpad_dir !== null) {
            this.HtmlControls.dpad[this.current_dpad_dir].classList.remove('active');
        }
        this.current_dpad_dir = direction;
        this.HtmlControls.dpad[this.current_dpad_dir].classList.add('active');
        this.bang_dpad(this.game, direction);
    }

    release_dpad() {
        if (this.current_dpad_dir !== null) {
            this.HtmlControls.dpad[this.current_dpad_dir].classList.remove('active');
            this.current_dpad_dir = null;
            this.bang_dpad(this.game, null);
        }
    }
    // --------------------------------------------


    // --------------------------------------------
    // the buttons (ABXY)
    // function to press a button
    press_btn(input) {
        // console.log(`pressed ${input}.`);
        this.HtmlControls.buttons[input].classList.add('active');
        switch (input) {
            case 'X':
                this.buttonStates[input] = true;
                this.bang_X(this.game);
                break;
            case 'A':
                this.buttonStates[input] = true;
                this.bang_A(this.game);
                break;
            case 'B':
                this.buttonStates[input] = true;
                this.bang_B(this.game);
                break;
            case 'Y':
                this.buttonStates[input] = true;
                this.bang_Y(true);
                break;
            default:
                console.log(`sent <default?> to press btn`);
        }

    }
    // function to release a button
    release_btn(input) {
        this.buttonStates[input] = false;
        this.HtmlControls.buttons[input].classList.remove('active');
    }
    // --------------------------------------------

    bind() {
        // Bind pointer down for each dpad button
        Object.entries(this.HtmlControls.dpad).forEach(([direction, element]) => {
            element.dataset.dpad = direction; // Add a custom attribute to identify the direction
            element.addEventListener('pointerdown', (event) => {
                event.preventDefault();
                this.pointerHandler.handlePointerDown_dpad(direction, event)
            });
        });
        // Bind pointer down for each button (ABXY)
        Object.entries(this.HtmlControls.buttons).forEach(([name, element]) => {
            element.dataset.buttons = name; // Add a custom attribute to identify the direction
            element.addEventListener('pointerdown', () => this.pointerHandler.handlePointerDown_button(name));
            // assign the UP pointer events to 'outside of button' (doesn't catch properly for touch, but is workable)
            element.addEventListener('pointerup', () => this.pointerHandler.handlePointerUp_button(name));
            element.addEventListener('pointerout', () => this.pointerHandler.handlePointerUp_button(name));
            element.addEventListener('pointerleave', () => this.pointerHandler.handlePointerUp_button(name));
            element.addEventListener('pointercancel', () => this.pointerHandler.handlePointerUp_button(name));
            // disable right-click
            element.addEventListener("contextmenu", (event) => {
                event.preventDefault();
            });


        });
        // Listen for all key presses / releases
        document.addEventListener('keydown', this.keyboardHandler.handleKeyDown);
        document.addEventListener('keyup', this.keyboardHandler.handleKeyUp);

        // Listen for pointerup and pointermove on the document
        document.addEventListener('pointerup', this.pointerHandler.handlePointerUp);
        document.addEventListener('pointermove', this.pointerHandler.handlePointerMove);

    }

}