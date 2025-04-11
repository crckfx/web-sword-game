import { Vector2 } from "./classes/Vector2.js";

// declarations. try and put them in order of precedence.
export const NUM_GRID = new Vector2(32, 35); // total number of map X & Y cells

// game declarations
export const CELL_PX = 32;
export const CAMERA_CELLS = new Vector2(11, 9);
const ASPECT_RATIO = CAMERA_CELLS.x / CAMERA_CELLS.y;
const PADDING = 24;
const MAX_SIZE = new Vector2(1650, 1350);

export const canvas = document.getElementById('game_canv');
canvas.width = CAMERA_CELLS.x * CELL_PX; 
canvas.height= CAMERA_CELLS.y * CELL_PX;
// export const ctx = canvas.getContext("2d");
export const panelCenter = document.getElementById('panel_center');
const panelLeft = document.getElementById('panel_left');
const panelRight = document.getElementById('panel_right');

export const MIDDLE_CELL = {
    x: CELL_PX * ((CAMERA_CELLS.x - 1) / 2),
    y: CELL_PX * ((CAMERA_CELLS.y - 1) / 2),
};

// ------------------------------------------------------

applyPreventsToPanel(panelLeft);
applyPreventsToPanel(panelRight);
// watch for resize on the canvas container
const observer = new ResizeObserver(resize);
observer.observe(panelCenter);


// function to set the canvas size based on its parent (note - 'overflow:hidden' protects against parent growth)
function resize() {
    // use the container's dimensions to determine orientation
    const rect = panelCenter.getBoundingClientRect();
    let width, height;
    if (rect.width / rect.height < ASPECT_RATIO) {
        // vertical
        width = rect.width;
        height = rect.width / ASPECT_RATIO;
    } else {
        // horizontal
        height = rect.height;
        width = rect.height * ASPECT_RATIO;
    }
    // clamp size
    if (width > MAX_SIZE.x || height > MAX_SIZE.y) {
        width = MAX_SIZE.x;
        height = MAX_SIZE.y;
    }
    // subtract padding
    const finalWidth = width - PADDING;
    const finalHeight = height - PADDING;
    canvas.style.width = `${finalWidth}px`;
    canvas.style.height = `${finalHeight}px`;


}

export function getHtmlControls() {
    const HTMLcontrols = {
        dpad: {
            Left: document.getElementById('dpad_left'),
            Up: document.getElementById('dpad_up'),
            Right: document.getElementById('dpad_right'),
            Down: document.getElementById('dpad_down'),
        },
        buttons: {
            A: document.getElementById('control_A'),
            B: document.getElementById('control_B'),
            X: document.getElementById('control_X'),
            Y: document.getElementById('control_Y'),
        },

    };

    return HTMLcontrols;
}


function applyPreventsToPanel(panel) {
    panel.addEventListener("contextmenu", (event) => { event.preventDefault(); });
    const controlBlock = panel.querySelector('.ctrlblock');
    if (controlBlock) {
        controlBlock.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });
    }
}
