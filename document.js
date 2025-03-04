import { Vector2 } from "./classes/Vector2.js";
import { gridCells } from "./helper/grid.js";
import { Player } from "./classes/Player.js";
import { Animations } from "./classes/Animations.js";
import { FrameIndexPattern } from "./classes/FrameIndexPattern.js";
import { STAND_DOWN, STAND_LEFT, STAND_RIGHT, STAND_UP, WALK_DOWN, WALK_LEFT, WALK_RIGHT, WALK_UP } from "./helper/walk.js";


// declarations. try and put them in order of precedence.
export const NUM_GRID = new Vector2(24, 28); // total number of map X & Y cells

// game declarations
export const doodads = [];
export const entities = {}
export const FLOOR_CELL_PIXELS = 32;
export const CAMERA_CELLS = new Vector2(11, 9);
// export const HtmlControls = getHtmlControls();


// const ASPECT_RATIO = 11 / 9;
const ASPECT_RATIO = CAMERA_CELLS.x / CAMERA_CELLS.y;
const PADDING = 24;
const MAX_SIZE = new Vector2(1650, 1350);

export const canvas = document.getElementById('game_canv');
canvas.width = CAMERA_CELLS.x * FLOOR_CELL_PIXELS; 
canvas.height= CAMERA_CELLS.y * FLOOR_CELL_PIXELS;
export const ctx = canvas.getContext("2d");
export const panelCenter = document.getElementById('panel_center');
const panelLeft = document.getElementById('panel_left');
const panelRight = document.getElementById('panel_right');
export const pauseMenu = document.getElementById('pauseMenu');
export const gameSpeech = {
    container: document.getElementById('game_speech'),
    name: document.getElementById('game_speech').querySelector('.name'),
    message: document.getElementById('game_speech').querySelector('.message'),

};
// export const pauseMenu_resumeBtn = document.getElementById('pauseMenu_resumeBtn');

export const cell_size = getCellSize();
export const MIDDLE_CELL = {
    x: cell_size.x * ((CAMERA_CELLS.x - 1) / 2),
    y: cell_size.y * ((CAMERA_CELLS.y - 1) / 2),
};

export const player = new Player({
    name: 'lachie',
    position: new Vector2(gridCells(1), gridCells(1)),
    isFacing: 'up',
    animations: new Animations({
        walkUp: new FrameIndexPattern(WALK_UP),
        walkLeft: new FrameIndexPattern(WALK_LEFT),
        walkDown: new FrameIndexPattern(WALK_DOWN),
        walkRight: new FrameIndexPattern(WALK_RIGHT),

        standUp: new FrameIndexPattern(STAND_UP),
        standLeft: new FrameIndexPattern(STAND_LEFT),
        standDown: new FrameIndexPattern(STAND_DOWN),
        standRight: new FrameIndexPattern(STAND_RIGHT),
    }),
    speed: 2,
    
});

// ------------------------------------------------------

applyPreventsToPanel(panelLeft);
applyPreventsToPanel(panelRight);
// watch for resize on the canvas container
const observer = new ResizeObserver(resize);
observer.observe(panelCenter);





// ------------------------------------------------------
function getCellSize() {
    return {
        x: canvas.width / CAMERA_CELLS.x,
        y: canvas.height / CAMERA_CELLS.y,
    }
}

// function to set the canvas size based on its parent (note - overflow:hidden protects against parent growth)
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
    pauseMenu.style.width = `${finalWidth}px`;
    pauseMenu.style.height = `${finalHeight}px`;

    // gameSpeech.container.style.width = `${finalWidth * 0.8}px`;
    // gameSpeech.container.style.height = `${finalHeight * 0.4}px`;

    const newCellSize = getCellSize();
    cell_size.x = newCellSize.x;
    cell_size.y = newCellSize.y;
    console.log(cell_size.x, cell_size.y, (finalWidth / 11));

    const canvasBounds = canvas.getBoundingClientRect();    
    gameSpeech.container.style.width = `${canvasBounds.width - (PADDING)}px`;
    gameSpeech.container.style.height = `${canvasBounds.height * 0.4}px`;
    gameSpeech.container.style.bottom = `${rect.bottom - canvasBounds.bottom + (PADDING/2)}px`;
    // console.log(gameSpeech.container.style.width) //.style.width = canvasBounds.width;
    // console.log(gameSpeech.container) //.style.height = canvasBounds.width;
    
    // draw();
}

export function getHtmlControls() {
    const HTMLcontrols = {
        dpad: {
            left: document.getElementById('dpad_left'),
            up: document.getElementById('dpad_up'),
            right: document.getElementById('dpad_right'),
            down: document.getElementById('dpad_down'),
        },
        buttons: {
            A: document.getElementById('control_A'),
            B: document.getElementById('control_B'),
            X: document.getElementById('control_X'),
            Y: document.getElementById('control_Y'),
        },
        pauseMenu: {
            container: document.getElementById('pauseMenu'),
            resumeBtn: document.getElementById('pauseMenu_resumeBtn'),
        },
    };

    return HTMLcontrols;
}


function applyPreventsToPanel(panel) {
    panel.addEventListener("contextmenu", (event) => { event.preventDefault(); });
    const controlBlock = panel.querySelector('.ctrlblock');
    if (controlBlock) {
        // const paths = controlBlock.querySelectorAll('.control');
        // paths.forEach((path) => {
        //     console.log(path);
        //     path.addEventListener("contextmenu", (event) => {
        //         event.preventDefault();
        //     });
        // });
        controlBlock.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });
    }
}
