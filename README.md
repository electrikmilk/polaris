# Polaris ✦

Polaris is designed to be an easy-to-use HTML5 canvas 2D game engine.

The typical canvas draw loop is abstracted to make drawing on a HTML5 canvas feel more like manipulating HTML DOM.

**For example:**

```javascript
new Game('#game', 640, 480, {
    'start-menu': new Scene((renderer) => {
        const text = new CanvasText("Hello, World!");

        renderer.append(text);
    })
})
```

Text, images, and shapes can be added to the canvas and continuously rendered by using or extending a class for each
object. We then append this object to a renderer object that is provided to the scene.

We can then change their appearance or behavior using properties and methods. These properties and methods can be
triggered or change their state based on keyboard input and a mouse input abstraction that determines which object the
user is clicking, hovering, etc. on.

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
- Dialogue and characters system (WIP!)
