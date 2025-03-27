import { cellCoords } from "./grid.js";
import { player } from "./world-loader.js";

export function log_entity_position(e) {
    if (e === undefined) e = player;
    console.log(
        e.name,
        cellCoords(e.position.x),
        cellCoords(e.position.y),
    );
}

export function log_relevant_inventory() {
    let t;
    if (player.interactTarget !== null) {
        console.log(`INVENTORY THING: interact target is uh ${player.interactTarget.name}`)
        t = player.interactTarget;
    } else {
        t = player;
    }
    return t.bag.getContentsAsString();
}

// for when an image is created and we want to save it
export function saveCanvasAsPNG(canvas, filename = "canvas.png") {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = filename;
    link.click();
}