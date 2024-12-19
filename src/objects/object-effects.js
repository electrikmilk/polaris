/*
 * Special effects for canvas objects.
 */

import {offBlack} from '../engine/util.js';

export class CanvasGradient {
    type = 'linear';
    colors = [];
    ratio = 0;
    angle = 0;
    gradient;

    x0 = 0;
    x1 = 0;
    y0 = 0;
    y1 = 0;
    r0 = 0;
    r1 = 0;

    constructor(colors, type = 'linear', ratio = 0, angle = 0) {
        this.colors = colors;
        this.type = type;
        this.ratio = ratio;
        this.angle = angle;
    }

    render(ctx, x, y, width, height) {
        if (this.type === 'linear') {
            this.gradient = ctx.createLinearGradient(x + this.ratio, this.angle, (x + (width + height)) - this.ratio, 0);
        } else {
            this.gradient = ctx.createRadialGradient(this.x0, this.y0, this.r0, this.x1, this.y1, this.r1);
        }

        this.colors.forEach((c, i) => {
            this.gradient.addColorStop((i / this.colors.length), c);
        });

        return this.gradient;
    }
}

export class CanvasShadow {
    color = offBlack;
    blur = 0;
    offsetX = 0;
    offsetY = 0;

    constructor(color = offBlack, blur = 0, offsetX = 0, offsetY = 0) {
        this.color = color;
        this.blur = blur;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }

    render(ctx) {
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.blur ?? 0;
        ctx.shadowOffsetX = this.offsetX ?? 0;
        ctx.shadowOffsetY = this.offsetY ?? 0;
    }
}
