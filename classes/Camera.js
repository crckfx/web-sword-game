import { Vector2 } from "./Vector2.js";
import { CELL_PX } from "../document.js";

export class Camera {
    pos = new Vector2(0,0);
    size = new Vector2(0,0);
    constructor() {}

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
        0,0,this.size.x,this.size.y
    }

    isInBounds(x, y) {
        return x >= this.pos.x - CELL_PX && 
            x < this.pos.x + this.size.x &&
            y >= this.pos.y - CELL_PX && y < this.pos.y + this.size.y;
    }
}
