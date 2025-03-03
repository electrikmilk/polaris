import {CanvasBox, CanvasRoundedBox} from '../objects/shapes.js';
import {CanvasText} from '../objects/text.js';
import {Key} from './keyboard.js';
import {COLOR_BLACK, COLOR_WHITE, DEFAULT_SHADOW} from './util.js';
import {CanvasImage} from '../objects/images.js';

/*
standard:
['line 1','line 2']

character:
[
  {char: Character, image: CanvasImage, text: "Test", onEnd: () => {}}
]
*/

class CanvasDialogueLabel extends CanvasText {
    fill = COLOR_WHITE;
    shadow = DEFAULT_SHADOW;
    size = '20px';
    styles = ['bold'];
    font = 'Helvetica, sans-serif';
}

class CanvasDialogueText extends CanvasText {
    fill = COLOR_WHITE;
    shadow = DEFAULT_SHADOW;
    text = '';
}

export class CanvasDialogueBox extends CanvasRoundedBox {
    subObjects = {
        characterName: new CanvasDialogueLabel(''),
        dialogue: new CanvasDialogueText(''),
        moreDialogueIndicator: new CanvasBox(COLOR_WHITE, 0, 0, 20, 20),
    };
    dialogue = [];
    index = 0;
    radius = 5;
    fill = COLOR_BLACK;
    stroke = COLOR_WHITE;
    strokeWidth = 2;
    shadow = DEFAULT_SHADOW;

    constructor(dialogue = [], x = 10, y = 10, width = 500, height = 100) {
        super();
        this.load(dialogue);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.subObjects.characterName.x += 10;
        this.subObjects.characterName.y += 10;

        this.subObjects.dialogue.x += 10;
        this.subObjects.dialogue.y += 40;

        this.loadCurrentLine();
        Key.down([' '], () => {
            if (this.dialogue.length === this.index + 1) {
                this.hide();
                return;
            }

            if (typeof this.dialogue.length[this.index] === 'object' && this.dialogue[this.index].hasOwnProperty('onEnd')) {
                this.dialogue.length[this.index].onEnd();
            }

            this.index++;
            this.loadCurrentLine();
            if (this.dialogue.length === this.index + 1) {
                this.subObjects.moreDialogueIndicator.hide();
            } else {
                this.subObjects.moreDialogueIndicator.show();
            }
        });
    }

    init(canvas) {
        this.width = (canvas.width / 2) - 20;

        this.subObjects.moreDialogueIndicator.x = (canvas.width / 4) - 20;
        this.subObjects.moreDialogueIndicator.y = this.height - 30;
        this.subObjects.moreDialogueIndicator.flash(500);
    }

    load(dialogue) {
        if (!Array.isArray(dialogue)) {
            console.warn(`Unable to load dialogue: ${dialogue}`);
            throw new Error('Dialogue must be an Array');
        }

        this.dialogue = dialogue;
    }

    loadCurrentLine() {
        const line = this.dialogue[this.index];
        if (this.subObjects.hasOwnProperty('characterImage')) {
            delete this.subObjects.characterImage;
        }

        if (typeof line === 'object') {
            this.subObjects.characterName.text = line.char.name;
            this.subObjects.dialogue.text = line.text;

            if (line.hasOwnProperty('image')) {
                this.subObjects.characterImage = new CanvasImage(line.image, this.width - 110, 0, 100, 100);
            }
        } else if (typeof line === 'string') {
            this.subObjects.characterName.text = '';
            this.subObjects.dialogue.text = line;
        }
    }
}
