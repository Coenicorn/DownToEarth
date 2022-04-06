// dynamically generate background image



let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;

let imageWidth = 512;
let imageHeight = 512;

// height in percentages
let maxMountainHeight = 90;
let minMountainHeight = 60;

let minLineLength = 30;
let maxLineLength = 100;

function generateBackgroundImage(): string {
    canvas = document.createElement("canvas");
    context = canvas.getContext("2d")!;

    canvas.width = imageWidth;
    canvas.height = imageHeight;

    context.clearRect(0, 0, imageWidth, imageHeight);

    // context.fillStyle = "red";
    // context.fillRect(0, 0, 100, 100);
    // context.fillStyle = "blue";
    // context.fillRect(50, 50, 200, 200);

    let points = [];

    // add scope for spaghetti code
    {
        let t = 155;

        while (true) {
            let newX = 0;

            break;
        }
    }










    return canvas.toDataURL();
}


export default generateBackgroundImage;