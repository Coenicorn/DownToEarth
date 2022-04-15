class time {
    private dt: number;
    private fps: number;
    private desiredFrameTime: number;
    private frameTime: number;
    private timeSinceLastUpdate: number;
    private renderTimer: number;
    private timeElapsed: number;

    constructor() {
        this.dt = 0;
        this.desiredFrameTime = 0;
        this.frameTime = 0;
        this.fps = 0;
        this.timeSinceLastUpdate = 0;
        this.renderTimer = 0;
        this.timeElapsed = 0;
    }

    /**
     * @param {number} frameTime Time elapsed between frames
     */
    update(running: boolean) {
        let now = Date.now();
        this.frameTime = now - this.timeSinceLastUpdate;
        this.dt = this.frameTime / this.desiredFrameTime;
        this.timeSinceLastUpdate = now;
        this.renderTimer += this.frameTime;
        if (running) this.timeElapsed += this.frameTime;
    }

    resetRendertimer() {
        this.renderTimer = 0;
    }

    reset() {
        this.timeSinceLastUpdate = Date.now();
    }

    setFps(fps: number) {
        this.fps = fps;
        this.desiredFrameTime = 1000 / this.fps;
    }

    getFps(): number {
        return this.fps;
    }

    getFrameTime(): number {
        return this.frameTime;
    }

    getTimeElapsed(): number {
        return this.timeElapsed;
    }

    resetTimeElapsed() {
        this.timeElapsed = 0;
    }

    get canRender(): boolean {
        return (this.renderTimer > this.desiredFrameTime);
    }

    get deltaTime(): number {
        return this.dt;
    }
}

export const Time = new time();