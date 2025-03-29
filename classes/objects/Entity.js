import { Inventory } from "../Inventory.js";
import { cellCoords, gridCells } from "../../helper/grid.js";
import { Item } from "./Item.js";
import { Vector2 } from "../Vector2.js";
import { direction_to_2D } from "../../helper/directions.js";
import { GameObject } from "./GameObject.js";

export class Entity extends GameObject {
    isSatisfied = false;
    frame = 0;
    constructor({
        name,
        position,
        isFacing,
        animations,
        texture,
        interactMessage = "Hello World!",
        interactCondition,
        interactAction,
        message_satisfied,
        dialogues
    }) {
        super({position: position ?? new Vector2(gridCells(0), gridCells(0))})
        this.name = name ?? 'unnamed entity';
        this.bag = new Inventory(6, this);

        // this.position = position ?? new Vector2(gridCells(0), gridCells(0));
        this.destination = this.position.duplicate();
        this.isFacing = isFacing ?? 'Down';
        this.animations = animations ?? null;
        this.texture = texture ?? null;
        this.interactMessage = interactMessage;
        this.interactCondition = interactCondition ?? null;
        this.interactAction = interactAction ?? null;
        this.message_satisfied = message_satisfied ?? null;

        this.dialogues = dialogues ?? null;
    }

    step(delta) {
        if (!this.animations) {
            return;
        }
        this.animations.step(delta);
        this.frame = this.animations.frame;
    }


    getSpriteIndex() {
        switch (this.isFacing) {
            // the number is an index for an array of sprites (an unpacked spritesheet) 
            // this number serves as a base, and is offset by animations
            case 'Down': return 0;
            case 'Left': return 8;
            case 'Up': return 16;
            case 'Right': return 24;
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


    getFacingCell() {
        const facingVector = direction_to_2D(this.isFacing);
        const sightVector = new Vector2(
            facingVector.x + cellCoords(this.position.x),
            facingVector.y + cellCoords(this.position.y)
        );
        return sightVector;
    }
}

