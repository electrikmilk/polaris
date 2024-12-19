/*
 * Canvas object images.
 */

import {CanvasBox} from './shapes.js';
import {CanvasObject} from './object.js';

export class CanvasImage extends CanvasObject {
    order = 1;
    image = new Image();
    loading = 'eager';

    constructor(image, x = 0, y = 0, width = 0, height = 0) {
        super();
        this.setImage(image);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    render(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    setImage(src) {
        this.image.src = src;
        this.image.loading = this.loading;
        this.image.onload = (e) => {
            this.onLoad(e);

            if (this.width && this.height) {
                return;
            }
            if (!this.width) {
                this.width = this.image.naturalWidth;
            }
            if (!this.height) {
                this.height = this.image.naturalHeight;
            }

            console.warn('Dimensions for canvas object were determined by the size of the image as either no width or height were explicitly set.', this);
        };
    }

    onLoad(e) {
        //
    }
}

export class CanvasPattern extends CanvasImage {
    order = 0;

    constructor(x, y, width, height) {
        super(x, y, width, height);
    }

    render(ctx, canvas) {
        ctx.createPattern(this.image, 'repeat');
    }
}

export class CanvasBackground extends CanvasBox {
    order = 0;

    init(canvas) {
        this.width = canvas.width;
        this.height = canvas.height;
    }
}

export class CanvasImageBackground extends CanvasImage {
    order = 0;

    constructor(image) {
        super(image, 0, 0);
    }

    init(canvas) {
        this.width = canvas.width / 2;
        this.height = canvas.height / 2;
    }
}