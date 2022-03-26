import { Vec2 } from "./types"

class Line {
    p1: Vec2;
    p2: Vec2;
    surfaceNormal: Vec2;

    constructor(p1: Vec2, p2: Vec2) {
        this.p1 = p1;
        this.p2 = p2;
        this.surfaceNormal = this.getSurfaceNormal();
    }

    private getSurfaceNormal(): Vec2 {
        let fromAToB = { x: this.p2.x - this.p1.x, y: this.p2.y - this.p1.y }

        // normalize
        let magnitude = Math.sqrt(Math.pow(fromAToB.x, 2) + Math.pow(fromAToB.y, 2));

        fromAToB.x /= magnitude;
        fromAToB.y /= magnitude;

        return { x: fromAToB.y, y: -fromAToB.x }
    }

    intersect(line: Line): boolean {
        // desperately needs fixing

        let d = (this.p1.x - this.p2.x) * (line.p1.y - line.p2.y) - (this.p1.y - this.p2.y) * (line.p1.y - line.p2.y);

        if (d < 0.1) return false;

        return false;
    }
}

function createRectangle(x: number, y: number, w: number, h: number): Line[] {
    return [
        new Line({ x: x, y: y }, { x: x + w, y: y }),
        new Line({ x: x + w, y: y }, { x: x + w, y: y + h }),
        new Line({ x: x + w, y: y + h }, { x: x, y: y + h }),
        new Line({ x: x, y: y + h }, { x: x, y: y })
    ];
}

function createLine(x1: number, y1: number, x2: number, y2: number): Line {
    return new Line(
        { x: x1, y: y1 },
        { x: x2, y: y2 }
    )
}

function createLineMeshFromPoints(points: Vec2[]): Line[] {
    let t: Line[] = [];

    for (let i = 1, l = points.length; i < l; i++) {
        let c = points[i], l = points[i - 1];
        t.push(new Line(
            { x: l.x, y: l.y },
            { x: c.x, y: c.y }
        ));
    }

    return t;
}

export {
    Line,
    createRectangle,
    createLineMeshFromPoints,
    createLine
}