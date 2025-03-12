export class Vector2 {
    constructor(x=0, y=0) {
        this.overwrite(x,y);
    }

    duplicate() {
        return new Vector2(this.x, this.y);
    }

    overwrite(x, y) {
        this.x = x;
        this.y = y;
    }

}