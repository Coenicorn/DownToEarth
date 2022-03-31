export interface Vec2 {
    x: number;
    y: number;
}

export interface AABB {
    position: Vec2;
    dimensions: Vec2;
}

export class Line {
    a: Vec2;
    b: Vec2;
    surfaceNormal: Vec2;

    constructor(a: Vec2, b: Vec2) {
        this.a = a;
        this.b = b;
        this.surfaceNormal = this.getSurfaceNormal();
    }

    private getSurfaceNormal(): Vec2 {
        let fromAToB = { x: this.b.x - this.a.x, y: this.b.y - this.a.y }

        // normalize
        let magnitude = Math.sqrt(Math.pow(fromAToB.x, 2) + Math.pow(fromAToB.y, 2));

        fromAToB.x /= magnitude;
        fromAToB.y /= magnitude;

        return { x: fromAToB.y, y: -fromAToB.x }
    }

    intersects(line: Line): Vec2 | undefined {
        let x1, y1, x2, y2, x3, y3, x4, y4;

        x1 = this.a.x;
        y1 = this.a.y;
        x2 = this.b.x;
        y2 = this.b.y;
        x3 = line.a.x;
        y3 = line.a.y;
        x4 = line.b.x;
        y4 = line.b.y;

        let d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

        if (d == 0) return;

        let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d;
        let u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / d;

        if (!(t >= 0 && t <= 1 && u >= 0 && u <= 1)) return;

        let pos: Vec2 = { x: x1 + t * (x2 - x1), y: y1 + t * (y2 - y1) };

        return pos;
    }
}

export function intersectsAABB(a1: AABB, a2: AABB): boolean {
    let a: Vec2, b: Vec2, c: Vec2, d: Vec2;

    a = a1.position;
    b = { x: a1.position.x + a1.dimensions.x, y: a1.position.y + a1.dimensions.y }
    c = a2.position;
    d = { x: a2.position.x + a2.dimensions.x, y: a2.position.y + a2.dimensions.y }

    return !(
        a.x > d.x ||
        b.x < c.x ||
        a.y > d.y ||
        b.y < c.y
    );
}

export function intersectsAABBLine(line: Line, aabb: AABB): boolean {
    let x1, x2, x3, x4, y1, y2, y3, y4, l1, l2, l3, l4;

    x1 = aabb.position.x;
    y1 = aabb.position.y;
    x2 = aabb.position.x + aabb.dimensions.x;
    y2 = aabb.position.y;
    x3 = aabb.position.x + aabb.dimensions.x;
    y3 = aabb.position.y + aabb.dimensions.y;
    x4 = aabb.position.x;
    y4 = aabb.position.y + aabb.dimensions.y;

    l1 = new Line({ x: x1, y: y1 }, { x: x2, y: y2 });
    l2 = new Line({ x: x2, y: y2 }, { x: x3, y: y3 });
    l3 = new Line({ x: x3, y: y3 }, { x: x4, y: y4 });
    l4 = new Line({ x: x4, y: y4 }, { x: x1, y: y1 });

    return (
        line.intersects(l1) != undefined ||
        line.intersects(l2) != undefined ||
        line.intersects(l3) != undefined ||
        line.intersects(l4) != undefined
    );
}

export function lineMeshFromPoints(points: Vec2[]): Line[] {
    let lines: Line[] = [];

    for (let i = 1, l = points.length; i < l; i++) {
        let currentPoint = points[i];
        let lastPoint = points[i - 1];

        lines.push(new Line(
            { x: lastPoint.x, y: lastPoint.y },
            { x: currentPoint.x, y: currentPoint.y }
        ));
    }

    return lines;
}