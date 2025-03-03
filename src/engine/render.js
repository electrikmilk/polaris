/*
 * Canvas rendering abstraction.
 */

import {DEV_ENV, nextFrame} from './util.js';
import {initMouse, Mouse} from './mouse.js';
import {colliding} from './physics.js';

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

    allObjects() {
        let objects = [];
        for (const object of this.sortedObjects()) {
            objects.push(object);

            if (object.subObjects) {
                objects.push(...Object.values(object.subObjects));
            }
        }

        return objects;
    }

    fadeIn() {
        this.allObjects().forEach(o => o.fadeIn());
    }

    fadeOut() {
        this.allObjects().forEach(o => o.fadeOut());
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
        canvasObj.forEach(o => o.init(this.canvas, this.ctx));
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

        for (const object of this.sortedObjects()) {
            this.paintObject(object);

            if (!object.hidden && !Object.is(object.subObjects, {})) {
                Object.values(object.subObjects).sort(((a, b) => a.order - b.order)).map(subObject => {
                    const newObject = subObject.clone();
                    newObject.x = object.x + subObject.x;
                    newObject.y = object.y + subObject.y;
                    this.paintObject(newObject);
                });
            }
        }

        this.restoreCtx();
        await nextFrame();
        this.frameRequest = window.requestAnimationFrame(async () => await this.paint());
    }

    paintObject(object) {
        if (object.hidden) {
            return;
        }

        this.saveCtx();

        if (object.followMouse) {
            object.x = Mouse.x - object.width / 2;
            object.y = Mouse.y - object.height / 2;
        }

        object.tick(this.ctx, this.canvas);
        object.preEffects(this.ctx, this.canvas);
        if (!object.invisible) {
            object.render(this.ctx, this.canvas);
            object.postEffects(this.ctx);
        }

        if (object.debug && DEV_ENV) {
            object.renderDebug(this.ctx, this.canvas);
        }

        object.checkMouseStates(this.ctx, this.canvas);

        this.restoreCtx();
    }

    moveSolidObject(object, direction, amount) {
        let new_x = object.x;
        let new_y = object.y;
        let next_x = object.x;
        let next_y = object.y;
        switch (direction) {
            case 'up':
                new_y -= amount;
                next_y -= amount - amount;
                break;
            case 'left':
                new_x -= amount;
                next_x -= amount - amount;
                break;
            case 'right':
                new_x += amount;
                next_x += amount + amount;
                break;
            case 'down':
                new_y += amount;
                next_y += amount + amount;
                break;
        }
        // collision
        let is_colliding = false;
        if (object.solid === true) {
            // describe next position
            let new_position = {
                x: next_x,
                y: next_y,
                width: object.width,
                height: object.height,
                shape: object.shape,
            };
            // check next position against other solid sprites
            this.sortedObjects().filter(s => s !== object && s.solid).forEach((sprite) => {
                is_colliding = colliding(new_position, sprite);
            });
            // bound to viewport
            if (object.boundToViewport === true) {
                let bound_x = new_x + object.width - amount;
                let bound_y = new_y + object.height - amount;
                if (bound_x >= this.width || bound_y >= this.height) {
                    is_colliding = true;
                }
                if (next_x === 0 || next_y === 0) {
                    is_colliding = true;
                }
            }
            if (is_colliding) {
                return;
            }
            // we aren't colliding with anything else solid, allow movement to the next position
        }

        // move to new position
        object.x = new_x;
        object.y = new_y;
    }
}
