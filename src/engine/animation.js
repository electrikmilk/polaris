import {sleep} from './util.js';

export class Animation {
    frames = [];
    tick = 0;
    frame = 0;
    msPerFrame = 1;
    iter = 1;
    times = 0;

    stopAnimating = false;

    constructor(frames, msPerFrame = 1, times = 0) {
        this.frames = frames;
        this.msPerFrame = msPerFrame;
        this.times = times;
    }

    // Start the animation.
    async start() {
        if (this.stopAnimating) {
            return;
        }

        if (this.frames.length === this.frame) {
            this.frame = 0;
            this.iter++;

            if (this.times > 1) {
                --this.times;
                await this.start();
                return;
            }

            this.onEnd();
            return;
        }

        this.frames[this.frame]();
        this.frame++;
        this.tick++;

        await sleep(this.msPerFrame);
        await this.start();
    }

    stop() {
        this.stopAnimating = true;
    }

    // Called when the animation finishes.
    onEnd() {
        //
    }
}

export class ObjectAnimation extends Animation {
    object;

    constructor(object, frames, msPerFrame = 1, times = 0) {
        super(frames, msPerFrame, times);
        this.object = object;
    }
}

export class FadeInAnimation extends ObjectAnimation {
    constructor(object) {
        super(object, [() => {
            object.opacity += 10;
        }], 60, 0);

        if (object.opacity === 100) {
            this.object.opacity = 0;
            this.times = 10;
        } else {
            this.times = (object.opacity / 100) * 10;
        }
    }

    onEnd() {
        this.object.opacity = 100;
    }
}

export class FadeOutAnimation extends ObjectAnimation {
    constructor(object) {
        super(object, [() => {
            object.opacity -= 10;
        }], 60, 0);

        if (this.object.opacity === 0) {
            this.object.opacity = 100;
            this.times = 10;
        } else if (this.object.opacity === 100) {
            this.times = 10;
        } else {
            this.times = 100 - this.object.opacity;
        }
    }

    onEnd() {
        this.object.opacity = 0;
    }
}
