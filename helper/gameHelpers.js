import { Dialogue } from "../classes/interactions/Dialogue.js";
import { DialogueOption } from "../classes/interactions/DialogueOption.js";
import { SetOfDialogues } from "../classes/interactions/SetOfDialogues.js";
import { cellCoords, compare_two_vec2 } from "./grid.js";
import { give_item_to } from "./interactions.js";
import { modifyInventoryTexture } from "./invMenu.js";
import { player } from "./world-loader.js";

// dialogues
// --------------------
export function get_dialogue_choice(message = "yes or no?", yes = null, no = null, heading) {
    return new Dialogue({
        heading: heading ?? null,
        message: message,
        options: [
            new DialogueOption("Yes", () => yes()),
            new DialogueOption("No", () => no()),
        ],
    })
}

export function get_dialogue_entity(e) {
    const d = e.getDialogue();
    // if 'd' is a SetOfDialogues, we should return that set
    if (d instanceof SetOfDialogues)
        return d;

    // otherwise, we'll assume d is a message & return a DIALOGUE
    return new Dialogue({
        heading: e.name,
        message: d,
    })
}
export function get_dialogue_pickup(item) {
    return new Dialogue({
        heading: item.name,
        message: `Picked up ${item.name}.`,
    })
}

export function get_dialogue_inventory(game, item) {
    //
    return new Dialogue({
        heading: item.name,
        message: item.description,
        options: [
            new DialogueOption("Okay", game.exitDialogue.bind(game)),
            new DialogueOption("Exit", () => {
                game.exitDialogue();
                game.exitPlayerInventory();
            }),
        ],
    })
}
// --------------------

// interactions
// --------------------
// can we get 'player' out of here?
export function worldInteract_Item(game, t) {
    
    const x = cellCoords(t.position.x);
    const y = cellCoords(t.position.y)

    const grid = game.grid;
    if (grid[y] && grid[y][x]) {
        // console.log(`take item from ${x}, ${y}`);
        if (give_item_to(game, t, player)) {
            modifyInventoryTexture(game.textures.inventoryItems);
            player.interactTarget = null;
            game.launch_single_dialogue(get_dialogue_pickup(t), t);
        };
    }

}


export function worldInteract_Entity(game, t) {
    // ** handle conditions ** (a basic prototype)
    // check 1. a condition exists and 2. it is not already satisfied
    player.interactTarget.isFacing = compare_two_vec2(player.position, t.position);
    if (t.interactCondition !== null && t.isSatisfied === false) {
        // check the (currently unsatisfied) condition
        const conditionIsMet = t.interactCondition() > -1; // assume an interact condition uses a number??? todo: smooth out
        // console.log(`interact condition: ${conditionIsMet}`)
        if (conditionIsMet) {
            if (t.interactAction()) {
                t.isSatisfied = true;
            };
            return;
        }
    } // ** END handle conditions **
    const d = get_dialogue_entity(t);
    // display the dialogue box
    if (d instanceof Dialogue) {
        game.launch_single_dialogue(d, t)

    } else if (d instanceof SetOfDialogues) {
        game.launch_set_of_dialogues(d);
    }
}

// --------------------
