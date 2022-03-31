import { Renderer } from "../renderer";
import { Level } from "../level";
import { Vec2 } from "./physics";
export declare abstract class GameObject {
    position: Vec2;
    dimensions: Vec2;
    velocity: Vec2;
    acceleration: Vec2;
    onground: boolean;
    maxSpeed: number;
    /**
     * @param {Vec2} pos The initial position of the GameObject
     * @param {Vec2} dim The width and height of the GameObject as a vector
     */
    constructor(pos: Vec2, dim: Vec2, maxSpeed: number);
    update(): void;
    collideLevel(level: Level): void;
    abstract tick(): void;
    abstract render(renderer: Renderer): void;
}
export declare class Rock extends GameObject {
    constructor(pos: Vec2, dim: Vec2);
    render(renderer: Renderer): void;
    tick(): void;
}
export declare class Player extends GameObject {
    alive: boolean;
    speed: number;
    constructor(pos: Vec2, dim: Vec2);
    tick(): void;
    render(renderer: Renderer): void;
    move(dir: number): void;
}
