// ------------------------------------------------------
// LINE OF SIGHT
function get_line_of_sight(entity) {
    let orientation = null;
    let range = null;
    switch (entity.isFacing) {
        case 'Up':
            orientation = 'vertical';
            range = -entity.sightRange;
            break;
        case 'Down':
            orientation = 'vertical';
            range = entity.sightRange;
            break;
        case 'Left':
            orientation = 'horizontal';
            range = -entity.sightRange;
            break;
        case 'Right':
            orientation = 'horizontal';
            range = entity.sightRange;
            break;
    }

    return {
        orientation: orientation,
        range: range,
    }
}

export function check_cell_is_in_line_of_sight(cellX, cellY, viewer) {
    let v, cell;
    const line = get_line_of_sight(viewer);
    if (line.orientation === 'vertical') {
        if (cellX !== viewer.position.x) return false;
        v = viewer.position.y;
        cell = cellY;
    } else {
        if (cellY !== viewer.position.y) return false;
        v = viewer.position.x;
        cell = cellX;
    }
    return check_single_axis(line.range, v, cell);
}

function check_single_axis(range, viewer, cell) {
    let start, stop;
    if (range > 0) {
        start = viewer + 1;
        stop = viewer + 1 + range;
    } else {
        start = viewer + range;
        stop = viewer;
    }
    for (let i = start; i < stop; i++) {
        if (i === cell) return true;
    }
    return false;
}



function check_all_lines_of_sight() {
    const px = player.position.x;
    const py = player.position.y;
    for (const key in entities) {
        entities[key].hasAlert = check_cell_is_in_line_of_sight(px, py, entities[key]);
    }
}