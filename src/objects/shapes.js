/*
 * Canvas object shapes.
 */

import {CanvasObject} from './objects.js';

export class CanvasBox extends CanvasObject {
    constructor(x, y, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    render(ctx, canvas) {
        ctx.rect(this.x, this.y, this.width, this.height);

        if (ctx.fill) {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

export class CanvasClearBox extends CanvasObject {
    constructor(x, y, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    render(ctx, canvas) {
        ctx.clearRect(this.x, this.y, this.width, this.height);
    }
}

export class CanvasCircle extends CanvasObject {
    radius = 0;
    shape = 'circle';

    constructor(x, y, radius) {
        super();
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    render(ctx, canvas) {
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    }
}
