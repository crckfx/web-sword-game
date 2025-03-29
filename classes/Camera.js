import { Vector2 } from "./Vector2.js";
import { CAMERA_CELLS, CELL_PX } from "../document.js";
import { gridCells } from "../helper/grid.js";

export class Camera {
    pos = new Vector2(0, 0);
    size = new Vector2(0, 0);
    constructor() {
        this.middleCell = new Vector2(
            gridCells((CAMERA_CELLS.x - 1) / 2),
            gridCells((CAMERA_CELLS.y - 1) / 2),
        )
    }

    // updateSize(w, h) {
    //     this.size.overwrite(w, h);
    // }

    // updatePos(x,y) {
    //     this.pos.overwrite(x,y);
    // }
    getRect() {
        return this.pos.x, this.pos.y, this.size.x, this.size.y
    }

    getFullCoords() {
        return this.pos.x, this.pos.y, this.size.x, this.size.y,
            0, 0, this.size.x, this.size.y
    }

    isInBounds(x, y) {
        return x >= this.pos.x - CELL_PX &&
            x < this.pos.x + this.size.x &&
            y >= this.pos.y - CELL_PX && y < this.pos.y + this.size.y;
    }

    centreOn(x, y) {
        this.pos.overwrite(x - this.middleCell.x, y - this.middleCell.y);
    }
}
