import { Dialogue } from "../classes/interactions/Dialogue.js";
import { SetOfDialogues } from "../classes/interactions/SetOfDialogues.js";
import { get_dialogue_choice } from "../helper/gameHelpers.js";
import { give_item_to } from "../helper/interactions.js";
import { modifyInventoryTexture } from "../helper/invMenu.js";
import { player } from "../helper/world-loader.js";


// not yet a mission/objective class, but still a cool example of passing in an entity and getting all sides of an objective as dialogues
export function appleMission(game, entity) {
    const name = entity.name;
    const dialogues_finished = new SetOfDialogues({
        dialogues: [
            new Dialogue({
                heading: "Inventory",
                message: `gave ${name} an apple.`,
            }),

            new Dialogue({
                heading: name,
                message: entity.message_satisfied,
            }),
        ],
        // no heading, because the set specifies Dialogue-specific headings
        canExit: false,
    });

    game.launch_set_of_dialogues(
        new SetOfDialogues(
            // include the interact ones
            {
                dialogues: 
                [
                    ...entity.interactMessage.dialogues, // use any existing dialogues first ("have you seen my apple?" etc.)
                    // then define the a choice dialogue
                    get_dialogue_choice(
                        `Give ${name} an apple?`,   // 1. the body message
                        // 2. the 'yes' function
                        function () {
                            const index = player.bag.findSlotByName('apple');
                            console.log(`index is ${index}`)
                            const item = player.bag.slots[index];
                            if (give_item_to(game, item, entity)) {
                                // update inventory texture
                                modifyInventoryTexture(game.textures.inventoryItems);
                                entity.isSatisfied = true;
                                game.exitDialogue();
                                game.launch_set_of_dialogues(dialogues_finished);
                            } else {
                                console.log("could not give to the fred?");
                            }
    
                        },
                        // 3. the 'no' function
                        function () {
                            game.exitDialogue();
                            game.launch_a_dialogue(new Dialogue({
                                heading: name,
                                message: "Come on man, let me hold something!"
                            }));
                        },
                        'Inventory', // 4. the heading
                    ),
                ],
                heading: '(FRED) CHECK', // obsolete? or not implemented properly?
                canExit: false // cannot exit this dialogue
            }
        ),
    );
}