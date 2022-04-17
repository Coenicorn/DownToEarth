import { Vec2 } from "./physics";
import { Renderer } from "../renderer";
import { level } from "../level";

export abstract class GameObject {
    position: Vec2;
    velocity: Vec2;
    dimensions: Vec2;
    sprite: HTMLImageElement;
    alive: boolean;

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
        this.alive = true;

        this.init();
    }

    update(deltaTime: number): void {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;

        this.onground = false;

        // level collision
        let lines = level.getCollidingLines(this);

        for (let i = 0, l = lines.length; i < l; i++) {
            // intersect with slightly smallr bounding box for better visuals with level
            while (lines[i].intersectsAABB(this)) {
                this.position.y -= .1;
            }

            this.onground = true;
        }

        this.tick();
    }

    render(): void {
        Renderer.translate(Renderer.getScreenPosition(this.position));

        // Renderer.color("red");
        // Renderer.drawRectangle(0, 0, this.dimensions.x, this.dimensions.y);
        Renderer.drawSprite(this.sprite, 0, 0, this.dimensions.x, this.dimensions.y);
    }

    abstract init(): void;
    abstract tick(): void;
} 