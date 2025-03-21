import { CELL_PX } from "../document.js";
import { cellCoords } from "./grid.js";

export function give_item_to(game, item, entity, otherGrid) {
    if (item.isHeldBy !== null) {       // if somebody is holding item
        const oldEntity = item.isHeldBy;
        const oldIndex = oldEntity.bag.findSlotByItem(item);
        console.log(`remove ${item.name} from ${oldEntity.name} slot ${oldIndex}`)
        if (oldIndex > -1) {
            oldEntity.bag.removeItem(oldIndex);
        }
        console.log(`${item.name} is now held by ${(item.isHeldBy !== null) ? item.isHeldBy.name : "nobody"}`)
    } else if (item.position !== null) { // if the item has a world position
        remove_item_from_cell(game, item)
    }
    entity.receiveItem(item);
    // console.log(`${item.name} is now held by ${(item.isHeldBy !== null) ? item.isHeldBy.name : "nobody"}`)
    return true;
}

export function remove_item_from_cell(game, item) {
    const posX = item.position.x;
    const posY = item.position.y;
    const gridX = cellCoords(posX);
    const gridY = cellCoords(posY);

    const grid = game.otherGrid;
    if (grid[gridY] && grid[gridY][gridX]) {
        console.log(`should probably remove item from map at '${gridX},${gridY}'`)
        // hopefully grab the correct drawkit for this :)
        const texture = game.renderer.drawKit.floors;
        texture.ctx.clearRect(posX, posY, CELL_PX, CELL_PX);
        // now we need to slice out `game.textures.mapFloor.floorOnly` at this same position and draw it at this same position
        texture.ctx.drawImage(texture.floorsOnly,
            posX, posY, CELL_PX, CELL_PX,
            posX, posY, CELL_PX, CELL_PX
        )
        item.position = null;
        grid[gridY][gridX].occupant = null;
    } else {
        console.warn(`oh no, item doesn't exist at '${x},${y}'`)
    };    
}