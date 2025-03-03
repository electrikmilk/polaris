export class Character {
    name;
    images = [];

    constructor(name, images = []) {
        this.name = name;
        this.images = images;
    }
}
