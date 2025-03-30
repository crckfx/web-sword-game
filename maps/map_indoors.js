import { Vector2 } from "../classes/Vector2.js";

export const map_indoors = {

    entityData: {
        player: {
            cellCoord: new Vector2(null, null),
            isFacing: 'Up',
        },
    },


    occupants:
        `   .........
            .........
            .........
            .........
            .........
            ....P....
            ....D....`,

    floors: [
        {
            match: 'water',
            imageName: 'water',
            auto: false,
            z: 0,
            layout:
                `   wwwwwwwww
                    wwwwwwwww
                    wwwwwwwww
                    wwwwwwwww
                    wwwwwwwww
                    wwwwwwwww
                    wwwwwwwww`,
        },        
        {
            match: 'island',
            imageName: 'island',
            auto: true,
            z: 0,
            layout:
                `   .........
                    .iiiiiii.
                    .iiii.i..
                    .iiiiiii.
                    ...iiii..
                    ....i.ii.
                    ....i.i..`,
        },

        
    ],

}