export function createDrawKit(mapLayers, mapWidthPx, mapHeightPx) {
    const dkCanv_floor = document.createElement('canvas');
    dkCanv_floor.width = mapWidthPx;
    dkCanv_floor.height = mapHeightPx;
    const dkCtx_floor = dkCanv_floor.getContext('2d');
    
    const dkCanv_floorsOnly = document.createElement('canvas');
    dkCanv_floorsOnly.width = mapWidthPx;
    dkCanv_floorsOnly.height = mapHeightPx;
    const dkCtx_floorsOnly = dkCanv_floorsOnly.getContext('2d');
    
    const dkCanv_occ = document.createElement('canvas');
    dkCanv_occ.width = mapWidthPx;
    dkCanv_occ.height = mapHeightPx;
    const dkCtx_occ = dkCanv_floor.getContext('2d');
    
    const dkCanv_over = document.createElement('canvas');
    dkCanv_over.width = mapWidthPx;
    dkCanv_over.height = mapHeightPx;
    const dkCtx_over = dkCanv_over.getContext('2d');
    
    
    
    const levelDrawKit = {
        floors: {
            floorsOnlyCtx: dkCtx_floorsOnly,
            floorsOnly: dkCanv_floorsOnly,
            canvas: dkCanv_floor,
            ctx: dkCtx_floor
        },
        occupants: {
            canvas: dkCanv_occ,
            ctx: dkCtx_occ
        },
        overlays: {
            canvas: dkCanv_over,
            ctx: dkCtx_over
        }
    }
    
    for (let i = 0; i < mapLayers.length; i++) {
        const layer = mapLayers[i];
        levelDrawKit.floors.ctx.drawImage(
            layer.texture.canvas,
            0, 0, layer.texture.canvas.width, layer.texture.canvas.height
        )
    }
    
    levelDrawKit.floors.floorsOnlyCtx.drawImage(
        levelDrawKit.floors.canvas,
        0, 0, levelDrawKit.floors.canvas.width, levelDrawKit.floors.canvas.height
    )

    return levelDrawKit;

}
