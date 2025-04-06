# Polaris ✦

[Docs](https://github.com/electrikmilk/polaris/wiki)

Polaris is a WIP HTML5 canvas 2D game engine.

Designed to be easy-to-use and quick to get started, the typical canvas draw loop is abstracted to make drawing on an HTML5 canvas feel more like manipulating HTML DOM.

**For example:**

We create a game for which we give an HTML selector for where the canvas should go and its dimensions. We then provide the game with a starting scene, which will be automatically loaded as it is the first scene. A scene is provided a renderer unique to that scene, the renderer class handles rendering to the canvas.

```javascript
new Game('#game', 640, 480, {
    'start-menu': new Scene((renderer) => {
        const text = new CanvasText("Hello, World!");

        renderer.append(text);
    })
})
```

Text, images, and shapes can be added to the canvas renderer for the scene and continuously rendered. We can extend classes for each
object to make unique objects like the player character, enemies, etc. We then append this object to a renderer object provided to the scene to draw it.

We can then change their appearance or behavior using properties and methods. These properties and methods can be
triggered or change their state based on keyboard input and a mouse input abstraction that determines which object the user is clicking, hovering, etc.

```javascript
class RedBox extends CanvasBox {
    contstructor() {
        super(0, 0, 100, 100);
        this.fill = 'red';
    }

    onClick(ctx, canvas) {
        this.fill = 'green';
    }
}
```

### ...And more

- Collision detection
- Animation
- UI (textbox, buttons, etc.)
- Dialogue and characters system (WIP!)
