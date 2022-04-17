// dynamically generate background image

import { Vec2 } from "./gameObject/physics";
import SimplexNoise from "./simplex-noise";

let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;

let imageWidth = 1920;
let imageHeight = 1080;

// height in percentages measured from top
let maxMountainHeight = 300;

let minLineLength = 60;
let maxLineLength = 100;

let sampleSize = 1000;
let noiseInstance: SimplexNoise;

function getPointAtXNoise(x: number): Vec2 {
    // generate noise point at given x position
    let y = noiseInstance.noise2D(x / sampleSize, 0) * maxMountainHeight + maxMountainHeight / 2;

    return { x, y };
}

function generateBackgroundImage(): string {
    canvas = document.createElement("canvas");
    context = canvas.getContext("2d")!;
    noiseInstance = new SimplexNoise();

    canvas.width = imageWidth;
    canvas.height = imageHeight;

    context.clearRect(0, 0, imageWidth, imageHeight);

    return canvas.toDataURL();
}


export default generateBackgroundImage;