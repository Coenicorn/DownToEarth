import { Vec2 } from "./physics";
import { GameObject } from "./entityManager";

export class Rock extends GameObject {
    mass: number;

    constructor(pos: Vec2, size: number, sprite: HTMLImageElement) {
        super(pos, { x: size, y: size }, sprite);

        this.mass = size;
    }

    init(): void {
    }

    tick(): void {
        this.velocity.y += 5 / this.mass;
    }
}

export class Player extends GameObject {
    alive: boolean;
    maxSpeed: number;

    speed: number;

    constructor(pos: Vec2, dim: Vec2, sprite: HTMLImageElement) {
        super(pos, dim, sprite);

        this.alive = true;
        this.speed = 2;
        this.maxSpeed = 10;
    }

    init(): void {
    }

    tick(): void {
        if (this.velocity.x > this.maxSpeed) this.velocity.x = this.maxSpeed;
        if (this.velocity.x < -this.maxSpeed) this.velocity.x = -this.maxSpeed;

        this.velocity.x *= 0.95;

        this.velocity.y += 1;
    }

    move(dir: number): void {
        switch (dir) {
            case 0:
                // left
                this.velocity.x -= this.speed;
                break;
            case 1:
                // right
                this.velocity.x += this.speed;
                break;
            case 2:
                // jump
                if (this.onground) this.velocity.y -= 20;
                break;
        }
    }
}