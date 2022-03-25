import { GameObject, Line } from "./gameobject/entity";
import { Vec2 } from "./types";

export class Camera {
    position: Vec2;
    speed: number;
    viewport: Renderer;

    constructor(pos: Vec2, speed: number, view: Renderer) {
        this.position = pos;
        this.speed = speed;
        this.viewport = view;
    }

    follow(entity: GameObject) {
        this.position.x = -entity.position.x;
        this.position.y = -entity.position.y;

        this.position.x += this.viewport.width / 2;
        this.position.y += this.viewport.height / 2;
    }
}

export class Renderer {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    width: number;
    height: number;

    offset: Vec2;

    constructor(width: number, height: number) {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d")!;

        this.width = this.canvas.width = width;
        this.height = this.canvas.height = height;

        this.canvas.style.zIndex = "-10";

        this.offset = { x: 0, y: 0 }
    }

    mount(elm: string) {
        let domElm = document.querySelector(elm);

        if (!domElm) throw new Error("Error mounting Renderer to DOM element, wrong selector");

        domElm.appendChild(this.canvas);
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

    drawLineMesh(mesh: Line[], fill: boolean) {
        this.context.lineWidth = 1;
        this.context.beginPath();
        let start = mesh[0];
        this.context.moveTo(start.p1.x + this.offset.x, start.p1.y + this.offset.y);
        this.context.lineTo(start.p2.x + this.offset.x, start.p2.y + this.offset.y);
        for (let i = 1, l = mesh.length; i < l; i++) {
            let c = mesh[i];
            this.context.lineTo(c.p2.x + this.offset.x, c.p2.y + this.offset.y);
        }
        this.context.closePath();
        if (fill) this.context.fill();
        this.context.stroke();
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

    fillShape(points: Vec2[], color: string) {
        let start = points[0];
        this.context.beginPath();
        this.color(color);
        this.context.moveTo(Math.round(start.x + this.offset.x), Math.round(start.y + this.offset.y));
        for (let i = 1, l = points.length; i < l; i++) {
            let c = points[i];
            this.context.lineTo(Math.round(c.x + this.offset.x), Math.round(c.y + this.offset.y));
        }
        this.context.closePath();
        this.context.fill();
    }

    translate(x: number, y: number): void {
        this.offset.x = Math.round(x);
        this.offset.y = Math.round(y);
    }

    translateVec2(vec: Vec2) {
        this.offset.x = vec.x;
        this.offset.y = vec.y;
    }

    getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }
}