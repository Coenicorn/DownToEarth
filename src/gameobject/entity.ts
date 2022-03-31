import { Renderer } from "../renderer";
import { Level } from "../level";
import { Vec2, intersectsAABBLine, lineMeshFromPoints } from "./physics";

export abstract class GameObject {
    position: Vec2;
    dimensions: Vec2;
    velocity: Vec2;
    acceleration: Vec2;
    onground: boolean;
    maxSpeed: number;

    /**
     * @param {Vec2} pos The initial position of the GameObject
     * @param {Vec2} dim The width and height of the GameObject as a vector
     */

    constructor(pos: Vec2, dim: Vec2, maxSpeed: number) {
        this.position = pos;
        this.dimensions = dim;
        this.velocity = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0 };
        this.onground = false;
        this.maxSpeed = maxSpeed;
    }

    update(): void {
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        // limit speed
        if (this.velocity.x > this.maxSpeed) this.velocity.x = this.maxSpeed;
        if (this.velocity.x < -this.maxSpeed) this.velocity.x = -this.maxSpeed;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

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

                    // this.position.x += line.surfaceNormal.x;
                    // this.position.y += line.surfaceNormal.y;

                    this.position.y -= 1;

                    this.onground = true;
                }
            });
        });
    }

    abstract tick(): void;
    abstract render(renderer: Renderer): void;
}

export class Rock extends GameObject {
    constructor(pos: Vec2, dim: Vec2) {
        super(pos, dim, 10);
    }

    render(renderer: Renderer): void {
        renderer.translate(this.position);

        renderer.color("magenta");
        renderer.drawRectangle(this.position.x, this.position.y, this.dimensions.x, this.dimensions.y);

        renderer.translate({ x: 0, y: 0 });
    }

    tick(): void {

    }
}

export class Player extends GameObject {
    alive: boolean;

    speed: number;

    constructor(pos: Vec2, dim: Vec2) {
        super(pos, dim, 10);

        this.alive = true;
        this.speed = 2;
    }

    tick(): void {

    }

    render(renderer: Renderer): void {
        renderer.translateToScreenCoordinates({ x: renderer.center.x, y: renderer.center.y });

        renderer.color("red");
        renderer.drawRectangle(0, 0, this.dimensions.x, this.dimensions.y);

        renderer.translate({ x: 0, y: 0 });
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