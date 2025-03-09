import { Vector2 } from "../classes/Vector2.js";

export class GameObject {
    constructor({position}) {
        this.position = position ?? new Vector2(0,0);
        this.children = [];
    }


    stepEntry(delta, root) {
        //
        this.children.forEach((child) => child.stepEntry(delta, root));

        this.step(delta, root);

    }

    step(_delta) {
        //
    }

    draw(ctx, x, y) {
        const drawPosX = x + this.position.x;
        const drawPosY = y + this.position.y
        
        this.drawImage(ctx, drawPosX, drawPosY);

        this.children.forEach((child) => child.draw(ctx, drawPosX, drawPosY));
    }

    addChild(gameObject) {
        this.children.push(gameObject);
    }

    removeChild(gameObject) {
        this.children = this.children.filter(g => {
            return gameObject !== g;
        })
    }
}