class InputLocal {
    private keys: Array<string> = [];
    private mouseXPos = 0;
    private mouseYPos = 0;

    constructor() {
        addEventListener("keydown", this.keyPress.bind(this));
        addEventListener("keyup", this.keyRelease.bind(this));
        addEventListener("mousemove", this.mouseMove.bind(this));
    }

    mouseMove(e: MouseEvent): void {
        let x = e.clientX;
        let y = e.clientY;

        this.mouseXPos = x;
        this.mouseYPos = y;
    }

    get mouseX(): number {
        return this.mouseXPos;
    }

    get mouseY(): number {
        return this.mouseYPos;
    }

    keyPress(event: KeyboardEvent): void {
        let key = event.key;

        if (!this.keys.includes(key)) this.keys.push(key);
    }

    keyRelease(event: KeyboardEvent): void {
        let key = event.key;

        if (this.keys.includes(key)) this.keys.splice(this.keys.indexOf(key), 1);
    }

    hasKey(key: string): boolean {
        return this.keys.includes(key);
    }
}

export const Input = new InputLocal();