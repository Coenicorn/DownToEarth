interface Vec2 {
    x: number;
    y: number
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

    intersects(line: Line): boolean {
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

        if (d == 0) return false;

        let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d;
        let u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / d;

        return (t > 0 && t < 1 && u > 0 && u < 1);
    }
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