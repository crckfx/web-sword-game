import { Vector2 } from "../classes/Vector2.js";

export function direction_to_1D(direction) {
    switch (direction) {
        case 'Left': case 'Up':
            return -1;
        case 'Right': case 'Down':
            return 1;
        default:
            return 0;
    }
}


export function direction_to_2D(direction) {
    switch (direction) {
        case 'Left': return new Vector2(-1, 0);
        case 'Up': return new Vector2(0, -1);
        case 'Right': return new Vector2(1, 0);
        case 'Down': return new Vector2(0, 1);
        default: return new Vector2(0, 0);
    }
}
