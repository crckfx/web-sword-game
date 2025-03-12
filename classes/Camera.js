import { Vector2 } from "./Vector2.js";
import { cell_size } from "../document.js";

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
        return x >= this.pos.x - cell_size.x && 
            x < this.pos.x + this.size.x &&
            y >= this.pos.y - cell_size.y && y < this.pos.y + this.size.y;
    }
}
