import { Vec2 } from "./physics";
import { GameObject } from "./gameObject";
import { Renderer } from "../renderer";
import { entityManager } from "./entityManager";
import { Particle, ParticleManager } from "./particle";

export class Rock extends GameObject {
    mass: number;

    constructor(pos: Vec2, size: number, sprite: HTMLImageElement, vel?: Vec2) {
        super(pos, { x: size, y: size }, sprite);

        this.mass = size;

        this.velocity = vel || {
            x: Math.random() * 6 - 3,
            y: 0
        }
    }

    init(): void {
    }

    tick(): void {
        this.velocity.y += 5 / this.mass;

        ParticleManager.newParticle(new Particle({ x: this.position.x + this.dimensions.x / 2, y: this.position.y + this.dimensions.y / 2 }, { x: Math.random() * 4 - 2, y: Math.random() * 4 - 2 }, 3, "red", 1000));

        if (this.onground) this.break()
        this.position.y += this.velocity.y;

        let pos = Renderer.getScreenPosition(this.position);

        if (pos.x < -1000 || pos.x > Renderer.width + 1000) {
            this.alive = false;
        }
    }

    break() {
        for (let i = 0; i < 10; i++) {
            ParticleManager.newParticle(new Particle({ x: this.position.x, y: this.position.y }, { x: Math.random() * 4 - 2, y: Math.random() * 4 - 2 }, 3, "gray", 500));
        }

        this.alive = false;

        if (this.dimensions.x < 50) return;

        entityManager.newEntity(new Rock({ x: this.position.x, y: this.position.y - 10 }, this.dimensions.x / 2, this.sprite, { x: Math.random() * 6 - 3, y: -this.velocity.y / 2 }));
        entityManager.newEntity(new Rock({ x: this.position.x, y: this.position.y - 10 }, this.dimensions.x / 2, this.sprite, { x: Math.random() * 6 - 3, y: -this.velocity.y / 2 }));
    }
}