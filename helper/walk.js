const NUM_FRAMES_WALK = 4;
const NUM_FRAMES_STAND = 1;
const DURATION_WALK = 600;
const DURATION_STAND = 600;

function createFrames(duration, numFrames, rootFrame = 0, offset = 0) {
    // duration: total cycle length (ms). 
    // numFrames: number of states to cycle through
    // rootFrame: where to BASE the loop (ie. cycle from 'n' through to 'n+numFrames')
    // offset: where to BEGIN the loop (ie. rootFrame '16' & offset '2' produces [18,19,16,17])
    const frames = [];
    const interval = duration / numFrames;
    for (let i = 0; i < numFrames; i++) {
        const frame = {
            time: i * interval,
            frame: rootFrame + ((i + offset) % numFrames)
        };
        frames.push(frame);
    }
    return {
        duration: duration,
        frames: frames
    }
}

export const WALK_DOWN = createFrames(DURATION_WALK, NUM_FRAMES_WALK, 0, 1);
export const WALK_LEFT = createFrames(DURATION_WALK, NUM_FRAMES_WALK, 8, 1);
export const WALK_UP = createFrames(DURATION_WALK, NUM_FRAMES_WALK, 16, 1);
export const WALK_RIGHT = createFrames(DURATION_WALK, NUM_FRAMES_WALK, 24, 1);

export const STAND_DOWN = createFrames(DURATION_STAND, NUM_FRAMES_STAND, 0, 0);
export const STAND_LEFT = createFrames(DURATION_STAND, NUM_FRAMES_STAND, 8, 0);
export const STAND_UP   = createFrames(DURATION_STAND, NUM_FRAMES_STAND, 16, 0);
export const STAND_RIGHT = createFrames(DURATION_STAND, NUM_FRAMES_STAND, 24, 0);