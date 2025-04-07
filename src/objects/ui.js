import {COLOR_BLACK, COLOR_GRAY, COLOR_ORANGE, COLOR_WHITE, DEFAULT_SHADOW, empty} from '../engine/util.js';
import {CanvasBox, CanvasRoundedBox} from './shapes.js';
import {CanvasText} from './text.js';
import {CanvasObject} from '../main.js';

export class CanvasButton extends CanvasRoundedBox {
    fill = COLOR_ORANGE;
    radius = 5;
    shadow = DEFAULT_SHADOW;
    subObjects = {text: new CanvasText('Text', COLOR_BLACK)};
    cursor = 'pointer';

    constructor(label = null, x = 0, y = 0) {
        super();
        if (label) {
            this.subObjects.text = new CanvasText(label, COLOR_BLACK);
        }
        this.x = x;
        this.y = y;
        this.subObjects.text.x += 15;
        this.subObjects.text.y += 15;
        this.subObjects.text.cursor = 'pointer';
    }

    setLabel(newLabel) {
        this.subObjects.text = newLabel;
    }

    init(canvas, ctx) {
        this.subObjects.text.render(ctx, canvas);
        this.width = Math.ceil(ctx.measureText(this.subObjects.text.text).width + 30);
        this.height = Math.ceil(parseInt(this.subObjects.text.size) + 30);
    }
}

const CHECKED_CHARACTER = '\u2715';

export class CanvasCheckbox extends CanvasRoundedBox {
    fill = COLOR_WHITE;
    radius = 5;
    checked = false;
    height = 40;
    width = 40;
    shadow = DEFAULT_SHADOW;
    subObjects = {text: new CanvasText('', COLOR_BLACK)};
    cursor = 'pointer';

    constructor(checked = false, x = 0, y = 0) {
        super();
        this.checked = checked;
        this.updateState();

        this.x = x;
        this.y = y;
        this.subObjects.text.x += 11;
        this.subObjects.text.y += 9;
        this.subObjects.text.size = '25px';
        this.subObjects.text.cursor = 'pointer';
    }

    setLabel(newLabel) {
        this.subObjects.text = newLabel;
    }

    updateState() {
        this.subObjects.text.text = this.checked ? CHECKED_CHARACTER : '';
        this.fill = this.checked ? COLOR_ORANGE : COLOR_WHITE;
    }

    init(canvas, ctx) {
        this.subObjects.text.render(ctx, canvas);
    }

    onClick(ctx, canvas) {
        this.checked = !this.checked;
        this.updateState();
    }

    onChange(ctx, canvas) {
        //
    }
}

export class CanvasInput extends CanvasRoundedBox {
    fill = COLOR_WHITE;
    radius = 5;
    shadow = DEFAULT_SHADOW;
    focused = false;
    value = '';
    stroke = COLOR_GRAY;
    strokeWidth = 2;
    cursorIndex = 0;
    maxTextWidth = 0;
    cursor = 'text';

    constructor(placeholder = 'Click to type...', x = 0, y = 0) {
        super();
        this.x = x;
        this.y = y;

        this.subObjects = {
            text: new CanvasText('', COLOR_BLACK, 15, 16, this.maxTextWidth),
            placeholder: new CanvasText(placeholder, '#ababab', 15, 16, this.maxTextWidth),
            cursor: new CanvasBox(COLOR_BLACK, 15, 13, 1, 25),
        };
        this.subObjects.text.cursor = 'text';
        this.subObjects.placeholder.cursor = 'text';
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

        this.subObjects.cursor.height = this.height - 25;
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
        this.stroke = 'dodgerblue';
        this.subObjects.cursor.hidden = false;
    }

    onClickOutside(ctx, canvas) {
        this.focused = false;
        this.stroke = COLOR_GRAY;
        this.subObjects.cursor.hidden = true;
    }
}

export class CanvasForm extends CanvasObject {
    constructor(objects = {}) {
        super();
        let height = 20;
        for (const object in objects) {
            objects[object].y += objects[object].height + (height += 60);
        }
        Object.assign(this.subObjects, objects);
    }
}
