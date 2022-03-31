interface KeyBinding {
    [key: string]: Function;
}
export declare class InputHandler {
    keys: string[];
    keyBinds: KeyBinding;
    constructor(kb: KeyBinding);
    keyPressed(key: KeyboardEvent): void;
    keyReleased(key: KeyboardEvent): void;
    handleKeys(): void;
}
export {};
