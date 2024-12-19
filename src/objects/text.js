import {CanvasObject} from './objects.js';

export class CanvasText extends CanvasObject {
    order = 1;
    text = '';
    maxWidth;
    font = 'Helvetica, sans-serif';
    size = '18px';
    position = 'left top';
    direction;

    constructor(text = 'Text', fill = null) {
        super();
        this.text = text;

        if (fill) {
            this.fill = fill;
        }
    }

    render(ctx, canvas) {
        let txt_x = this.x;
        let txt_y = this.y;

        ctx.font = [this.size, this.font].join(' ');
        if (this.position) {
            let position = this.position.split(' ');
            let x = position[0];
            let y = position[1];
            ctx.textAlign = x;
            ctx.textBaseline = y;
            switch (x) {
                case 'center':
                    txt_x = canvas.width / 2 + txt_x;
                    break;
                case 'right':
                    txt_x = canvas.width - this.x;
                    break;
            }
            switch (y) {
                case 'middle':
                    txt_y = canvas.height / 2 + txt_y;
                    break;
                case 'bottom':
                    txt_y = canvas.height - this.y;
                    break;
            }
        }
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
        const lines = this.getTextLines(ctx, canvas);
        let x = this.x;
        let y = this.y;
        for (const line of lines) {
            if (this.fill) {
                ctx.fillText(line, x, y);
            } else {
                ctx.strokeText(line, x, y);
            }
            y += 20;
        }
    }

    measure(ctx) {
        return ctx.measureText(this.text);
    }
}
