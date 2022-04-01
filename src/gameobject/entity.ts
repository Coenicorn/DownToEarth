import { Renderer } from "../renderer";
import { Level } from "../level";
import { Vec2, intersectsAABBLine, lineMeshFromPoints } from "./physics";
import { entityManager } from "./entityManager";

export abstract class GameObject {
    position: Vec2;
    dimensions: Vec2;
    velocity: Vec2;
    acceleration: Vec2;
    onground: boolean;
    maxSpeed: number;
    id: string;

    /**
     * @param {Vec2} pos The initial position of the GameObject
     * @param {Vec2} dim The width and height of the GameObject as a vector
     */

    constructor(pos: Vec2, dim: Vec2, maxSpeed: number, id: string) {
        this.position = pos;
        this.dimensions = dim;
        this.velocity = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0 };
        this.onground = false;
        this.maxSpeed = maxSpeed;
        this.id = id;
    }

    update(deltaTime: number): void {
        this.tick();

        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        // limit speed
        if (this.velocity.x > this.maxSpeed) this.velocity.x = this.maxSpeed;
        if (this.velocity.x < -this.maxSpeed) this.velocity.x = -this.maxSpeed;

        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;

        if (this.acceleration.x == 0) this.velocity.x *= 0.9;
        if (this.acceleration.y == 0) this.velocity.y *= 0.9;

        this.acceleration = { x: 0, y: 0 }

        this.onground = false;
    }

    collideLevel(level: Level): void {
        // get chunks player is in
        let chunks = [];
        chunks.push(level.getChunkAt(this.position.x));
        chunks.push(level.getChunkAt(this.position.x + this.dimensions.x));

        // for each line segment in said chunks, check for collisions of all line segments of the AABB
        chunks.forEach(chunk => {
            chunk?.mesh.forEach(line => {
                while (intersectsAABBLine(line, this)) {
                    this.velocity.y = 0;

                    this.position.x += line.surfaceNormal.x * .5;
                    this.position.y += line.surfaceNormal.y * .5;
                    this.velocity.x += line.surfaceNormal.x * .5;

                    // 0.5 because anything higher causes the player to vibrate on the ground as it moves it high enough
                    // for the rounding at rendering to render it a pixel higher
                    // this.position.y -= .4;

                    this.onground = true;
                }
            });
        });
    }

    abstract tick(): void;
    abstract render(renderer: Renderer): void;
}

export class Rock extends GameObject {
    constructor(pos: Vec2, size: number) {
        super(pos, { x: size, y: size }, 10, "rock");
    }

    render(renderer: Renderer): void {
        renderer.translateRelative(this.position);

        renderer.color("magenta");
        renderer.drawRectangle(0, 0, this.dimensions.x, this.dimensions.y);

        renderer.translateRelative({ x: 0, y: 0 });
    }

    tick(): void {
        if (!this.onground) this.acceleration.y = .1;
    }
}

export class Player extends GameObject {
    alive: boolean;

    speed: number;

    constructor(pos: Vec2, dim: Vec2) {
        super(pos, dim, 10, "player");

        this.alive = true;
        this.speed = 2;
    }

    tick(): void {
        if (!this.onground) this.acceleration.y = 1;

        this.velocity.x = 5;
    }

    render(renderer: Renderer): void {
        renderer.translateRelative(this.position);

        renderer.color("red");
        renderer.drawRectangle(0, 0, this.dimensions.x, this.dimensions.y);

        renderer.translateRelative({ x: 0, y: 0 });
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