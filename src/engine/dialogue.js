import {CanvasText} from '../objects/text.js';
import {CanvasBox} from '../objects/shapes.js';
import {offBlack, offWhite} from './util.js';
import {Key} from './keyboard.js';

export class CanvasDialogueBox {
    box;
    text;
    name;
    lines = [];
    line = 0;
    onEndHandler = null;

    constructor(renderer, lines = [], position = 'bottom') {
        this.lines = lines;
        this.box = new DialogueBox(position);
        this.text = new CanvasDialogueText(lines[0]?.text ?? '', position);
        this.name = new CanvasDialogueLabel(lines[0]?.name ?? '', position);

        Key.down([' '], () => {
            if (this.line === (this.lines.length - 1)) {
                if (this.onEndHandler) {
                    this.onEndHandler(renderer.ctx, renderer.canvas);
                }

                return;
            }

            ++this.line;
            const line = this.lines[this.line];

            this.text.setDialogue(line.text);

            if (line.hasOwnProperty('name')) {
                this.name.text = line.name;
            } else {
                this.name.text = '';
            }
        });

        renderer.append(this.box, this.text, this.name);
    }

    show() {
        this.box.visible = true;
        this.text.visible = true;
        this.name.visible = true;
    }

    hide() {
        this.box.visible = false;
        this.text.visible = false;
        this.name.visible = false;
    }

    onEnd(handler) {
        this.onEndHandler = handler;
    }
}

class DialogueBox extends CanvasBox {
    order = 1;
    fill = offBlack;
    height = 120;
    opacity = 30;

    constructor(position) {
        super();

        this.x = this.margin;
        switch (position) {
            case 'top':
                this.y = this.margin;
                break;
            case 'bottom':
                this.y = 320;
                break;
        }
    }

    init(canvas) {
        this.width = this.marginWidth(canvas);
    }
}

export class CanvasDialogueText extends CanvasText {
    order = 2;
    fill = offWhite;

    dialogueText;
    char = 0;

    constructor(text, position) {
        super('');
        this.dialogueText = text;
        this.x = this.margin + 25;

        switch (position) {
            case 'top':
                this.y = 50;
                break;
            case 'bottom':
                this.y = 355;
                break;
        }
    }

    async tick(ctx, canvas) {
        if (this.text === this.dialogueText) {
            this.resizeText(ctx);
            return;
        }

        this.setText(ctx, this.text + this.dialogueText[this.char]);

        if (this.char <= this.dialogueText.length) {
            this.char++;
            // TODO: Play sound.
        }
        this.resizeText(ctx);
    }

    setDialogue(text) {
        this.text = '';
        this.char = 0;
        this.dialogueText = text;
    }
}

export class CanvasDialogueLabel extends CanvasText {
    fill = offWhite;
    font = 'Courier, monospace';

    constructor(text, position) {
        super(text);
        this.x = this.margin + 25;

        switch (position) {
            case 'top':
                this.y = 30;
                break;
            case 'bottom':
                this.y = 330;
                break;
        }
    }
}
