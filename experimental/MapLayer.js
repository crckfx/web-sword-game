export class MapLayer {
    constructor(
        image,
        match,
        auto,
        z,
    ) {
        //
        this.image = image ?? null;
        this.match = match ?? null;
        this.auto = auto ?? true;
        this.z = z ?? 0
    }
}