export function createDrawKit(mapLayers, mapWidthPx, mapHeightPx) {
    const dkCanv_floor = document.createElement('canvas');
    dkCanv_floor.width = mapWidthPx;
    dkCanv_floor.height = mapHeightPx;

    // create the drawKit object
    const levelDrawKit = {
        // wadders = new idea to extend the drawKit
        wadders: [
            newCanvasPair(mapWidthPx, mapHeightPx),
            newCanvasPair(mapWidthPx, mapHeightPx),
            newCanvasPair(mapWidthPx, mapHeightPx),
        ],

        floors: {
            storedFloor: newCanvasPair(mapWidthPx, mapHeightPx),
            canvas: dkCanv_floor,
            ctx: dkCanv_floor.getContext('2d')
        },
        occupants: newCanvasPair(mapWidthPx, mapHeightPx),
        overlays: newCanvasPair(mapWidthPx, mapHeightPx),
    }
    
    // draw each of the map layers onto the main floor canvas
    for (let i = 0; i < mapLayers.length; i++) {
        const layer = mapLayers[i];
        levelDrawKit.floors.ctx.drawImage(
            layer.texture.canvas,
            0, 0, layer.texture.canvas.width, layer.texture.canvas.height
        )
    }
    
    // write the finished canvas to "storedFloor" (currently is part of the 'floors' object)
    levelDrawKit.floors.storedFloor.ctx.drawImage(
        levelDrawKit.floors.canvas,
        0, 0, levelDrawKit.floors.canvas.width, levelDrawKit.floors.canvas.height
    )

    // return the complete drawkit
    return levelDrawKit;
}

// helper function to create a canvas+ctx pair
function newCanvasPair(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    return {
        canvas: canvas,
        ctx: ctx,
    }
}