import { Vec2 } from "./physics";
import { GameObject } from "./gameObject";
import { Time } from "../time";

export class Player extends GameObject {
    alive: boolean;
    maxSpeed: number;

    speed: number;

    constructor(pos: Vec2, dim: Vec2, sprite: HTMLImageElement) {
        super(pos, dim, sprite);

        this.alive = false;
        this.speed = 2;
        this.maxSpeed = 10;
    }

    reset(): void {
        this.position = { x: 0, y: -200 }
        this.velocity = { x: 0, y: 0 }
    }

    init(): void {
    }

    tick(): void {
        if (this.velocity.x > this.maxSpeed) this.velocity.x = this.maxSpeed;
        if (this.velocity.x < -this.maxSpeed) this.velocity.x = -this.maxSpeed;

        if (this.onground) this.velocity.y = 0;

        this.velocity.x *= 0.95;

        this.velocity.y += 1 * Time.deltaTime;
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