import { FLOOR_CELL_PIXELS } from "../document.js";
import { cellCoords } from "./grid.js";

export function give_item_to(grid, item, entity, texture) {
    if (item.isHeldBy !== null) {       // if somebody is holding item
        const oldEntity = item.isHeldBy;
        const oldIndex = oldEntity.bag.findSlotByItem(item);
        console.log(`remove ${item.name} from ${oldEntity.name} slot ${oldIndex}`)
        if (oldIndex > -1) {
            oldEntity.bag.removeItem(oldIndex);
        }
        console.log(`${item.name} is now held by ${(item.isHeldBy !== null) ? item.isHeldBy.name : "nobody"}`)
    } else if (item.position !== null) { // if the item has a world position
        const posX = item.position.x;
        const posY = item.position.y;
        const gridX = cellCoords(posX);
        const gridY = cellCoords(posY);
        if (grid[gridX] && grid[gridX][gridY]) {
            console.log(`should probably remove item from map at '${gridX},${gridY}'`)
            const replaceCtx = texture.getContext('2d');
            // console.log(replaceCtx)
            replaceCtx.clearRect(posX, posY, FLOOR_CELL_PIXELS, FLOOR_CELL_PIXELS);
            item.position = null;
            grid[gridX][gridY].occupant = null;
        } else {
            console.warn(`oh no, item doesn't exist at '${x},${y}'`)
        };
    }
    // console.log(`giving item '${item.name}' to '${entity.name}'`)

    entity.receiveItem(item);
    console.log(`${item.name} is now held by ${(item.isHeldBy !== null) ? item.isHeldBy.name : "nobody"}`)

    return true;
}