export const canvas = document.createElement("canvas");
export const context = canvas.getContext("2d")!;

const width = innerWidth;
const height = innerHeight;

canvas.width = width;
canvas.height = height;

document.body.appendChild(canvas);