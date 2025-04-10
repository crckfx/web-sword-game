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

        storedFloor: newCanvasPair(mapWidthPx, mapHeightPx), // moved outside of "floors"
        mapFloorCombined: newCanvasPair(mapWidthPx, mapHeightPx),
        occupants: newCanvasPair(mapWidthPx, mapHeightPx),
        overlays: newCanvasPair(mapWidthPx, mapHeightPx),
    }
    
    // draw each of the map layers onto the main floor canvas
    for (let i = 0; i < mapLayers.length; i++) {
        const layer = mapLayers[i];
        levelDrawKit.mapFloorCombined.ctx.drawImage(
            layer.texture.canvas,
            0, 0, layer.texture.canvas.width, layer.texture.canvas.height
        )
        levelDrawKit.storedFloor.ctx.drawImage(
            layer.texture.canvas,
            0, 0, layer.texture.canvas.width, layer.texture.canvas.height
        )
    }
    
    // write the 'finished' canvas to "storedFloor" (remember, the 'floors')
    levelDrawKit.mapFloorCombined.ctx.drawImage(
        levelDrawKit.storedFloor.canvas,
        0, 0, levelDrawKit.storedFloor.canvas.width, levelDrawKit.storedFloor.canvas.height
    )

    // return the complete drawkit
    return levelDrawKit;
}

// helper function to create a canvas+ctx pair
export function newCanvasPair(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    return {
        canvas: canvas,
        ctx: ctx,
    }
}