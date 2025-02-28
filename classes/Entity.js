import { gridCells } from "../helper/grid.js";
import { Vector2 } from "./Vector2.js";

export class Entity {
    constructor({
        name, position, isFacing, animations, texture}) {
        this.name = name ?? 'unnamed entity';
        this.position = position ?? new Vector2(gridCells(0), gridCells(0));
        this.destination = this.position.duplicate();
        this.isFacing = isFacing ?? 'down';
        this.animations = animations ?? null;
        this.texture = texture ?? null;
        // console.log(this.texture);
    }

    step(delta) {
        if(!this.animations) {
            return;
        }
        this.animations.step(delta);
        this.frame = this.animations.frame;
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

