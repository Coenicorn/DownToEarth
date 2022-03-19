import { Renderer } from "../renderer";
import { Vec2 } from "../types";

export abstract class GameObject {
    position: Vec2;
    velocity: Vec2;

    // for bounding
    dimensions: Vec2;

    constructor(pos: Vec2, vel: Vec2, dim: Vec2) {
        this.position = pos;
        this.velocity = vel;
        this.dimensions = dim;
    }

    abstract update(deltaTime: number): void;
    abstract render(renderer: Renderer): void;
    abstract collide(object: GameObject): void;
}

export class Player extends GameObject {
    speed: number;
    maxSpeed: number;

    alive: boolean;

    constructor(pos: Vec2, vel: Vec2, dim: Vec2) {
        super(pos, vel, dim);

        this.speed = 1;
        this.maxSpeed = 5;

        this.alive = true;
    }

    update(deltaTime: number): void {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
    }

    collide(object: GameObject): void {
        // handle collision somewhere in the future
    }

    render(renderer: Renderer): void {
        // bounding box visualization
        renderer.color("black");
        renderer.drawRectangle(renderer.width / 2 - this.dimensions.x / 2, renderer.height / 2 - this.dimensions.y / 2, this.dimensions.x, this.dimensions.y);
    }

    handleInput(keys: string[]): void {
        return;
    }
}