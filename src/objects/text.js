import {CanvasObject} from './object.js';

export class CanvasText extends CanvasObject {
    order = 1;
    text = '';
    maxWidth;
    font = 'Helvetica, sans-serif';
    size = '18px';
    styles = [];
    direction;

    textBaseline = 'top';
    textAlign = 'left';

    constructor(text = 'Text', fill = null, x = 0, y = 0, maxWidth = null, font = 'Helvetica, sans-serif') {
        super();
        this.text = text;

        if (fill) {
            this.fill = fill;
        }
        this.x = x;
        this.y = y;
        this.subObjects.typewriterCursor.order = 1;
    }

    render(ctx, canvas) {
        ctx.font = [this.styles.join(' '), this.size, this.font].join(' ');

        if (this.direction) {
            ctx.direction = this.direction;
        }
        if (!this.width || !this.height) {
            this.resizeText(ctx);
        }

        this.postEffects(ctx);
        this.renderText(ctx, canvas);
    }

    setText(ctx, text) {
        this.text = text;
        this.resizeText(ctx);
    }

    resizeText(ctx) {
        this.width = Math.ceil(this.measure(ctx).width + 50);
        this.height = Math.ceil(parseInt(this.size));
    }

    getTextLines(ctx, canvas) {
        let lines = [];

        const halfCanvasWidth = canvas.width / 2;
        const words = this.text.split(' ');
        let current = words[0];

        for (let i = 1; i < words.length; i++) {
            const width = ctx.measureText(current + words[i]).width;
            if (width < halfCanvasWidth) {
                current += ' ' + words[i];
            } else {
                lines.push(current);
                current = words[i];
            }
        }

        lines.push(current);
        return lines;
    }

    renderText(ctx, canvas) {
        ctx.textBaseline = this.textBaseline;
        ctx.textAlign = this.textAlign;

        const lines = this.getTextLines(ctx, canvas);
        let x = this.x;
        let y = this.y;
        for (const line of lines) {
            if (this.fill) {
                if (this.maxWidth) {
                    ctx.fillText(line, x, y, this.maxWidth);
                } else {
                    ctx.fillText(line, x, y);
                }
            } else {
                if (this.maxWidth) {
                    ctx.strokeText(line, x, y, this.maxWidth);
                } else {
                    ctx.strokeText(line, x, y);
                }
            }
            y += 20;
        }
    }

    measure(ctx) {
        return ctx.measureText(this.text);
    }
}
