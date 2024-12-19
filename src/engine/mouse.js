export let Mouse;

export let MOUSE_UP = false;
export let MOUSE_DOWN = false;

// Initialize canvas object mouse tracking with a provided renderer.
export function initMouse(renderer) {
    Mouse = new CanvasMouse(renderer);
}

export class CanvasMouse {
    renderer;
    x = 0;
    y = 0;
    width = 32;
    height = 32;
    shape = 'rectangle';

    constructor(renderer) {
        this.renderer = renderer;

        // Center the mouse.
        this.x = this.renderer.canvas.width / 2;
        this.y = this.renderer.canvas.height / 2;

        this.track();
    }

    track() {
        this.renderer.canvas.addEventListener('mousemove', (e) => {
            const x = e.pageX - this.renderer.canvas.offsetLeft;
            const y = e.pageY - this.renderer.canvas.offsetTop;
            this.x = x;
            this.y = y;
        });
        this.renderer.canvas.addEventListener('mousedown', (e) => {
            MOUSE_DOWN = true;
            MOUSE_UP = false;
        });
        this.renderer.canvas.addEventListener('mouseup', (e) => {
            MOUSE_DOWN = false;
            MOUSE_UP = true;
            setTimeout(() => MOUSE_UP = false, 100);
        });
    }
}
