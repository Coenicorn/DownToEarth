import { Vec2 } from "./vec2";

let canvas = document.createElement("canvas");
let context = canvas.getContext("2d")!;

let width = innerWidth;
let height = innerHeight;

canvas.width = width;
canvas.height = height;

document.body.appendChild(canvas);

export const view = {
    canvas,
    context,
    width,
    height,
    center: {
        x: width / 2,
        y: height / 2
    }
}

export class Camera {
    private _x;
    private _y;
    private _zoom;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
        this._zoom = 1;
    }
    get zoom(): number {
        return this._zoom;
    }

    setZoom(z: number) {
        this._zoom = z;
    }

    setX(x: number): void {
        this._x = x;
    }

    setY(y: number): void {
        this._y = y;
    }

    getScreenX(x: number): number {
        return view.center.x + (x - this._x) * this._zoom;
    }

    getScreenY(y: number): number {
        return view.center.y + (y - this._y) * this._zoom;
    }
}