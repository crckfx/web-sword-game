
export function gridCells(n) {
    return 16 * n;
}

export function moveTowards(person, destinationPosition, speed) {
    let distanceToTravelX = destinationPosition.x - person.position.x;
    let distanceToTravelY = destinationPosition.y - person.position.y;
    
    let distance = Math.sqrt(distanceToTravelX**2 + distanceToTravelY**2);

    if (distance <= speed) {
        person.position.x = destinationPosition.x;
        person.position.y = destinationPosition.y;
    } else {
        let normalisedX = distanceToTravelX / distance;
        let normalisedY = distanceToTravelY / distance;
        person.position.x += normalisedX * speed;
        person.position.y += normalisedY * speed;

        distanceToTravelX = destinationPosition.x - person.position.x;
        distanceToTravelY = destinationPosition.y - person.position.y;
        distance = Math.sqrt(distanceToTravelX**2 + distanceToTravelY**2);
    }

    return distance;
}

export const isSpaceFree = (walls, x, y) => {
    const str = `${x}.${y}`;
    // const isWallPresent = walls.has(str)
    
    return true;
}