import { gridCells } from "../helper/grid.js";
import { Vector2 } from "./Vector2.js";

export class Player {
    constructor({name, position, isFacing, animations, texture}) {
        this.name = name ?? 'unnamed player';
        this.position = position ?? new Vector2(0, 0);
        this.destination = position.duplicate();
        this.isFacing = isFacing ?? 'down';
        this.animations = animations ?? null;
        this.texture = this.texture;
    }

    step(delta) {
        if(!this.animations) {
            return;
        }
        this.animations.step(delta);
        this.frame = this.animations.frame;
        // console.log(this.frame)
    }

    getSpriteIndex() {
        switch (this.isFacing) {
            case 'down': return 0;
            case 'left': return 8;
            case 'up': return 16;
            case 'right': return 24;
        }
    }

    getEntitySprite() {
        return this.texture[this.getSpriteIndex()];
    }        
}

