/*
 * Canvas rendering abstraction.
 */

import {DEV_ENV, nextFrame} from './util.js';
import {initMouse, Mouse} from './mouse.js';

export class CanvasRenderer {
    canvas;
    ctx;
    frameRequest;
    width = 640;
    height = 480;
    ratio = 0;
    objects = [];
    rendering = true;

    constructor(canvas, width, height, ratio) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = width;
        this.height = height;

        if (!ratio) {
            const devicePixelRatio = window.devicePixelRatio || 1;
            const backingStorePixelRatio = this.ctx.webkitBackingStorePixelRatio ||
                    this.ctx.mozBackingStorePixelRatio ||
                    this.ctx.msBackingStorePixelRatio ||
                    this.ctx.oBackingStorePixelRatio ||
                    this.ctx.backingStorePixelRatio || 1;

            this.ratio = devicePixelRatio / backingStorePixelRatio;
        } else {
            this.ratio = ratio;
        }

        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';
        this.canvas.width = this.width * this.ratio;
        this.canvas.height = this.height * this.ratio;
        this.ctx.setTransform(this.ratio, 0, 0, this.ratio, 0, 0);

        initMouse(this);

        this.paint();
    }

    sortedObjects() {
        return this.objects.sort((a, b) => a.order - b.order);
    }

    fadeIn() {
        this.sortedObjects().forEach(o => o.fadeIn());
    }

    fadeOut() {
        this.sortedObjects().forEach(o => o.fadeOut());
    }

    stop() {
        this.rendering = false;
    }

    // Clear the canvas.
    clearScreen() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    // Save current canvas context.
    saveCtx() {
        this.ctx.save();
    }

    // Restore canvas context.
    restoreCtx() {
        this.ctx.restore();
    }

    // Append a canvas object to the draw loop.
    append(...canvasObj) {
        canvasObj.forEach(o => o.init(this.canvas));
        this.objects.push(...canvasObj);
    }

    // Initiate a canvas draw loop.
    async paint() {
        if (!this.rendering) {
            window.cancelAnimationFrame(this.frameRequest);
            return;
        }

        this.rendering = true;
        this.clearScreen();
        this.saveCtx();

        for (const obj of this.sortedObjects()) {
            if (obj.hidden) {
                continue;
            }

            this.saveCtx();

            if (obj.followMouse) {
                obj.x = Mouse.x - obj.width / 2;
                obj.y = Mouse.y - obj.height / 2;
            }

            obj.tick(this.ctx, this.canvas);
            obj.preEffects(this.ctx, this.canvas);
            if (obj.visible) {
                obj.render(this.ctx, this.canvas);
                obj.postEffects(this.ctx);
            }

            if (obj.debug && DEV_ENV) {
                obj.renderDebug(this.ctx, this.canvas);
            }

            obj.checkMouseStates(this.ctx, this.canvas);

            this.restoreCtx();
        }

        this.restoreCtx();
        await nextFrame();
        this.frameRequest = window.requestAnimationFrame(async () => await this.paint());
    }
}
