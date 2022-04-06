import { Line, Vec2, Mesh } from "./gameObject/physics";

interface StoredAssets {
    [key: string]: HTMLImageElement;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        let t = new Image();

        t.src = src;

        t.onload = () => resolve(t);
        t.onerror = () => { throw new Error("Image not found") };
    });
}

class Camera {
    position: Vec2;

    constructor(pos: Vec2) {
        this.position = pos;
    }

    /**
     * Move to the position given in world coordinates, not in screen coordinates
     */

    moveTo(pos: Vec2): void {
        this.position.x = -pos.x;
        this.position.y = -pos.y;
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

        this.offset = Vec2.zeroVector;
        this.center = new Vec2(this.width / 2, this.height / 2);

        this.camera = camera;
    }

    resize() {
        this.width = innerWidth;
        this.height = innerHeight;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    color(color: string): void {
        this.context.fillStyle = color;
    }

    drawRectangle(x: number, y: number, w: number, h: number) {
        x = Math.round(x + this.offset.x), y = Math.round(y + this.offset.y);

        this.context.fillRect(x, y, w, h);
    }

    drawLineMesh(mesh: Line[]) {
        this.context.lineWidth = 1;
        this.context.beginPath();
        let start = mesh[0];
        this.context.moveTo(Math.round(start.a.x + this.offset.x), Math.round(start.a.y + this.offset.y));
        this.context.lineTo(Math.round(start.b.x + this.offset.x), Math.round(start.b.y + this.offset.y));
        for (let i = 1, l = mesh.length; i < l; i++) {
            let c = mesh[i];
            this.context.lineTo(Math.round(c.b.x + this.offset.x), Math.round(c.b.y + this.offset.y));
        }
        this.context.closePath();
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

    translateRelative(vec: Vec2) {
        this.offset.x = vec.x + this.camera.position.x + this.center.x;
        this.offset.y = vec.y + this.camera.position.y + this.center.y;
    }

    translateToScreenCoordinates(pos: Vec2) {
        this.offset.x = pos.x;
        this.offset.y = pos.y;
    }

    getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    screenToWorldCoordinates(pos: Vec2): Vec2 {
        pos.add(this.camera.position);
        pos.sub(this.center);

        return pos;
    }
}

export const Renderer = new CanvasView(new Camera(Vec2.zeroVector), "gameScreen");