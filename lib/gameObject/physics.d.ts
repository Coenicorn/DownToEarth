export interface Vec2 {
    x: number;
    y: number;
}
export interface AABB {
    position: Vec2;
    dimensions: Vec2;
}
export declare class Line {
    a: Vec2;
    b: Vec2;
    surfaceNormal: Vec2;
    constructor(a: Vec2, b: Vec2);
    private getSurfaceNormal;
    intersects(line: Line): Vec2 | undefined;
}
export declare function intersectsAABB(a1: AABB, a2: AABB): boolean;
export declare function intersectsAABBLine(line: Line, aabb: AABB): boolean;
export declare function lineMeshFromPoints(points: Vec2[]): Line[];
