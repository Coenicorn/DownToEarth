import { Vec2 } from "../types";
import { Renderer } from "../renderer";
import { Level } from "../level";
export declare abstract class GameObject {
    position: Vec2;
    velocity: Vec2;
    acceleration: Vec2;
    dimensions: Vec2;
    /**
     * @param {Vec2} pos The initial position of the GameObject
     * @param {Vec2} dim The width and height of the GameObject as a vector
     */
    constructor(pos: Vec2, dim: Vec2);
    abstract update(): void;
    abstract render(renderer: Renderer): void;
    collideLevel(level: Level): void;
}
export declare class Rock extends GameObject {
    constructor(pos: Vec2, dim: Vec2);
    update(): void;
    render(renderer: Renderer): void;
}
export declare class Player extends GameObject {
    alive: boolean;
    speed: number;
    maxSpeed: number;
    constructor(pos: Vec2, dim: Vec2);
    update(): void;
    render(renderer: Renderer): void;
    move(dir: number): void;
}
