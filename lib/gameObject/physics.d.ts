interface Vec2 {
    x: number;
    y: number;
}
export declare class Line {
    a: Vec2;
    b: Vec2;
    surfaceNormal: Vec2;
    constructor(a: Vec2, b: Vec2);
    private getSurfaceNormal;
    intersects(line: Line): boolean;
}
export declare function lineMeshFromPoints(points: Vec2[]): Line[];
export {};
