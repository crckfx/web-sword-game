import { Inventory } from "./Inventory.js";
import { gridCells } from "../helper/grid.js";
import { Item } from "./Item.js";
import { Vector2 } from "./Vector2.js";

export class Entity {
    isSatisfied = false;
    constructor({name, position, isFacing, animations, texture, interactMessage = "Hello World!", interactCondition, interactAction, message_satisfied, dialogues}) {
        this.name = name ?? 'unnamed entity';
        this.bag = new Inventory(6, this);

        this.position = position ?? new Vector2(gridCells(0), gridCells(0));
        this.destination = this.position.duplicate();
        this.isFacing = isFacing ?? 'down';
        this.animations = animations ?? null;
        this.texture = texture ?? null;
        this.interactMessage = interactMessage;
        this.interactCondition = interactCondition ?? null;
        this.interactAction = interactAction ?? null;
        this.message_satisfied = message_satisfied ?? null;
        
        this.dialogues = dialogues ?? null;
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

    receiveItem(item) {
        if (!(item instanceof Item)) return false;;
        return this.bag.putItem(item);
    }


    getDialogue() {
        if (this.isSatisfied) {
            return this.message_satisfied;
        } else {
            return this.interactMessage;
        }
    }
}

