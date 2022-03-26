import { Camera, Renderer } from "../renderer";
import { Vec2 } from "../types";
import { Line, createRectangle } from "../mesh";

export abstract class GameObject {
    position: Vec2;
    velocity: Vec2;
    acceleration: Vec2;

    mesh: Line[];

    constructor(pos: Vec2, mesh: Line[]) {
        this.position = pos;
        this.velocity = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0 }
        this.mesh = mesh;
    }

    abstract update(deltaTime: number): void;
    abstract render(camera: Camera): void;
    abstract collide(mesh: Line[]): void;
}

export class Rock extends GameObject {
    constructor(pos: Vec2, dim: Vec2) {
        super(pos, createRectangle(pos.x, pos.y, dim.x, dim.y));
    }

    update(deltaTime: number): void {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;

        this.velocity.x *= 0.9;
        this.velocity.y *= 0.9;
    }

    collide(mesh: Line[]): void {
        for (let line of mesh) {
            for (let line2 of this.mesh) {
                line.intersect(line2)
            }
        }
    }

    render(camera: Camera): void {
        camera.viewport.color("red");
        camera.viewport.drawLineMesh(this.mesh, true);
    }
}

export class Player extends GameObject {
    maxSpeed: number;
    speed: number;

    alive: boolean;

    constructor(pos: Vec2, dim: Vec2) {
        super(pos, createRectangle(pos.x, pos.y, dim.x, dim.y));

        console.log(this.mesh);

        this.speed = 2;
        this.maxSpeed = 10;

        this.alive = true;
    }

    update(deltaTime: number): void {
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        // limit velocity
        if (this.velocity.x > this.maxSpeed) this.velocity.x = this.maxSpeed;
        if (this.velocity.x < -this.maxSpeed) this.velocity.x = -this.maxSpeed;
        if (this.velocity.y > this.maxSpeed) this.velocity.y = this.maxSpeed;
        if (this.velocity.y < -this.maxSpeed) this.velocity.y = -this.maxSpeed;

        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;

        if (this.acceleration.x == 0) this.velocity.x *= 0.9;
        if (this.acceleration.y == 0) this.velocity.y *= 0.9;

        this.acceleration = { x: 0, y: 0 }
    }

    collide(mesh: Line[]): void {
        return;
    }

    render(camera: Camera): void {
        camera.viewport.translate(camera.viewport.width / 2, camera.viewport.height / 2);

        // bounding box visualization
        camera.viewport.color("green");
        camera.viewport.drawLineMesh(this.mesh, true);

        camera.viewport.translateVec2(camera.position);
    }

    move(type: number) {
        switch (type) {
            case 0:
                // jump
                break;
            case 1:
                // left

                this.acceleration.x -= this.speed;

                break;
            case 2:
                // right

                this.acceleration.x += this.speed;

                break;
            case 3:
                // up

                this.acceleration.y += this.speed;

                break;
            case 4:
                // down

                this.acceleration.y -= this.speed;

                break;
        }
    }
}