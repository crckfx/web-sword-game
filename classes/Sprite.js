import { GameObject } from "./GameObject";
import { Vector2 } from "../classes/Vector2";

export class Sprite extends GameObject {
    constructor({
        resource,   // image to draw
        frameSize,  // size per sprite cell
        hFrames,    // how many columns in the spritesheet
        vFrames,    // how many rows in the spritesheet
        frame,      // which frame to draw
        scale,      // useless for now
        position,   // where on the grid to draw
        animations,
    }) {
        super({
            position: position ?? new Vector2(0, 0),
        });
        this.resource = resource;
        this.frameSize = frameSize ?? new Vector2(16, 16);
        this.hFrames = hFrames ?? 1;
        this.vFrames = vFrames ?? 1;
        this.frame = frame ?? 0;
        this.frameMap = new Map();
        this.scale = scale ?? 1;
        // this.position = position ?? new Vector2(0, 0);
        this.animations = animations ?? null;
        this.buildFrameMap();
    }


    buildFrameMap() {
        let frameCount = 0;
        for (let v = 0; v < this.vFrames; v++) {
            for (let h = 0; h < this.hFrames; h++) {
                console.log("frame", h, v);
                
            }
        }
    }

}