import { Rock } from "./entity";
import { storedAssets } from "../image";
import { GameObject } from "./gameObject";
import { Renderer } from "../Renderer";
import { Player } from "./player";
import { intersectsAABB } from "./physics";

class EntityManager {
    private entities: GameObject[];
    private timeSinceLastRock: number;
    private rockTimer: number;
    private player?: Player;

    constructor() {
        this.entities = [];
        this.timeSinceLastRock = Date.now();
        this.rockTimer = 500;
    }

    addPlayer(player: Player): void {
        this.player = player;
    }

    newEntity(entity: GameObject): void {
        if (this.entities.length >= 300) return;

        if (!this.entities.includes(entity)) this.entities.push(entity);
    }

    removeEntity(entity: GameObject): void {
        if (this.entities.includes(entity)) this.entities.splice(this.entities.indexOf(entity), 1);
    }

    update(deltaTime: number): void {
        this.player?.update(deltaTime);

        this.entities.forEach(entity => {
            entity.update(deltaTime);

            if (this.player && intersectsAABB(entity, this.player)) {
                this.player.alive = false;
            }

            if (!entity.alive) this.removeEntity(entity);
        });

        // check if new rock needs to be generated
        if (this.timeSinceLastRock < Date.now()) {
            this.generateRock();

            // 200 milliseconds between rock generations
            this.timeSinceLastRock = Date.now() + this.rockTimer;
            if (this.rockTimer > 100) this.rockTimer--;
        }
    }

    render(): void {
        this.player?.render();

        this.entities.forEach(entity => {
            entity.render();
        });
    }

    generateRock() {
        if (!this.player) return;
        let pos = { x: Math.random() * Renderer.width * 2 - Renderer.width + Renderer.camera.position.x + this.player.velocity.x * 500, y: -800 }

        this.newEntity(new Rock(pos, Math.random() * 50 + 50, storedAssets["rock1"]));
    }
}

export const entityManager = new EntityManager();