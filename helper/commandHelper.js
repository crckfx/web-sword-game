import { player } from "../loader/world-loader.js";
import { tryInventoryMove } from "./invMenu.js";
import { tryPauseMove } from "./pauseMenu.js";
import { tryPromptMove } from "./promptMenu.js";


// aka "player presses 'A' with a valid target"
export function command_interact(game) {
    if (game.isPaused) {
        //
        if (game.pauseMenu.index === 0) game.resume();
        // 
        return;
    } else if (game.isInDialogue) {
        if (game.currentDialogue !== null)
            game.handleDialogueInteract();
    } else if (game.isInInventory) {
        game.handleInventoryInteract();
        return;
    } else {
        game.handleWorldInteract();
        return;
    }
}

// function to try a mov whenever dpad gets pressed (in case dpad);
export function command_dpad(game, direction) {

    if (direction === null) {
        game.dpadTime = 0;
        return;
    }
    if (game.isPaused) {
        const index = tryPauseMove(direction);
        if (index !== undefined) {
            console.log("ayy check out mr move in pause", index);
            // game.renderer.redrawPauseSelector();
            game.renderer.drawPauseMenu();
        }


    }
    // check and trigger inventory move if game is in inventory?
    if (game.isInInventory) {
        // console.log('yes ! in inventory and pressing a dpad on');
        if (game.isInDialogue) {
            if (game.currentDialogue.options !== null) {
                game.promptIndex = tryPromptMove(
                    direction,
                    game.currentDialogue.options.length,
                    game.promptIndex
                );
            }
            return;
        } else {
            tryInventoryMove(direction);
            return;
        }
    } else if (game.isInDialogue) {
        if (game.currentDialogue.options !== null) {
            game.promptIndex = tryPromptMove(
                direction,
                game.currentDialogue.options.length,
                game.promptIndex
            );
        }
        return;
    } else {
        // regular world case
        if (player.isFacing === direction) game.dpadTime += 150;
    }

}

// function to handle press on the BACK (B) button
export function command_back(game) {
    if (game.isPaused) {
        game.resume();
    } else if (game.isInDialogue) {
        if (game.isInInventory) {
            // handle dialogue inside of inventory
            game.exitDialogue();
        } else if (game.currentDialogueSet) {
            // handle dialogueSet outside of inventory
            if (game.currentDialogueSet.canExit)
                game.exitDialogue();
        } else {
            // handle a loaded dialogue with no set?
            // todo: implement dialogue-specific canExit?
            game.exitDialogue();
        }
    } else if (game.isInInventory) {
        game.controls.release_dpad();
        exitPlayerInventory(game);
    }
}

export function command_togglePause(game) {
    game.isPaused ? game.resume() : game.pause();
}




export function enterPlayerInventory(game) {
    if (!game.isPaused && !game.isInDialogue) {
        game.controls.release_dpad();

        game.renderer.shouldDrawPlayerInventory = true;
        game.isInInventory = true;
    }
}
export function exitPlayerInventory(game) {
    game.renderer.shouldDrawPlayerInventory = false;
    game.isInInventory = false;
    // game.controls.current_dpad_dir = null;
    player.bagCursorIndex = 0;
}
