/*
 * Canvas drawing abstraction.
 */

import {debugColors, offBlack, offWhite, randInt} from '../engine/util.js';
import {colliding} from '../engine/physics.js';
import {Mouse, MOUSE_DOWN, MOUSE_UP} from '../engine/mouse.js';
import {FadeInAnimation, FadeOutAnimation} from '../engine/animation.js';
import {CanvasShadow} from './object-effects.js';

export class CanvasObject {
    name;
    visible = true;
    hidden = false;
    shape = 'rectangle';

    hovering = false;
    clicked = false;
    cursor = 'default';
    followMouse = false;

    order = 0;
    x = 0;
    y = 0;
    width = 0;
    height = 0;
    angle = 0;
    scale = 0;
    opacity = 100;
    margin = 20;

    fill = offBlack;
    stroke = offBlack;
    strokeWidth = 0;
    gradient;
    shadow;

    animation;

    debug = false;
    debugColor = debugColors[randInt(0, 2)];

    // Runs before each draw frame.
    tick() {
        //
    }

    safeAreaTop() {
        return this.height + this.margin;
    }

    safeAreaLeft(canvas) {
        return (canvas.width / 2) + this.width + this.margin;
    }

    safeAreaRight(canvas) {
        return (canvas.width / 2) - this.width - this.margin;
    }

    safeAreaBottom(canvas) {
        return (canvas.height / 2) - this.height - this.margin;
    }

    marginWidth(canvas) {
        return (canvas.width / 2) - (this.margin * 2);
    }

    marginHeight(canvas) {
        return (canvas.height / 2) - (this.margin * 2);
    }

    scaleUp(increment = 10) {
        this.width += increment;
        this.height += increment;
    }

    scaleDown(decrement = 10) {
        this.width -= decrement;
        this.height -= decrement;
    }

    center(canvas) {
        this.x = ((canvas.width / 2) / 2) - (this.width / 2);
        this.y = ((canvas.height / 2) / 2) - (this.height / 2);
    }

    preEffects(ctx, canvas) {
        if (this.angle) {
            ctx.rotate(this.angle * (Math.PI / 180));
        }
        if (this.scale) {
            ctx.scale(this.scale, this.scale);
        }

        ctx.globalAlpha = this.opacity / 100;
        ctx.beginPath();
    }

    postEffects(ctx) {
        if (this.shadow) {
            this.shadow.render(ctx);
        }

        if (this.gradient || this.fill) {
            if (this.gradient) {
                ctx.fillStyle = this.gradient.render(ctx, this.x, this.y, this.width, this.height);
            } else if (this.fill) {
                ctx.fillStyle = this.fill;
            }

            ctx.fill();
        }

        if (this.strokeWidth) {
            ctx.lineWidth = this.strokeWidth;
            ctx.strokeStyle = this.stroke;
            ctx.stroke();
        }
    }

    getDebugBox(canvas) {
        const debugBox = {
            x: this.x + this.width + 10,
            y: this.y,
            width: 170,
            height: 140,
            shape: 'rectangle',
        };

        const halfCanvasWidth = canvas.width / 2;
        const halfCanvasHeight = canvas.height / 2;
        const boundingX = (debugBox.x + debugBox.width);
        const boundingY = (debugBox.y + debugBox.height);
        if (boundingX > halfCanvasWidth) {
            debugBox.x = halfCanvasWidth - debugBox.width;
        }
        if (boundingY > halfCanvasHeight) {
            debugBox.y = halfCanvasHeight - debugBox.height;
        }
        if (boundingX < 0) {
            debugBox.x = 0;
        }
        if (boundingY < 0) {
            debugBox.y = 0;
        }

        return debugBox;
    }

    renderDebug(ctx, canvas) {
        const debugBox = this.getDebugBox(canvas);

        ctx.save();
        ctx.beginPath();

        new CanvasShadow(offWhite, 20).render(ctx);

        ctx.rect(debugBox.x, debugBox.y, debugBox.width, debugBox.height);
        ctx.fillStyle = this.debugColor;
        ctx.globalAlpha = 0.5;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
        debugBox.x += 10;

        ctx.save();
        ctx.fillStyle = offWhite;
        ctx.font = '16px \'Courier, monospace\'';
        ctx.textAlign = 'top';
        ctx.textBaseline = 'top';
        ctx.fillText(`visible: ${this.visible}`, debugBox.x, debugBox.y + 10);
        ctx.fillText(`hovering: ${this.hovering}`, debugBox.x, debugBox.y + 30);
        ctx.fillText(`x: ${this.x}`, debugBox.x, debugBox.y + 50);
        ctx.fillText(`y: ${this.y}`, debugBox.x, debugBox.y + 70);
        ctx.fillText(`width: ${this.width}`, debugBox.x, debugBox.y + 90);
        ctx.fillText(`height: ${this.width}`, debugBox.x, debugBox.y + 110);
        ctx.restore();

        ctx.save();
        ctx.beginPath();

        if (this.angle) {
            ctx.rotate(this.angle * Math.PI / 180);
        }

        switch (this.shape) {
            case 'circle':
                ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
                break;
            default:
                ctx.rect(this.x, this.y, this.width, this.height);
        }

        ctx.globalAlpha = 1;
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.debugColor;
        ctx.stroke();
        ctx.globalAlpha = 1;

        ctx.restore();
    }

    checkMouseStates(ctx, canvas) {
        if (!colliding(Mouse, this)) {
            this.hovering = false;
            this.onHoverEnd(ctx, canvas);

            if (MOUSE_DOWN) {
                this.onClickOutside(ctx, canvas);
            }

            return;
        }

        if (!this.hovering) {
            this.hovering = true;
            this.onHover(ctx, canvas);
        }

        this.onHovering(ctx, canvas);
        canvas.style.cursor = this.cursor;

        if (MOUSE_DOWN && !this.clicked) {
            this.onClick(ctx, canvas);
            this.clicked = true;
        } else if (MOUSE_UP && this.clicked) {
            this.onClickEnd(ctx, canvas);
            this.clicked = false;
        }
    }

    async fadeIn() {
        const diff = (100 - this.opacity) / 10 + 10;
        this.animation = new FadeInAnimation(this, diff).start();
    }

    async fadeOut() {
        const diff = 100 - this.opacity;
        this.animation = new FadeOutAnimation(this, diff).start();
    }

    init(canvas) {
        //
    }

    render(ctx, canvas) {
        //
    }

    onHover(ctx, canvas) {
        //
    }

    onHovering(ctx, canvas) {
        //
    }

    onHoverEnd(ctx, canvas) {
        //
    }

    onClick(ctx, canvas) {
        //
    }

    onClickEnd(ctx, canvas) {
        //
    }

    onClickOutside(ctx, canvas) {
        //
    }
}
