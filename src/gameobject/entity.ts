import { renderer } from "../renderer";
import { Vec2, Line } from "./physics";
import { level } from "../level";

export abstract class GameObject {
    position: Vec2;
    dimensions: Vec2;
    velocity: Vec2;
    acceleration: Vec2;
    onground: boolean;
    maxSpeed: number;
    mass: number;
    id: string;
    sprite: HTMLImageElement;
    gravity: number;

    /**
     * @param {Vec2} pos The initial position of the GameObject
     * @param {Vec2} dim The width and height of the GameObject as a vector
     */

    constructor(pos: Vec2, dim: Vec2, maxSpeed: number, id: string, sprite: HTMLImageElement, mass: number, gravity: number) {
        this.position = pos;
        this.dimensions = dim;
        this.velocity = Vec2.zeroVector;
        this.acceleration = Vec2.zeroVector;
        this.onground = false;
        this.maxSpeed = maxSpeed;
        this.mass = mass;
        this.gravity = gravity;
        this.id = id;
        this.sprite = sprite;

        this.init();
    }

    applyForce(force: Vec2): void {
        // f = ma
        force.x /= this.mass;
        force.y /= this.mass;

        this.acceleration.add(force);
    }

    update(deltaTime: number): void {
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        // limit speed
        if (this.velocity.x > this.maxSpeed) this.velocity.x = this.maxSpeed;
        if (this.velocity.x < -this.maxSpeed) this.velocity.x = -this.maxSpeed;

        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;

        // air resistance or whatever
        if (this.acceleration.x == 0) this.velocity.x *= 0.9;
        if (this.acceleration.y == 0) this.velocity.y *= 0.9;

        this.acceleration = Vec2.zeroVector;

        this.onground = false;
        this.applyForce(new Vec2(0, this.gravity));

        this.tick();
    }

    render(): void {
        renderer.translateRelative(this.position);

        // renderer.color("red");
        // renderer.drawRectangle(0, 0, this.dimensions.x, this.dimensions.y);
        renderer.drawSprite(this.sprite, 0, 0, this.dimensions.x, this.dimensions.y);

        renderer.translateRelative(new Vec2(0, 0));
    }

    abstract init(): void;
    abstract tick(): void;
}

export class Rock extends GameObject {
    constructor(pos: Vec2, size: number, sprite: HTMLImageElement) {
        super(pos, new Vec2(size, size), 10, "rock", sprite, size, 9.81);
    }

    init(): void {
        this.velocity = new Vec2(
            Math.round(Math.random() * 10 - 5),
            0
        );
    }

    tick(): void {
        // level collision
        let lines = level.getCollidingLines(this);

        for (let i = 0, l = lines.length; i < l; i++) {
            while (lines[i].intersectsAABB(this)) {
                this.position.y -= .5;
            }

            this.onground = true;

            this.velocity.y = 0;
        }
    }
}

export class Player extends GameObject {
    alive: boolean;

    speed: number;

    constructor(pos: Vec2, dim: Vec2, sprite: HTMLImageElement) {
        super(pos, dim, 10, "player", sprite, 10, 9.81);

        this.alive = true;
        this.speed = 2;
    }

    init(): void {
        return;
    }

    tick(): void {
        // level collision
        let lines = level.getCollidingLines(this);

        for (let i = 0, l = lines.length; i < l; i++) {
            while (lines[i].intersectsAABB(this)) {
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
                if (this.onground) this.acceleration.y = -20;
                break;
        }
    }
}