export class Character {
    name;
    image = null;

    constructor(name, image = null) {
        this.name = name;
        this.image = image;
    }
}
