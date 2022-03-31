import { Vec2 } from "../types";
import { Renderer } from "../renderer";
import { Level } from "../level";

export abstract class GameObject {
    position: Vec2;
    velocity: Vec2;
    acceleration: Vec2;

    dimensions: Vec2;

    /**
     * @param {Vec2} pos The initial position of the GameObject
     * @param {Vec2} dim The width and height of the GameObject as a vector
     */

    constructor(pos: Vec2, dim: Vec2) {
        this.position = pos;
        this.velocity = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0 };

        this.dimensions = dim;
    }

    abstract update(): void;
    abstract render(renderer: Renderer): void;

    collideLevel(level: Level): void {
        let c = level.getChunkAt(this.position.x);

        console.log(c);
    }
}

export class Rock extends GameObject {
    constructor(pos: Vec2, dim: Vec2) {
        super(pos, dim);
    }

    update(): void {

    }

    render(renderer: Renderer): void {
        renderer.translate(this.position);

        renderer.color("green");
        renderer.drawRectangle(this.position.x, this.position.y, this.dimensions.x, this.dimensions.y);

        renderer.translate({ x: 0, y: 0 });
    }
}

export class Player extends GameObject {
    alive: boolean;

    speed: number;
    maxSpeed: number;

    constructor(pos: Vec2, dim: Vec2) {
        super(pos, dim);

        this.alive = true;
        this.speed = 2;
        this.maxSpeed = 6;
    }

    update(): void {
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        // limit speed
        if (this.velocity.x > this.maxSpeed) this.velocity.x = this.maxSpeed;
        if (this.velocity.x < -this.maxSpeed) this.velocity.x = -this.maxSpeed;
        if (this.velocity.y > this.maxSpeed) this.velocity.y = this.maxSpeed;
        if (this.velocity.y < -this.maxSpeed) this.velocity.y = -this.maxSpeed;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.acceleration.x == 0) this.velocity.x *= 0.9;
        if (this.acceleration.y == 0) this.velocity.y *= 0.9;

        this.acceleration = { x: 0, y: 0 }
    }

    render(renderer: Renderer): void {
        renderer.translateToScreenCoordinates({ x: renderer.center.x, y: renderer.center.y });

        renderer.color("red");
        renderer.drawRectangle(0, 0, this.dimensions.x, this.dimensions.y);

        renderer.translate({ x: 0, y: 0 });
    }

    move(dir: number): void {
        switch (dir) {
            case 0:
                // up
                this.acceleration.y = -this.speed;
                break;
            case 1:
                // down
                this.acceleration.y = this.speed;
                break;
            case 2:
                // left
                this.acceleration.x = -this.speed;
                break;
            case 3:
                // right
                this.acceleration.x = this.speed;
                break;
        }
    }
}