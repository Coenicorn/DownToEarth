export default class InputHandler {
    keys: string[];
    keybinds: Object;

    constructor(kb: Object) {
        this.keys = [];
        this.keybinds = kb;

        addEventListener("keydown", this.keyPressed.bind(this));
        addEventListener("keyup", this.keyReleased.bind(this));
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