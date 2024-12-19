import {sleep} from './util.js';

export class Animation {
    frames = [];
    tick = 0;
    frame = 0;
    msPerFrame = 1;
    iter = 1;
    times = 0;

    stop = false;

    constructor(frames, msPerFrame = 1, times = 0) {
        this.frames = frames;
        this.msPerFrame = msPerFrame;
        this.times = times;
    }

    // Start the animation.
    async start() {
        if (this.stop) {
            return;
        }

        if (this.frame === this.frames.length) {
            this.frame = 0;
            this.iter++;

            if (this.times > 0) {
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
    constructor(object, diff) {
        super(object, [() => {
            this.object.opacity += 10;
        }], 60, diff);
    }

    onEnd() {
        this.object.opacity = 100;
    }
}

export class FadeOutAnimation extends ObjectAnimation {
    constructor(object, diff) {
        super(object, [() => {
            this.object.opacity -= 10;
        }], 60, diff);
    }

    onEnd() {
        this.object.opacity = 0;
    }
}
