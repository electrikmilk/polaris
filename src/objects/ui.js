import {empty, offBlack, offWhite} from '../engine/util.js';
import {CanvasBox} from './shapes.js';
import {CanvasText} from './text.js';

export class CanvasButton extends CanvasBox {
    fill = offWhite;
    subObjects = {text: new CanvasText('Text', offBlack)};

    constructor(label = null) {
        super();
        if (label) {
            this.subObjects.text = new CanvasText(label, offBlack);
        }
        this.subObjects.text.x += 15;
        this.subObjects.text.y += 15;
    }

    init(canvas, ctx) {
        this.subObjects.text.render(ctx, canvas);
        this.width = ctx.measureText(this.subObjects.text.text).width + 30;
        this.height = Math.ceil(parseInt(this.subObjects.text.size)) + 30;
    }

    onHover(ctx, canvas) {
        this.opacity = 80;
    }

    onHoverEnd(ctx, canvas) {
        this.opacity = 100;
    }
}

export class CanvasInput extends CanvasBox {
    fill = offWhite;
    focused = false;
    value = '';
    strokeWidth = 1;
    cursorIndex = 0;
    maxTextWidth = 0;

    constructor(placeholder = 'Click to type...', x = 0, y = 0) {
        super();
        this.x = x;
        this.y = y;

        this.subObjects = {
            text: new CanvasText(placeholder, offBlack, 15, 15),
            placeholder: new CanvasText(placeholder, '#ababab', 15, 15),
            cursor: new CanvasBox(offBlack, 15, 10, 1, 25),
        };
        this.subObjects.cursor.hide();
        this.subObjects.cursor.flash(300);
        document.addEventListener('keypress', e => {
            if (!this.focused || e.key === 'Enter') {
                return;
            }

            if (this.value.length === this.cursorIndex) {
                this.value += e.key;
                this.cursorIndex++;
            } else if (this.value.length === this.cursorIndex) {
                this.value = e.key + this.value;
            } else {
                this.value = this.value.slice(0, this.cursorIndex) + e.key + this.value.slice(this.cursorIndex, this.value.length);
                this.cursorIndex++;
            }
            this.updateText();
        });
        document.addEventListener('keydown', e => {
            if (!this.focused || empty(this.value)) {
                return;
            }
            switch (e.key) {
                case 'Backspace':
                    if (this.value.length === this.cursorIndex) {
                        this.value = this.value.slice(0, this.value.length - 1);
                    } else {
                        this.value = this.value.slice(0, this.cursorIndex - 1) + this.value.slice(this.cursorIndex, this.value.length);
                    }
                    this.cursorIndex--;
                    this.updateText();
                    break;
                case 'Enter':
                    this.onEnter(e);
                    break;
                case 'ArrowRight':
                    if (this.cursorIndex + 1 > this.value.length) {
                        break;
                    }
                    this.cursorIndex++;
                    break;
                case 'ArrowLeft':
                    if (this.cursorIndex === 0) {
                        break;
                    }
                    this.cursorIndex--;
                    break;
            }
        });
    }

    updateText() {
        this.subObjects.text.text = this.value;
        console.log(this.value.length);
    }

    init(canvas, ctx) {
        if (!this.width || !this.height) {
            this.subObjects.placeholder.render(ctx, canvas);
            if (!this.width) {
                this.width = ctx.measureText(this.subObjects.placeholder.text).width + 30;
            }
            if (!this.height) {
                this.height = Math.ceil(parseInt(this.subObjects.placeholder.size)) + 30;
            }
        }

        this.subObjects.cursor.height = this.height - 20;
    }

    tick(ctx) {
        this.subObjects.placeholder.hidden = !empty(this.value);

        if (this.value) {
            this.subObjects.cursor.x = 15 + ctx.measureText(this.value.slice(0, this.cursorIndex)).width;
        } else {
            this.subObjects.cursor.x = 15;
        }

        const textWidth = 15 + ctx.measureText(this.value).width;
        if (textWidth > this.width) {
            this.subObjects.cursor.x = this.width;
        }
        this.subObjects.text.maxWidth = this.width - this.subObjects.placeholder.x;
    }

    onEnter(event) {
        //
    }

    onClick(ctx, canvas) {
        this.focused = true;
        this.subObjects.cursor.hidden = false;
    }

    onClickOutside(ctx, canvas) {
        this.focused = false;
        this.subObjects.cursor.hidden = true;
    }

    onHover(ctx, canvas) {
        this.opacity = 90;
    }

    onHoverEnd(ctx, canvas) {
        this.opacity = 100;
    }
}
