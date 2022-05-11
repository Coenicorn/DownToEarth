export interface StoredAssets {
    [index: string]: HTMLImageElement;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
        let t = new Image();

        t.src = src;

        t.onload = () => resolve(t);
        t.onerror = () => { throw new Error("Image not found") };
    });
}

export const storedAssets = {} as StoredAssets;