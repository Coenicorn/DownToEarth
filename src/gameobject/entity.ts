import { renderer } from "../renderer";
import { Vec2, intersectsAABBLine } from "./physics";
import { level } from "../level";

export abstract class GameObject {
    position: Vec2;
    dimensions: Vec2;
    velocity: Vec2;
    acceleration: Vec2;
    onground: boolean;
    maxSpeed: number;
    id: string;
    sprite: HTMLImageElement;

    /**
     * @param {Vec2} pos The initial position of the GameObject
     * @param {Vec2} dim The width and height of the GameObject as a vector
     */

    constructor(pos: Vec2, dim: Vec2, maxSpeed: number, id: string, sprite: HTMLImageElement) {
        this.position = pos;
        this.dimensions = dim;
        this.velocity = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0 };
        this.onground = false;
        this.maxSpeed = maxSpeed;
        this.id = id;
        this.sprite = sprite;

        this.init();
    }

    update(deltaTime: number): void {
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        // limit speed
        if (this.velocity.x > this.maxSpeed) this.velocity.x = this.maxSpeed;
        if (this.velocity.x < -this.maxSpeed) this.velocity.x = -this.maxSpeed;

        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;

        this.acceleration = { x: 0, y: 0 }

        this.onground = false;

        this.tick();
    }

    render(): void {
        renderer.translateRelative(this.position);

        renderer.color("red");
        renderer.drawRectangle(0, 0, this.dimensions.x, this.dimensions.y);
        renderer.drawSprite(this.sprite, 0, 0, this.dimensions.x, this.dimensions.y);

        renderer.translateRelative({ x: 0, y: 0 });
    }

    abstract init(): void;
    abstract tick(): void;
}

export class Rock extends GameObject {
    mass: number

    constructor(pos: Vec2, size: number, sprite: HTMLImageElement) {
        super(pos, { x: size, y: size }, 10, "rock", sprite);

        this.mass = size;
    }

    init(): void {
        this.velocity = {
            x: Math.round(Math.random() * 10 - 5),
            y: 0
        }
    }

    tick(): void {
        // apply gravitational force 
        if (!this.onground) this.acceleration.y += 10 / this.mass;

        // get chunks player is in
        let lines = level.getCollidingLines(this);

        if (!lines.length) return;

        while (intersectsAABBLine(lines[0], this)) {
            this.position.y -= .5;
        }

        this.onground = true;

        this.velocity.y *= -.9;
    }
}

export class Player extends GameObject {
    alive: boolean;

    speed: number;

    constructor(pos: Vec2, dim: Vec2, sprite: HTMLImageElement) {
        super(pos, dim, 10, "player", sprite);

        this.alive = true;
        this.speed = 2;
    }

    init(): void {
        return;
    }

    tick(): void {
        if (!this.onground) this.velocity.y += .7;

        if (this.acceleration.x == 0) this.velocity.x *= 0.9;

        // level collision
        let lines = level.getCollidingLines(this);

        for (let i = 0, l = lines.length; i < l; i++) {
            while (intersectsAABBLine(lines[i], this)) {
                this.position.y -= .5;
            }

            this.onground = true;

            this.velocity.y = 0;
        }
    }

    move(dir: number): void {
        switch (dir) {
            case 0:
                // left
                this.acceleration.x = -this.speed;
                break;
            case 1:
                // right
                this.acceleration.x = this.speed;
                break;
            case 2:
                // jump
                if (this.onground) this.acceleration.y = -15;
                break;
        }
    }
}