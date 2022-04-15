import { Line, Vec2 } from "./gameObject/physics";
import { StoredAssets } from "./types";

class Camera {
    position: Vec2;

    constructor(pos: Vec2) {
        this.position = pos;
    }

    /**
     * Move to the position given in world coordinates, not in screen coordinates
     */

    moveTo(pos: Vec2): void {
        this.position.x = pos.x;
        this.position.y = pos.y;
    }
}

export class CanvasView {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    width: number;
    height: number;

    private offset: Vec2;
    center: Vec2;

    camera: Camera;

    constructor(camera: Camera, canvasID: string) {
        this.canvas = canvasID ? document.getElementById(canvasID) as HTMLCanvasElement : document.createElement("canvas");
        this.context = this.canvas.getContext("2d")!;

        this.width = innerWidth;
        this.height = innerHeight;

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        addEventListener("resize", this.resize.bind(this));

        this.offset = { x: 0, y: 0 }
        this.center = { x: this.width / 2, y: this.height / 2 };

        this.camera = camera;
    }

    resize() {
        this.width = innerWidth;
        this.height = innerHeight;

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.center = { x: this.width / 2, y: this.height / 2 };
    }

    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    color(color: string): void {
        this.context.fillStyle = color;
        this.context.strokeStyle = color;
    }

    drawRectangle(x: number, y: number, w: number, h: number) {
        x = Math.round(x + this.offset.x), y = Math.round(y + this.offset.y);

        this.context.fillRect(x, y, w, h);
    }

    drawLineMesh(mesh: Line[], lineWidth: number) {
        this.context.lineWidth = lineWidth;
        this.context.beginPath();
        let start = mesh[0];
        this.context.moveTo(Math.round(start.a.x + this.offset.x), Math.round(start.a.y + this.offset.y));
        for (let i = 1, l = mesh.length - 1; i < l; i++) {
            let c = mesh[i];
            this.context.lineTo(Math.round(c.b.x + this.offset.x), Math.round(c.b.y + this.offset.y));
        }
        this.context.stroke();
    }

    fillLineMesh(mesh: Line[]) {
        this.context.beginPath();
        let start = mesh[0];
        this.context.moveTo(Math.round(start.a.x + this.offset.x), Math.round(start.a.y + this.offset.y));
        this.context.lineTo(Math.round(start.b.x + this.offset.x), Math.round(start.b.y + this.offset.y));
        for (let i = 1, l = mesh.length; i < l; i++) {
            let c = mesh[i];
            this.context.lineTo(Math.round(c.b.x + this.offset.x), Math.round(c.b.y + this.offset.y));
        }
        this.context.closePath();
        this.context.fill();
    }

    drawSprite(sprite: HTMLImageElement | HTMLCanvasElement, x: number, y: number, w: number = sprite.width, h: number = sprite.height) {
        x = Math.round(x + this.offset.x), y = Math.round(y + this.offset.y);

        this.context.drawImage(sprite, x, y, w, h);
    }

    drawLine(x1: number, y1: number, x2: number, y2: number, lw: number) {
        x1 = Math.round(x1 + this.offset.x), y1 = Math.round(y1 + this.offset.y);
        x2 = Math.round(x2 + this.offset.x), y2 = Math.round(y2 + this.offset.y);

        this.context.lineWidth = lw;
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.stroke();
        this.context.closePath();
    }

    drawShape(points: Vec2[]) {
        let start = points[0];
        this.context.lineWidth = 1;
        this.context.beginPath();
        this.context.moveTo(Math.round(start.x + this.offset.x), Math.round(start.y + this.offset.y));
        for (let i = 1, l = points.length; i < l; i++) {
            let c = points[i];
            this.context.lineTo(Math.round(c.x + this.offset.x), Math.round(c.y + this.offset.y));
        }
        this.context.closePath();
        this.context.stroke();
    }

    fillShape(points: Vec2[]) {
        let start = points[0];
        this.context.beginPath();
        this.context.moveTo(Math.round(start.x + this.offset.x), Math.round(start.y + this.offset.y));
        for (let i = 1, l = points.length; i < l; i++) {
            let c = points[i];
            this.context.lineTo(Math.round(c.x + this.offset.x), Math.round(c.y + this.offset.y));
        }
        this.context.closePath();
        this.context.fill();
    }

    alpha(x: number) {
        this.context.globalAlpha = x;
    }

    translate(vec: Vec2) {
        this.offset.x = vec.x;
        this.offset.y = vec.y;
    }

    /**
     * @param {Vec2} pos A screen coordinate
     * 
     * Gets the position of a screen coordinate relative to the camera
     */

    getGamePosition(pos: Vec2): Vec2 {
        return {
            x: pos.x + this.camera.position.x - this.center.x,
            y: pos.y + this.camera.position.y - this.center.y
        }
    }

    /**
     * @param {Vec2} pos A game world coordinate
     */

    getScreenPosition(pos: Vec2): Vec2 {
        return {
            x: pos.x - this.camera.position.x + this.center.x,
            y: pos.y - this.camera.position.y + this.center.y
        }
    }

    getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }
}

export const Renderer = new CanvasView(new Camera({ x: 0, y: 0 }), "gameScreen");