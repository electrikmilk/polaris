/*
 * Canvas object shapes.
 */

import {CanvasObject} from './object.js';
import {COLOR_BLACK} from '../engine/util.js';

export class CanvasBox extends CanvasObject {
    constructor(fill = COLOR_BLACK, x = 0, y = 0, width = 0, height = 0) {
        super();
        this.fill = fill;
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

export class CanvasRoundedBox extends CanvasObject {
    radius = 5;

    constructor(fill = COLOR_BLACK, x = 0, y = 0, width = 0, height = 0, radius = 0) {
        super();
        this.fill = fill;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.radius = radius;
    }

    render(ctx, canvas) {
        ctx.roundRect(this.x, this.y, this.width, this.height, this.radius);
    }
}

export class CanvasClearBox extends CanvasObject {
    constructor(x = 0, y = 0, width = 0, height = 0) {
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

    constructor(fill = COLOR_BLACK, x = 0, y = 0, radius = 0) {
        super();
        this.fill = fill;
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    render(ctx, canvas) {
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    }
}
