// dynamically generate background image

import { Vec2 } from "./gameObject/physics";
import SimplexNoise from "./simplex-noise";

let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;

let imageWidth = 1920;
let imageHeight = 1080;

// height in percentages measured from top
let maxMountainHeight = imageHeight / 100 * 0;
let minMountainHeight = imageHeight / 100 * 40;

let minLineLength = 60;
let maxLineLength = 100;

let sampleSize = 1000;
let noiseInstance: SimplexNoise;

function getPointAtX(x: number): Vec2 {
    // generate noise point at given x position
    let y = noiseInstance.noise2D(x / sampleSize, 0) * (maxMountainHeight - minMountainHeight) / 2 + (maxMountainHeight - minMountainHeight) / 2;

    return { x, y };
}

function generateBackgroundImage(): string {
    canvas = document.createElement("canvas");
    context = canvas.getContext("2d")!;
    noiseInstance = new SimplexNoise();

    canvas.width = imageWidth;
    canvas.height = imageHeight;

    context.clearRect(0, 0, imageWidth, imageHeight);

    context.fillStyle = "red";
    context.fillRect(0, 0, 100, 100);
    context.fillStyle = "blue";
    context.fillRect(50, 50, 200, 200);

    // let points: Vec2[] = [];

    // let x = 0;

    // while (true) {
    //     let newPoint = getPointAtX(x);
    //     points.push(newPoint);

    //     if (x > imageWidth) break;

    //     x += Math.round(Math.random() * maxLineLength) + minLineLength;
    // }

    // context.lineWidth = 2;
    // context.strokeStyle = "black";
    // context.moveTo(Math.round(points[0].x), Math.round(minMountainHeight + points[0].y));
    // for (let i = 1, l = points.length; i < l; i++) {
    //     context.lineTo(Math.round(points[i].x), Math.round(minMountainHeight + points[i].y));
    // }
    // context.stroke();






    return canvas.toDataURL();
}


export default generateBackgroundImage;