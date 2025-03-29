import { Dialogue } from "../classes/dialogue/Dialogue.js";
import { SetOfDialogues } from "../classes/dialogue/SetOfDialogues.js";
import { Item } from "../classes/objects/Item.js";
import { get_dialogue_choice } from "../helper/gameHelpers.js";
import { give_item_to } from "../helper/interactions.js";
import { modifyInventoryTexture } from "../helper/invMenu.js";
import { player } from "../loader/world-loader.js";


// not yet a mission/objective class, but still a cool example of passing in an entity and getting all sides of an objective as dialogues
export function appleMission(game, entity) {
    const item = new Item({
        name: 'ticket',
        invTexture: game.images.ticket,
        description: 'A ticket to go on a boat.'
    })

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
            new Dialogue({
                heading: entity.name,
                message: "Here, take this ticket for a boat ride.",
                onFinish: function () {
                    give_item_to(game, item, player)
                    modifyInventoryTexture(game.textures.inventoryItems);
                }
            }),
            new Dialogue({
                heading: "Inventory",
                message: `Received "ticket" from ${entity.name}.`,
            }),
            new Dialogue({
                heading: entity.name,
                message: "You can use this to travel to the next level.",
                onFinish: function () {
                    console.log('successfully ran an onfinished at the END of a SetOfDialogues');
                }
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
                                    console.log(`could not give ${item.name} to ${name}?`);
                                }

                            },
                            // 3. the 'no' function
                            function () {
                                game.exitDialogue();
                                game.launch_single_dialogue(new Dialogue({
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