import { saveCanvasAsPNG } from "../helper/random.js";
import { loadImage } from "../helper/resource-loader.js";


const images = {};
const CELL_PX = 32;
// the array for the textures we downloaded (https://opengameart.org/content/32x32-floor-tiles)
const some_layout_array = [
    28, 124, 112, 16, 247, 223, 125,
    31, 255, 241, 17, 253, 127, 95,
    7, 199, 193, 1, 93, 117, 245,
    4, 68, 64, 0, 87, 213, 215,
    23, 209, 116, 92, 20, 84, 80,
    29, 113, 197, 71, 21, 85, 81,
    null, null, 221, 119, 5, 69, 65
];
let count = 0;
const canvas = document.getElementById('game_canv');
canvas.width = 32 * 7;
canvas.height = 32 * 7;
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'red';
await loadStuff();

// saveCanvasAsPNG(canvas);
// --------------------------------------------------------------
async function load_image_files(object, files) {
    for (const key in files) {
        object[key] = await loadImage(files[key]);
    }
}

function drawBaseImage(index) {
    drawImageAtIndex(images[index], index);
    count++;
    const deg90 = (index * 4) % 255;
    const deg180 = (index * 4 * 4) % 255;
    const deg270 = (index * 4 * 4 * 4) % 255;

    // console.log(`rotations for ${index} - 90: ${deg90}, 180: ${deg180}, 270: ${deg270}`)

    if (deg90 !== index && deg90 !== 0) {
        drawImageRotatedAtIndex(images[index], deg90, 90);
        count++;
    }
    if (deg180 !== index && deg180 !== 0) {
        drawImageRotatedAtIndex(images[index], deg180, 180);
        count++;
    }
    if (deg270 !== index && deg270 !== 0 && deg270 !== deg90) {
        drawImageRotatedAtIndex(images[index], deg270, 270);
        count++;
    }
    
}
async function loadStuff() {
    const tileIndices = [0, 1, 5, 7, 17, 21, 23, 29, 31, 85, 87, 95, 119, 127, 255];
    
    const imageFiles = {};
    tileIndices.forEach(n => {
        imageFiles[n] = `../images/island2/${n}.png`;
    });
    
    await load_image_files(images, imageFiles);
    
    count = 0;
    tileIndices.forEach(index => drawBaseImage(index));
    console.log(count);
}

// turn an array index into XY coords (assuming 7x7 total)
function indexToCoords(index) {
    return { x: index % 7, y: Math.floor(index / 7) };
}
// lookup a value index and return its XY coords
function findValueCoords(value, table) {
    const index = table.indexOf(value);
    return index !== null ? indexToCoords(index) : null;
}


function drawImageAtIndex(image, index) {
    console.log(`drawing ${index}`)
    const coords = findValueCoords(index, some_layout_array)
    ctx.drawImage(image, CELL_PX * coords.x, CELL_PX * coords.y, CELL_PX, CELL_PX)
}

function drawImageRotatedAtIndex(image, index, angle) {
    console.log(`drawing ${index}`)
    const coords = findValueCoords(index, some_layout_array);
    if (!coords) {
        console.log(`no coords for ${index}`)
        return
    };

    const x = CELL_PX * coords.x;
    const y = CELL_PX * coords.y;
    const halfSize = CELL_PX / 2;

    ctx.save(); // Save the current state
    ctx.translate(x + halfSize, y + halfSize); // Move origin to center
    ctx.rotate(angle * Math.PI / 180); // Rotate by the given angle
    ctx.drawImage(image, -halfSize, -halfSize, CELL_PX, CELL_PX); // Draw centered
    ctx.restore(); // Restore to original state
}

