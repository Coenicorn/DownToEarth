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

export declare class Line {
    a: Vec2;
    b: Vec2;
    surfaceNormal: Vec2;

    intersectsLine(line: Line): Vec2 | undefined;
    intersectsAABB(aabb: AABB): boolean;
}

export declare class Mesh {
    private mesh: Line[];
}

export interface AABB {
    position: Vec2;
    dimensions: Vec2;
}