import { Vector2 } from "../classes/Vector2.js";

export const map_island = {

    entityData: {
        player: {
            cellCoord: new Vector2(null, null),
            isFacing: 'Up',
        },
        gary: {
            cellCoord: new Vector2(null, null),
            isFacing: 'Up',
        },
        fred: {
            cellCoord: new Vector2(null, null),
            isFacing: 'Up',
        },
        george: {
            cellCoord: new Vector2(null, null),
            isFacing: 'Up',
        },
        harold: {
            cellCoord: new Vector2(null, null),
            isFacing: 'Up',
        },
    },


    occupants:
        `   ................
            ................
            ................
            ................
            .......01.......
            .........2......
            .......P........
            ................
            ................
            ................
            ................
            ................`,

    floors: [
        {
            match: 'water',
            imageName: 'water',
            auto: false,
            z: 0,
            layout:
                `   wwwwwwwwwwwwwwww
                    wwwwwwwwwwwwwwww
                    wwwwwwwwwwwwwwww
                    wwwwwwwwwwwwwwww
                    wwwwwwwwwwwwwwww
                    wwwwwwwwwwwwwwww
                    wwwwwwwwwwwwwwww
                    wwwwwwwwwwwwwwww
                    wwwwwwwwwwwwwwww
                    wwwwwwwwwwwwwwww
                    wwwwwwwwwwwwwwww
                    wwwwwwwwwwwwwwww`,
        },        
        {
            match: 'island',
            imageName: 'island',
            auto: true,
            z: 0,
            layout:
                `   .iii..i.........
                    ...iiiiiiiii....
                    ...iiiii.i.i..i.
                    ...iiiiiiiiiiii.
                    ...i..iiii.i.ii.
                    ...i..ii.iiiiii.
                    ...iiiiiiiii..i.
                    ...iiiiiiiii..i.
                    ...iiiii.ii.....
                    ...iiiii.ii.....
                    .......iiiiii...
                    ................`,
        },

        
    ],

}