import { GameObject } from "./gameobject/entity";

export interface Vec2 {
    x: number;
    y: number;
}

export interface StoredAssets {
    [key: string]: HTMLImageElement;
}

export interface KeyBinding {
    [key: string]: Function;
}

export interface LevelConfig {
    segmentLength: number;
    maxLevelHeight: number;
    noiseSampleSize: number;
    renderDistance: number;
    maxChunkSegments: number;
    levelDownExtension: number
}

export interface Camera {
    position: Vec2;
    speed: number;
    follow(entity: GameObject, deltaTime: number): void;
}