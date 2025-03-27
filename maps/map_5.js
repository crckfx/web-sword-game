import { Vector2 } from "../classes/Vector2.js";

export const map_5 = {
    entityData: {
        player: {
            cellCoord: new Vector2(null, null),
            isFacing: 'right',
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
    occupants:
        `   ttttttt.....f........tt........
            ttttttt.....f........tt........
            ttttttt.....f........tt........
            tttttttTTt.tff.......tttt......
            .........t.t.fffftt....tt......
            ttttttt..........tt............
            ttttttttTTf.........tt.........
            tttttttt..ff..03..tttt.........
            ttttttt....f......tt...........
            ttttttt....f.........tt........
            tttttt2....f........tttt.......
            ttttttt....f........tttt.......
            ttttttt....f.........tt........
            TTTTTTT..............tt........
            TTTTTTT........................
            ...............................
            ...............................
            ...............................
            ..........T......T...t.t.......
            .....................t.t.......
            ........T......................
            ..........T....................
            ........T......................
            ........T.......TT.............
            ........T........T.............
            ........T........T.............
            ........T.......TT........1....
            ........T.......TT.......i..a..
            .........T.....T...............
            .........T..P..T...............
            ..........T.B.T................
            ...............................
            ...............................
            ...............................
            ...............................
            ...............................
            ...............................`,
    floors: [
        {
            match: 'water',
            imageName: 'water',
            auto: false,
            z: 0,
            layout:
                `   ..........................wwwww
                    ..........................wwwww
                    ..........................wwwww
                    ..........................wwwww
                    ..........................wwwww
                    ..........................wwwww
                    ..........................wwwww
                    ..........................wwwww
                    ..........................wwwww
                    ..........................wwwww
                    ...........................wwww
                    ..........................wwwww
                    ...........................wwww
                    ...........................wwww
                    ........ww..................www
                    ........www.................www
                    ........ww..................www
                    ............................www
                    .............................ww
                    .............................ww
                    ...............................
                    ...............................
                    ...............................
                    ....................ww.ww......
                    ....................ww.wwwwwwww
                    ...................www.wwwwwwww
                    ....................ww.www..www
                    ...................www.ww....ww
                    ...................www.ww...www
                    ...................www.....wwww
                    ...........www......wwwwwwwwww.
                    ...........www......wwwwwwwwwww
                    ...........www......wwwwwwwwwww
                    ...........www......wwwwwwwwwww
                    ...........www......wwwwwwwwwww
                    ...........www......wwwwwwwwwww
                    ...........www......wwwwwwwwwww`,
        },

        {
            match: 'grass',
            imageName: 'grassDirt',
            auto: true,
            z: 0,
            layout:
                `   ..........gggggggggggggggg.....
                    ..........gggggggggggggggg.....
                    ..........gggggggggggggggg.....
                    ..........gggggggggggggggg.....
                    .......ggggggggggggggggggg.....
                    .......ggggggggggggggggggg.....
                    .......ggggggggggggggggggg.....
                    .......ggggggggggggggggggg.....
                    .......ggggggggggggggggggg.....
                    .......ggggggggggggggggggg.....
                    ggggggggggggggggggggggggggg....
                    gggggggggggggggggggggggggg.....
                    ggggggggggggggggggggggggggg....
                    ggggggggggggggggggggggggggg....
                    gggggggg..gggggggggggggggggg...
                    gggggggg...ggggggggggggggggg...
                    gggggggg..gggggggggggggggggg...
                    gggggggggggggggggggggggggggg...
                    ggggggggggggggggggggggggggggg..
                    ggggggggggggggggggggggggggggg..
                    ggggggggggggggggggggggggggggggg
                    ggggggggggggggggggggggggggggggg
                    ggggggggggggggggggggggggggggggg
                    gggggggggggggggggggg..g..gggggg
                    gggggggggggggggggggg..g........
                    ggggggggggggggggggg...g........
                    gggggggggggggggggggg..g...gg...
                    ggggggggggggggggggg...g..gggg..
                    ggggggggggggggggggg...g..ggg...
                    ggggggggggggggggggg...ggggg....
                    ggggggggggg...gggggg..........g
                    ggggggggggg...gggggg...........
                    ggggggggggg...gggggg...........
                    ggggggggggg...gggggg...........
                    ggggggggggg...gggggg...........
                    ggggggggggg...gggggg...........
                    ggggggggggg...gggggg...........`,
        },
        {
            match: 'grass2',
            imageName: 'grass2',
            auto: false,
            z: 0,
            layout:
                `   GGGGGGGGGG........GGGGGG.......
                    GGGGGGGGGG........GGGGGG.......
                    GGGGGGGGGG........GGGGGG.......
                    GGGGGGGGGG........GGGGGG.......
                    GGGGGGGGGG........GGGGGG.......
                    GGGGGGGGGG........GGGGGG.......
                    GGGGGGGGGG........GGGGGG.......
                    GGGGGGGGGG........GGGGGG.......
                    GGGGGGGG..........GGGGGG.......
                    GGGGGGG........................
                    GGGGGGG........................
                    GGGGGGG........................
                    GGGGGGG........................
                    GGGGGGG........................
                    GGGGGGG........................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ..............G................
                    ..........G...GG...............
                    ..........G...GG...............
                    ..........G...G................
                    ..........G...G................
                    ..........G...G................
                    ..........G...G................
                    ..........G...G................
                    ..........G...G................
                    ..........G...G................
                    ..........G...G................`,
        },        
        {
            match: 'dirt',
            imageName: 'dirtGrass',
            auto: true,
            z: 1,
            layout:
                `   ............dddddd......d......
                    ............dddddd......d......
                    ............dddddd......d......
                    ............dddddd......d......
                    ............dddddd......d......
                    ............dddddd......d......
                    ...........ddddddd......d......
                    ............dddddd......d......
                    ............dddddd......d......
                    ............ddddd.......d......
                    ............ddddd.......d......
                    ............ddddd..............
                    ............dddddd.............
                    ............dddddd.............
                    ............dddddd.............
                    ............dddddd.............
                    ............dddddd.............
                    ...........ddddddd.............
                    ...........dddddd..............
                    ...........dddddd..............
                    ...........dddddd..............
                    ...........ddddd...............
                    ...........ddddd...............
                    ...........ddddd...............
                    ...........ddddd...............
                    ...........ddddd...............
                    ...........ddddd...............
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................`,
        },
        {
            match: 'sand',
            imageName: 'sandGrass',
            auto: true,
            z: 0,
            layout:

                `   .......................sss.....
                    ..ssss.................sss.....
                    ..ssss.................sss.....
                    ..s.ss.................sss.....
                    ssssssss...............sss.....
                    .......s...............sss.....
                    .......s...............sss.....
                    ......ss...............sss.....
                    ......ss...............sss.....
                    ........................ss.....
                    ........................sss....
                    ........................ss.....
                    .........................ss....
                    ........................sss....
                    ........................ssss...
                    ........................ssss...
                    .........................sss...
                    ..........................ss...
                    ..........................sss..
                    ............................s..
                    ......................s.sssssss
                    .....................ssssssssss
                    ...................ssssssssssss
                    ...................s..s..ssssss
                    ..................ss..s........
                    ..................s...s........
                    ..................ss..s...ss...
                    ..................s...s..ssss..
                    ..................s...s..sss...
                    ..................s...sssss....
                    ..................ss..........s
                    ..................ss...........
                    ..................ss...........
                    ..................ss...........
                    ..................ss...........
                    ..................ss...........
                    ..................ss...........`,
        },
        {
            match: 'dirt',
            imageName: 'dirtSand',
            auto: true,
            z: 1,
            layout:
                `   ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ........................ddddd..
                    ..........................ddd..
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................`,
        },

        {
            match: 'road',
            imageName: 'stoneDirt',
            auto: true,
            z: 0,
            layout:
                `   ..............rr...............
                    ..............rr...............
                    ..............rr...............
                    ..............rr...............
                    ..............rr...............
                    ..............rr...............
                    ..............rr...............
                    ..............rr...............
                    ..............rr...............
                    .............rrr...............
                    .............rr................
                    .............rr................
                    .............rr................
                    .............rrr...............
                    .............rrr...............
                    .............rrr...............
                    .............rrr...............
                    ............rrrr...............
                    ............rrr................
                    ............rrr................
                    ............rrr................
                    ...........rrr.................
                    ...........rrr.................
                    ...........rrr.................
                    ...........rrr.................
                    ...........rrr.................
                    ...........rrr.................
                    ...........rrr.................
                    ...........rrr.................
                    ...........rrr.................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................
                    ...............................`,
        },
    
        {
            match: 'dirt',
            imageName: 'dirtGrass',
            auto: true,
            z: 1,
            layout:
                `   ..........d.
                    .........dd.
                    ............
                    ............
                    ............
                    ............
                    .ddd........
                    .ddd........
                    .ddd........
                    ............`,
            auto: true,
        }
    ],

    paths:
        `   .........
            .........
            .........
            .........
            .........
            .........
            .........
            .........
            .........
            .........`,


}
