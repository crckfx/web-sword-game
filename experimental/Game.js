import { GameControls } from "../classes/GameControls.js";
import { Renderer } from "../classes/Renderer.js";
import { getHtmlControls } from "../document.js";
import { CAMERA_CELLS_X, CAMERA_CELLS_Y, createGameGrid } from "../game.js";
import { PointerHandler } from "./PointerHandler.js";

export class Game {
    constructor() {
        //
        this.renderer = null;
        this.gameLoop = null;
        this.grid = null;
        this.textures = {};
        this.images = {};
        this.entities = {};
        this.controls = null;
        this.pointerHandler = null;
        this.keyboardHandler = null;
    }

    init_game(cellsX, cellsY, textures, images) {
        this.textures = textures;
        this.images = images;
        this.grid = createGameGrid(cellsX, cellsY);
        this.renderer = new Renderer({
            canvas: document.getElementById('game_canv'),
            ctx: document.getElementById('game_canv').getContext("2d"),
            grid: this.grid,
            cameraCellsX: CAMERA_CELLS_X,
            cameraCellsY: CAMERA_CELLS_Y,
            textures: textures,
            images: images,
            game: this,
        });
        this.controls = new GameControls({HtmlControls: getHtmlControls()});
        this.pointerHandler = new PointerHandler(this.controls);
        console.log(this.pointerHandler);
    }
}
