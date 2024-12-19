/*
 * Initial game class.
 */

import playButtonIcon from '../assets/play.svg';
import {offBlack} from './util.js';

export class Game {
    container;
    canvas;
    width;
    height;
    scenes = {};
    currentScene = null;

    constructor(selector = '#game', width, height, scenes = {}) {
        this.width = width;
        this.height = height;

        this.container = document.querySelector(selector);
        if (!this.container) {
            throw new Error(`No element found for given selector "${selector}"!`);
        }
        if (this.container.tagName !== 'DIV') {
            console.warn(`Game container '${selector}' is not a </div> tag. This may not always cause an issue.`);
        }
        this.container.classList.add('polaris-container');
        this.container.style.width = width + 'px';
        this.container.style.height = height + 'px';
        this.container.style.backgroundColor = offBlack;

        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;

        this.scenes = scenes;

        this.playPrompt();
    }

    // Get initial user interaction so we can play audio.
    playPrompt() {
        const playButton = document.createElement('img');
        playButton.src = playButtonIcon;
        playButton.width = 100;
        playButton.height = 100;
        playButton.onclick = () => {
            this.container.innerHTML = '';
            this.container.append(this.canvas);
            this.start();
        };

        this.container.append(playButton);
    }

    start() {
        if (this.scenes.length === 0) {
            return;
        }

        const firstKey = Object.keys(this.scenes)[0];
        this.loadScene(firstKey);
    }

    loadScene(key) {
        this.load(this.scenes[key]);
    }

    load(scene) {
        if (this.currentScene) {
            this.currentScene.stop();
        }

        this.currentScene = scene;
        this.currentScene.start(this.canvas, this.width, this.height);
    }
}
