interface Vec2 {
    x: number;
    y: number;
}

interface AABB {
    position: Vec2;
    dimensions: Vec2;
}

class Line {
    a: Vec2;
    b: Vec2;
    surfaceNormal: Vec2;

    constructor(a: Vec2, b: Vec2) {
        this.a = a;
        this.b = b;

        // construct surface normal

        let fromAToB = { x: this.b.x - this.a.x, y: this.b.y - this.a.y }

        // normalize
        let magnitude = Math.sqrt(Math.pow(fromAToB.x, 2) + Math.pow(fromAToB.y, 2));

        fromAToB.x /= magnitude;
        fromAToB.y /= magnitude;

        this.surfaceNormal = { x: fromAToB.y, y: -fromAToB.x };
    }

    intersectsLine(line: Line): Vec2 | undefined {
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

        let pos = { x: x1 + t * (x2 - x1), y: y1 + t * (y2 - y1) };

        return pos;
    }

    intersectsAABB(aabb: AABB): boolean {
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
            this.intersectsLine(l1) != undefined ||
            this.intersectsLine(l2) != undefined ||
            this.intersectsLine(l3) != undefined ||
            this.intersectsLine(l4) != undefined
        );
    }
}

class Mesh {
    private mesh: Line[];

    constructor(points: Vec2[]) {
        // construct line mesh
        this.mesh = [];

        for (let i = 1, l = points.length; i < l; i++) {
            this.mesh.push(new Line(
                {
                    x: points[i - 1].x,
                    y: points[i - 1].y
                },
                {
                    x: points[i].x,
                    y: points[i].y
                }
            ));
        }

        this.mesh.push(new Line(
            {
                x: points[points.length - 1].x,
                y: points[points.length - 1].y
            },
            {
                x: points[0].x,
                y: points[0].y
            }
        ));
    }

    static meshFromAABB(aabb: AABB): Mesh {
        let x1, x2, x3, x4, y1, y2, y3, y4;

        x1 = aabb.position.x;
        y1 = aabb.position.y;
        x2 = aabb.position.x + aabb.dimensions.x;
        y2 = aabb.position.y;
        x3 = aabb.position.x + aabb.dimensions.x;
        y3 = aabb.position.y + aabb.dimensions.y;
        x4 = aabb.position.x;
        y4 = aabb.position.y + aabb.dimensions.y;

        return new Mesh([
            { x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }, { x: x4, y: y4 }
        ]);
    }

    getMesh(): Line[] {
        return this.mesh;
    }
}

export {
    Vec2, Line, Mesh
}