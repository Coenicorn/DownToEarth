import { Line } from "./gameObject/physics";
import { Vec2 } from "./gameObject/physics";
interface StoredAssets {
    [key: string]: HTMLImageElement;
}
export declare function loadImages(imageSources: string[], domain: string): Promise<StoredAssets>;
export declare class Camera {
    position: Vec2;
    constructor(pos: Vec2);
    moveTo(pos: Vec2): void;
}
export declare class Renderer {
    private canvas;
    private context;
    width: number;
    height: number;
    private offset;
    center: Vec2;
    camera: Camera;
    constructor(width: number, height: number, camera: Camera);
    mount(elm: string): void;
    clear(): void;
    color(color: string): void;
    drawRectangle(x: number, y: number, w: number, h: number): void;
    drawLineMesh(mesh: Line[]): void;
    fillLineMesh(mesh: Line[]): void;
    drawSprite(sprite: HTMLImageElement | HTMLCanvasElement, x: number, y: number, w?: number, h?: number): void;
    drawLine(x1: number, y1: number, x2: number, y2: number, lw: number): void;
    drawShape(points: Vec2[]): void;
    fillShape(points: Vec2[]): void;
    translate(vec: Vec2): void;
    translateToScreenCoordinates(pos: Vec2): void;
    getCanvas(): HTMLCanvasElement;
}
export {};
