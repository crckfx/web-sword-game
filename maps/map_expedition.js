import { Vector2 } from "../classes/Vector2.js";

export const map_expedition = {

    entityData: {
        player: {
            cellCoord: new Vector2(null, null),
            isFacing: 'up',
        },
        gary: {
            cellCoord: new Vector2(null, null),
            isFacing: 'up',
        },
        fred: {
            cellCoord: new Vector2(null, null),
            isFacing: 'up',
        },
        george: {
            cellCoord: new Vector2(null, null),
            isFacing: 'up',
        },
        harold: {
            cellCoord: new Vector2(null, null),
            isFacing: 'up',
        },
    },

    floors: [
        {
            match: 'water',
            auto: false,
            z: 0,
            layout:
                `   wwwwwwwwwwwwwwww
                    wwwwwwwwwwwwwwww
                    ww............ww
                    ww............ww
                    ww............ww
                    ww............ww
                    ww............ww
                    ww............ww
                    ww............ww
                    ww............ww
                    wwwwwwwwwwwwwwww
                    wwwwwwwwwwwwwwww`,
        },
        {
            match: 'grass2',
            auto: false,
            z: 0,
            layout:
                `   ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................
                    ................`,
        },
        {
            match: null,
            auto: false,
            z: 0,
            layout:
                `.`,
        },
        {
            match: null,
            auto: false,
            z: 0,
            layout:
                `.`,
        },
        {
            match: 'dirt',
            auto: true,
            z: 0,
            layout:
                `   ................
                    ................
                    ..dddddddddddd..
                    ..dddddddddddd..
                    ..dddddddddddd..
                    ..dddddddddddd..
                    ..dddddddddddd..
                    ..dddddddddddd..
                    ..dddddddddddd..
                    ..dddddddddddd..
                    ................
                    ................`,
        },
        {
            match: 'road',
            auto: true,
            z: 0,
            layout:
                `   ................
                    ................
                    ................
                    ....rrrrrrrr....
                    ....rrrrrrrr....
                    ....rrr..rrr....
                    ....rrr..rrr....
                    ....rrrrrrrr....
                    ....rrrrrrrr....
                    ................
                    ................
                    ................`,
        },
    ],
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
}