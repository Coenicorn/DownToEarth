import { LevelConfig } from "./types";
import { Line } from "./gameObject/physics";
import { Renderer } from "./renderer";
import SimplexNoise from "./simplex-noise";
declare class Chunk {
    mesh: Line[];
    config: LevelConfig;
    xPosition: number;
    renderer: Renderer;
    constructor(noiseInstance: SimplexNoise, config: LevelConfig, xPosition: number);
    makeLayout(noiseInstance: SimplexNoise): void;
}
export declare class Level {
    config: LevelConfig;
    chunks: Chunk[];
    noiseInstance: SimplexNoise;
    renderer: Renderer;
    constructor(config: LevelConfig, renderer: Renderer);
    generateChunks(): void;
    renderLevel(): void;
    getChunkAt(x: number): Chunk | undefined;
}
export {};
