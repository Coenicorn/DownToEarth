import { Vec2 } from "./physics";
import { Renderer } from "../Renderer";
import { level } from "../level";

export abstract class GameObject {
    position: Vec2;
    velocity: Vec2;
    dimensions: Vec2;
    sprite: HTMLImageElement;

    onground: boolean;

    /**
     * @param {Vec2} pos The initial position of the GameObject
     * @param {Vec2} dim The width and height of the GameObject as a vector
     */

    constructor(pos: Vec2, dim: Vec2, sprite: HTMLImageElement) {
        this.position = pos;
        this.dimensions = dim;
        this.velocity = { x: 0, y: 0 }
        this.sprite = sprite;

        this.onground = false;

        this.init();
    }

    update(deltaTime: number): void {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;

        this.onground = false;

        // level collision
        let lines = level.getCollidingLines(this);

        for (let i = 0, l = lines.length; i < l; i++) {
            while (lines[i].intersectsAABB(this)) {
                this.position.y -= .5;
            }

            this.onground = true;

            this.velocity.y = 0;
        }

        this.tick();
    }

    render(): void {
        Renderer.translateRelative(this.position);

        // Renderer.color("red");
        // Renderer.drawRectangle(0, 0, this.dimensions.x, this.dimensions.y);
        Renderer.drawSprite(this.sprite, 0, 0, this.dimensions.x, this.dimensions.y);

        Renderer.translateRelative({ x: 0, y: 0 });
    }

    abstract init(): void;
    abstract tick(): void;
}

class EntityManager {
    private entities: GameObject[];

    constructor() {
        this.entities = [];
    }

    newEntity(entity: GameObject): void {
        if (!this.entities.includes(entity)) this.entities.push(entity);
    }

    removeEntity(entity: GameObject): void {
        if (this.entities.includes(entity)) this.entities.splice(this.entities.indexOf(entity), 1);
    }

    update(deltaTime: number): void {
        this.entities.forEach(entity => {
            entity.update(deltaTime);
        });
    }

    render(): void {
        this.entities.forEach(entity => {
            entity.render();
        });
    }
}

const entityManager = new EntityManager();

export { entityManager };