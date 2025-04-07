import {CanvasShadow} from '../objects/object-effects.js';

export const DEV_ENV = import.meta.env.DEV;
export const DEBUG_COLORS = ['#ff00ff', '#00bbff', '#00ff0e'];
export const COLOR_BLACK = '#121212';
export const COLOR_WHITE = '#fafafa';
export const COLOR_ORANGE = '#f17619';
export const COLOR_GRAY = '#c7c7c7';
export const DEFAULT_SHADOW = new CanvasShadow('rgba(0,0,0,0.3)', 10);

export async function sleep(ms) {
    return await new Promise(resolve => setTimeout(resolve, ms));
}

export async function nextFrame() {
    await new Promise(resolve => setTimeout(resolve));
}

export const empty = value => {
    return value === undefined || typeof value === 'undefined' || value === null || (!value && value !== 0 && value !== false) || value.length === 0 || Object.is(value, {});
};

export function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
