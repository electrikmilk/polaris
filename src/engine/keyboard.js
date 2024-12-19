/*
 * Keyboard abstraction
 */

const keyCallbacks = {
    'keydown': [],
    'keyup': [],
    'keypress': [],
};

const keyMap = {
    'up': 'ArrowUp',
    'left': 'ArrowLeft',
    'right': 'ArrowRight',
    'down': 'ArrowDown',
};

for (const state in keyCallbacks) {
    document.addEventListener(state, (e) => {
        if (keyCallbacks[state].length === 0) {
            return;
        }
        let pressed = [];
        if (e.key) {
            pressed.push(e.key.toLowerCase());
        }
        if (e.metaKey) {
            pressed.push('meta');
        }
        if (e.shiftKey) {
            pressed.push('shift');
        }
        if (e.ctrlKey) {
            pressed.push('ctrl');
        }
        if (e.altKey) {
            pressed.push('alt');
        }
        pressed = pressed.sort();
        if (keyCallbacks[state].length !== 0) {
            keyCallbacks[state].forEach((c) => c(pressed));
        }
    });
}

export const Key = {
    up: (keys, callback) => {
        Key.on(keys, 'keyup', callback);
    },
    down: (keys, callback) => {
        Key.on(keys, 'keydown', callback);
    },
    pressed: (keys, callback) => {
        Key.on(keys, 'keypress', callback);
    },
    on: (keys, state, callback) => {
        if (!Object.keys(keyCallbacks).includes(state)) {
            throw new Error(`Invalid key state "${state}".`);
        }
        if (keys.constructor !== Array) {
            throw new Error('Keys must be an array!');
        }
        keys = keys.map(k => keyMap[k] ?? k).map(k => k.toLowerCase()).sort();
        keyCallbacks[state].push((pressed) => {
            const equal = keys.every(function(element, index) {
                return element === pressed[index];
            });
            if (pressed.length !== keys.length || !equal) {
                return;
            }

            callback();
        });
    },
    clear() {
        for (const state in keyCallbacks) {
            keyCallbacks[state] = [];
        }
        if (import.meta.env.DEV) {
            console.info('cleared key callbacks', keyCallbacks);
        }
    },
};
