export class GameLoop {
    constructor(update, render) {
        this.update = update;
        this.render = render;

        this.lastFrameTime = 0;
        this.accumulatedTime = 0;
        this.timeStep = 1000 / 60; // 60 fps

        this.isRunning = false;
        this.rafId = 0;

    }

    mainLoop = (timestamp) => {
        if (!this.isRunning) return;

        let deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;

        this.accumulatedTime += deltaTime;

        while (this.accumulatedTime >= this.timeStep) {
            // console.log(this.accumulatedTime);
            // timestep comes out at ~21ms (like 50fps lol)
            // deltatime (at 144hz) comes out at ~7ms
            this.update(this.timeStep);
            this.accumulatedTime -= this.timeStep;
        }

        this.render();

        this.rafId = requestAnimationFrame(this.mainLoop);

    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.rafId = requestAnimationFrame(this.mainLoop);
        }
    }

    stop() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        this.isRunning = false;
    }



}