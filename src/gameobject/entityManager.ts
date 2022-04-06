import { Vec2 } from "./physics";
import { Renderer } from "../Renderer";
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

        Renderer.translateRelative(new Vec2(0, 0));
    }

    abstract init(): void;
    abstract tick(): void;
}

class EntityManager {
    private entities: GameObject[];

    constructor() {
        this.entities = [];
    }

    getEntity(id: string): GameObject | null {
        for (let entity of this.entities) {
            if (entity.id == id) return entity;
        }

        return null;
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