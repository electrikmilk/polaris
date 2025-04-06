/*
 * Canvas drawing abstraction.
 */

import {COLOR_BLACK, COLOR_WHITE, DEBUG_COLORS, randInt} from '../engine/util.js';
import {colliding} from '../engine/physics.js';
import {Mouse, MOUSE_DOWN, MOUSE_UP} from '../engine/mouse.js';
import {FadeInAnimation, FadeOutAnimation} from '../engine/animation.js';
import {CanvasShadow} from './object-effects.js';

export class CanvasObject {
    name;
    subObjects = {};

    hidden = false;
    invisible = false;

    shape = 'rectangle';
    solid = false;
    boundToViewport = false;

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
    position = null;

    fill = COLOR_BLACK;
    stroke = COLOR_BLACK;
    strokeWidth = 0;
    gradient;
    shadow;

    animation;
    flashInterval = null;

    debug = false;
    debugColor = DEBUG_COLORS[randInt(0, 2)];

    // Runs before each draw frame.
    tick(ctx, canvas) {
        //
    }

    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
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

    toggle() {
        this.hidden = !this.hidden;
    }

    show() {
        this.hidden = false;
    }

    hide() {
        this.hidden = true;
    }

    flash(ms = 100, times = 0) {
        if (!this.visible) {
            this.visible = true;
        }
        let flashed = 0;
        this.flashInterval = setInterval(() => {
            this.invisible = !this.invisible;
            if (times) {
                flashed++;
                if (flashed > times) {
                    this.stopFlashing();
                }
            }
        }, ms);
    }

    stopFlashing() {
        if (!this.flashInterval) {
            return;
        }

        clearInterval(this.flashInterval);
    }

    center(canvas) {
        this.x = ((canvas.width / 2) / 2) - (this.width / 2);
        this.y = ((canvas.height / 2) / 2) - (this.height / 2);
    }

    calcPosition(canvas) {
        const position = this.position.split(' ');
        const y = position[0];
        const x = position[1];
        switch (y) {
            case 'middle':
                this.y = canvas.height / 4;
                break;
            case 'bottom':
                this.y = canvas.height;
                break;
        }
        switch (x) {
            case 'center':
                this.x = canvas.width / 4;
                break;
            case 'right':
                this.x = canvas.width / 2;
                break;
        }
    }

    preEffects(ctx, canvas) {
        if (this.angle) {
            ctx.rotate(this.angle * (Math.PI / 180));
        }
        if (this.scale) {
            ctx.scale(this.scale, this.scale);
        }
        if (this.position) {
            this.calcPosition(canvas);
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
            height: 155,
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

        const shadow = new CanvasShadow(COLOR_WHITE, 20);
        shadow.render(ctx);

        ctx.rect(debugBox.x, debugBox.y, debugBox.width, debugBox.height);
        ctx.fillStyle = this.debugColor;
        ctx.globalAlpha = 0.8;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.save();

        debugBox.x += 10;

        ctx.restore();
        ctx.fillStyle = COLOR_BLACK;
        ctx.font = '15px monospace';
        ctx.textAlign = 'top';
        ctx.textBaseline = 'top';
        ctx.fillText(`invisible: ${this.invisible}`, debugBox.x, debugBox.y + 10);
        ctx.fillText(`hovering: ${this.hovering}`, debugBox.x, debugBox.y + 30);
        ctx.fillText(`x: ${this.x}`, debugBox.x, debugBox.y + 50);
        ctx.fillText(`y: ${this.y}`, debugBox.x, debugBox.y + 70);
        ctx.fillText(`width: ${this.width}`, debugBox.x, debugBox.y + 90);
        ctx.fillText(`height: ${this.width}`, debugBox.x, debugBox.y + 110);
        ctx.fillText(`opacity: ${this.opacity}`, debugBox.x, debugBox.y + 130);
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

    move(renderer, direction, amount) {
        let new_x = this.x;
        let new_y = this.y;
        let next_x = this.x;
        let next_y = this.y;
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

        let is_colliding = false;
        if (this.solid === true) {
            let new_position = {
                x: next_x,
                y: next_y,
                width: this.width,
                height: this.height,
                shape: this.shape,
            };

            // check next position against other solid sprites
            renderer.sortedObjects().filter(s => s !== this && s.solid).forEach((sprite) => {
                is_colliding = colliding(new_position, sprite);
            });

            if (this.boundToViewport === true) {
                let bound_x = new_x + this.width - amount;
                let bound_y = new_y + this.height - amount;
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

        this.x = new_x;
        this.y = new_y;
    }

    async fadeIn() {
        this.animation = new FadeInAnimation(this).start();
    }

    async fadeOut() {
        this.animation = new FadeOutAnimation(this).start();
    }

    init(canvas, ctx) {
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
