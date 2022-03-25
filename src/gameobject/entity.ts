import { Camera, Renderer } from "../renderer";
import { Vec2 } from "../types";

// switch from position + dimension to line mesh

export abstract class GameObject {
    position: Vec2;
    velocity: Vec2;
    acceleration: Vec2;

    // for bounding
    dimensions: Vec2;

    constructor(pos: Vec2, dim: Vec2) {
        this.position = pos;
        this.velocity = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0 }
        this.dimensions = dim;
    }

    abstract update(deltaTime: number): void;
    abstract render(camera: Camera): void;
    abstract collide(object: GameObject): void;
}

export class Rock extends GameObject {
    constructor(pos: Vec2, dim: Vec2) {
        super(pos, dim);
    }

    update(deltaTime: number): void {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;

        this.velocity.x *= 0.9;
        this.velocity.y *= 0.9;
    }

    collide(object: GameObject): void {
        // check for collision
        if (this.position.x < object.position.x - object.dimensions.x && this.position.x + this.dimensions.x > object.position.x &&
            this.position.y < object.position.y - object.dimensions.y && this.position.y + this.dimensions.y > object.position.y) {

            console.log("colliding");
        }
    }

    render(camera: Camera): void {
        camera.viewport.color("red");
        camera.viewport.drawRectangle(this.position.x, this.position.y, this.dimensions.x, this.dimensions.y);
    }
}

export class Player extends GameObject {
    maxSpeed: number;
    speed: number;

    alive: boolean;

    constructor(pos: Vec2, dim: Vec2) {
        super(pos, dim);

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

    collide(object: GameObject): void {
        return;
    }

    render(camera: Camera): void {
        camera.viewport.translate(0, 0);

        // bounding box visualization
        camera.viewport.color("black");
        camera.viewport.drawRectangle(camera.viewport.width / 2 - this.dimensions.x / 2, camera.viewport.height / 2 - this.dimensions.y / 2, this.dimensions.x, this.dimensions.y);

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