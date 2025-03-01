import { gridCells } from "../helper/grid.js";
import { Vector2 } from "./Vector2.js";

export class Entity {
    constructor({name, position, isFacing, animations, texture, interactMessage = "Hello World!",}) {
        this.name = name ?? 'unnamed entity';
        this.position = position ?? new Vector2(gridCells(0), gridCells(0));
        this.destination = this.position.duplicate();
        this.isFacing = isFacing ?? 'down';
        this.animations = animations ?? null;
        this.texture = texture ?? null;
        // console.log(this.texture);
        this.interactMessage = interactMessage;

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
            // the number is an index for an array of sprites (an unpacked spritesheet) 
            // this number serves as a base, and is offset by animations
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

