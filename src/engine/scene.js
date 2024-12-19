import {CanvasRenderer} from './render.js';

export class Scene {
    renderer;
    handler;

    constructor(handler) {
        this.handler = handler;
    }

    start(canvas, width, height) {
        this.renderer = new CanvasRenderer(canvas, width, height);
        this.handler(this.renderer);
    }

    stop() {
        this.renderer.stop();
        this.renderer = null;
    }
}
