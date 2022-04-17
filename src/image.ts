import generateBackgroundImage from "./background";
import { StoredAssets } from "./types";

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        let t = new Image();

        t.src = src;

        t.onload = () => resolve(t);
        t.onerror = () => { throw new Error("Image not found") };
    });
}

export const storedAssets = {} as StoredAssets;

export async function loadImages() {
    storedAssets["rock1"] = await loadImage("./assets/rock1.png");
    storedAssets["player"] = await loadImage("./assets/player.png");
    storedAssets["Background1"] = await loadImage("./assets/Background1.png");
}