import { Item } from "./Item.js";

export class Inventory {
    name = 'unnamed inventory';
    constructor(size = 6, owner = null, name = null) {
        this.slots = new Array(size).fill(null);
        this.owner = owner;
        if (name !== null) {
            this.name = name;
        } else if (owner !== null && owner.name) {
            this.name = `${owner.name}'s inventory`;
        }   
    }
    

    findFirstAvailableSlot() {
        for (let i=0; i<this.slots.length; i++) {
            if (this.slots[i] === null) return i;
        }
        return -1;
    }

    // function to find an item by a name in the inventory
    findSlotByName(name) {
        for (let i=0; i<this.slots.length; i++) {
            if (this.slots[i] === null) continue;
            if (this.slots[i].name === name) {
                return i;
            }
        }
        return -1;
    }

    findSlotByItem(item) {
        for (let i=0; i<this.slots.length; i++) {
            if (this.slots[i] === null) continue;
            if (this.slots[i] === item) {
                return i;
            }
        }
        return -1;
    }        

    putItem(item) {
        // 
        // console.log("hello from putitem")
        if (!(item instanceof Item)) return false;
        const invSlot = this.findFirstAvailableSlot();
        // console.log(invSlot)
        if (invSlot < 0) return false;
        this.slots[invSlot] = item;
        console.log(`put item ${item.name} into ${this.name}`);
        item.isHeldBy = this.owner;
        return true;
    }

    removeItem(index) {
        if (!(this.slots[index] instanceof Item)) return false;
        const item = this.slots[index];
        item.isHeldBy = null;
        this.slots[index] = null;
        return true;
    }

    getContentsAsString() {
        let str = `${this.name}: `;
        for (let i = 0; i < this.slots.length; i++) {
            if (this.slots[i] !== null) {
                str += `${i}: ${this.slots[i].name}, `;
            }
        }
        return str;
    }

}