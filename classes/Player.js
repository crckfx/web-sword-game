import { gridCells } from "../helper/grid.js";
import { Item } from "./Item.js";
import { Vector2 } from "./Vector2.js";
import { Inventory } from "./Inventory.js";
import { GameObject } from "../experimental/GameObject.js";

export class Player extends GameObject {
    bagCursorIndex = 0;
    interactTarget = null;
    bag = new Inventory(12, this, 'best inventory');
    
    constructor({name, position, isFacing, animations, texture, speed}) {
        super({
            position: position ?? new Vector2(0, 0),

        });

        this.name = name ?? 'unnamed player';
        this.destination = position.duplicate();
        this.isFacing = isFacing ?? 'down';
        this.animations = animations ?? null;
        this.texture = texture;
        this.speed = speed ?? 1;
       
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
    
    receiveItem(item) {
        if (!(item instanceof Item)) return false;
        return this.bag.putItem(item);
    }
    releaseItem(item) {
        if (!(item instanceof Item)) return false;
        const index = this.bag.findSlotByItem(item);
        if (index < 0) return false;
        return this.bag.removeItem(index);
    }

}

