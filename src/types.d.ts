export interface StoredAssets {
    [index: string]: HTMLImageElement;
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

interface Vec2 {
    x: number;
    y: number;
}

export interface AABB {
    position: Vec2;
    dimensions: Vec2
}