import { Vec2 } from "./types";

export class Renderer {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    width: number;
    height: number;

    constructor() {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d")!;

        this.width = this.canvas.width = screen.width;
        this.height = this.canvas.height = screen.height;
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
        this.context.fillRect(x, y, w, h);
    }

    drawText(x: number, y: number, font: string, text: string) {
        this.context.font = font;
        this.context.fillText(text, x, y);
    }

    drawSprite(sprite: HTMLImageElement, x: number, y: number, w: number = sprite.width, h: number = sprite.height) {
        this.context.drawImage(sprite, x, y, w, h);
    }

    drawLine(x1: number, y1: number, x2: number, y2: number, lw: number) {
        this.context.lineWidth = lw;
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.stroke();
        this.context.closePath();
    }

    fillShape(points: Vec2[]) {
        let start = points[0];
        this.context.beginPath();
        this.context.lineWidth = 0;
        this.context.moveTo(start.x, start.y);
        for (let i = 1, l = points.length; i < l; i++) {
            let c = points[i];
            this.context.lineTo(c.x, c.y);
        }
        this.context.closePath();
        this.context.fill();
    }

    getContent(): string {
        return this.canvas.toDataURL();
    }
}