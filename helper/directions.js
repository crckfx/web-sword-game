import { Vector2 } from "../classes/Vector2.js";

export function direction_to_1D(direction) {
    if (direction === 'left' || direction === 'up') {
        return -1;
    } else if (direction === 'right' || direction === 'down') {
        return 1;
    } else {
        return 0;
    }
}


export function direction_to_2D(direction) {
    switch (direction) {
        case 'left': return new Vector2(-1, 0);
        case 'up': return new Vector2(0, -1);
        case 'right': return new Vector2(1, 0);
        case 'down': return new Vector2(0, 1);
        default: return new Vector2(0, 0);
    }
}
