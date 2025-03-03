import { gridCells } from "../helper/grid.js";
import { Item } from "./Item.js";
import { Vector2 } from "./Vector2.js";

export class Player {
    interactTarget = null;
    inventory = new Array(12).fill(null);
    constructor({name, position, isFacing, animations, texture}) {
        this.name = name ?? 'unnamed player';
        this.position = position ?? new Vector2(0, 0);
        this.destination = position.duplicate();
        this.isFacing = isFacing ?? 'down';
        this.animations = animations ?? null;
        this.texture = texture;
        this.speed = 2;
        // this.inventoryTexture = 
        // for (let i=0; i<this.inventory.length; i++) {
        //     this.inventory[i] = null;
        // }
        
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
    
    receiveItem(item) {
        if (!(item instanceof Item)) return false;
        const invSlot = this.findFirstInventorySlot();
        if (invSlot < 0) return false;
        this.inventory[invSlot] = item;
        console.log(item)
        console.log(this.inventory[invSlot]);
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

    findInInventoryByItem(item) {
        for (let i=0; i<this.inventory.length; i++) {
            if (this.inventory[i] === null) continue;
            if (this.inventory[i] === item) {
                return i;
            }
        }
        return -1;
    }    
}

