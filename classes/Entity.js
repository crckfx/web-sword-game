import { Inventory } from "../experimental/Inventory.js";
import { gridCells } from "../helper/grid.js";
import { Item } from "./Item.js";
import { Vector2 } from "./Vector2.js";

export class Entity {
    inventory = new Array(6).fill(null);
    isSatisfied = false;
    constructor({name, position, isFacing, animations, texture, interactMessage = "Hello World!", interactCondition, interactAction, message_satisfied, dialogues}) {
        this.name = name ?? 'unnamed entity';
        this.dummyInventory = new Inventory(6, this);

        this.position = position ?? new Vector2(gridCells(0), gridCells(0));
        this.destination = this.position.duplicate();
        this.isFacing = isFacing ?? 'down';
        this.animations = animations ?? null;
        this.texture = texture ?? null;
        // console.log(this.texture);
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
        if (!(item instanceof Item)) return false;
        const invSlot = this.findFirstInventorySlot();
        if (invSlot < 0) return false;
        this.inventory[invSlot] = item;
        this.dummyInventory.putItem(item);
        // console.log(item)
        // console.log(this.inventory[invSlot]);
        return true;
    }

    findFirstInventorySlot() {
        for (let i=0; i<this.inventory.length; i++) {
            if (this.inventory[i] === null) return i;
        }
        return -1;
    }

    // function to find an item by a name in the inventory
    findInInventory(name) {
        for (let i=0; i<this.inventory.length; i++) {
            if (this.inventory[i] === null) continue;
            if (this.inventory[i].name === name) {
                return i;
            }
        }
        return -1;
    }    

    getDialogue() {
        if (this.isSatisfied) {
            return this.message_satisfied;
        } else {
            return this.interactMessage;
        }
    }
}

