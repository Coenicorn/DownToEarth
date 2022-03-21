import { GameObject } from "./gameobject/entity";

export default class InputHandler {
    keys: string[];

    // opting out of type checking go brrrrrrr
    boundTo: any;

    constructor() {
        this.keys = [];
        this.boundTo = null;

        addEventListener("keydown", this.keyPressed.bind(this));
        addEventListener("keyup", this.keyReleased.bind(this));
    }

    bind(obj: GameObject) {
        this.boundTo = obj;
    }

    keyPressed(key: KeyboardEvent) {
        if (!this.keys.includes(key.key)) this.keys.push(key.key);
    }

    keyReleased(key: KeyboardEvent) {
        try {
            this.keys.splice(this.keys.indexOf(key.key));
        } catch (e) { }
    }
}