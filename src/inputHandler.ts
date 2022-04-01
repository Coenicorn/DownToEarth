interface KeyBinding {
    [key: string]: Function;
}

export class InputHandler {
    keys: string[];
    keyBinds: KeyBinding;

    constructor(kb: KeyBinding) {
        this.keys = [];
        this.keyBinds = kb;

        addEventListener("keydown", this.keyPressed.bind(this));
        addEventListener("keyup", this.keyReleased.bind(this));
    }

    keyPressed(key: KeyboardEvent) {
        if (!this.keys.includes(key.key)) this.keys.push(key.key);
    }

    keyReleased(key: KeyboardEvent) {
        try {
            this.keys.splice(this.keys.indexOf(key.key), 1);
        } catch (e) { }
    }

    releaseAllkeys() {
        this.keys = [];
    }

    handleKeys() {
        for (let key of this.keys) {
            try {
                this.keyBinds[key]();
            } catch (e) { }
        }
    }
}