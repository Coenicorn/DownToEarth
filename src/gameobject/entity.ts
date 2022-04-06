import { Vec2, Line } from "./physics";
import { level } from "../level";
import { GameObject } from "./entityManager";

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