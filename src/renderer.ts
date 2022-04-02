import { Line } from "./gameObject/physics";
import { Vec2 } from "./gameObject/physics"

interface StoredAssets {
    [key: string]: HTMLImageElement;
}

export async function loadImages(imageSources: string[], domain: string): Promise<StoredAssets> {
    let processedImages: StoredAssets = {};

    for (let i = 0, l = imageSources.length; i < l; i++) {
        let currentSauce = imageSources[i] as string;

        let img = await new Promise<HTMLImageElement>(resolve => {
            let t = new Image();

            t.src = `${domain}/${currentSauce}.png`;

            t.onload = () => resolve(t);
            t.onerror = () => { throw new Error("Image not found") };
        });

        processedImages[currentSauce] = img;
    }

    return processedImages;
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

class Renderer {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    width: number;
    height: number;

    private offset: Vec2;
    center: Vec2;

    camera: Camera;

    constructor(width: number, height: number, camera: Camera, canvasID?: string) {
        this.canvas = canvasID ? document.getElementById(canvasID) as HTMLCanvasElement : document.createElement("canvas");
        this.context = this.canvas.getContext("2d")!;

        this.width = width;
        this.height = height;

        this.canvas.width = width;
        this.canvas.height = height;

        this.offset = { x: 0, y: 0 }
        this.center = { x: this.width / 2, y: this.height / 2 }

        this.camera = camera;
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
}

export const renderer = new Renderer(screen.width, screen.height, new Camera({ x: 0, y: 0 }), "gameScreen");