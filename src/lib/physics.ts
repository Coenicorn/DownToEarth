import { QuadTree } from "./quadTree";
import { Vec2 } from "./vec2";

export class AABB {
    private p1: Vec2;
    private p2: Vec2;

    constructor(
        x: number,
        y: number,
        w: number,
        h: number
    ) {
        this.p1 = new Vec2(x, y);
        this.p2 = new Vec2(x + w, y + h);
    }

    updatePos(pos: Vec2): void {
        let w = this.width, h = this.height;

        this.p1 = new Vec2(pos.x, pos.y);
        this.p2 = new Vec2(pos.x + w, pos.y + h);
    }

    get x(): number {
        return this.p1.x;
    }

    get y(): number {
        return this.p1.y;
    }

    get width(): number {
        return this.p2.x - this.p1.x;
    }

    get height(): number {
        return this.p2.y - this.p1.y;
    }
}

// export class Line {
//     p1: Vec2;
//     p2: Vec2;
//     normal: Vec2;

//     constructor(p1: Vec2, p2: Vec2) {
//         this.p1 = p1;
//         this.p2 = p2;

//         let dX = this.p2.x - this.p1.x;
//         let dY = this.p2.y - this.p1.y;

//         this.normal = new Vec2(dY, -dX);
//         this.normal.magnitude = 1;
//     }

//     getDistanceFromPoint(pt: Vec2): number {
//         // define the x and y of point, the denominator and the numerator
//         let x, y, d, n;

//         x = pt.x;
//         y = pt.y;

//         // denominator is the length of this line
//         d = Math.sqrt(Math.pow(this.p2.x - this.p1.x, 2) + Math.pow(this.p2.y - this.p1.y, 2));


//         // numerator is the (absolute) area of the triangle defined by pt, this.p1 and this.p2
//         n = Math.abs((this.p2.x - this.p1.x) * (this.p1.y - y) - (this.p1.x - x) * (this.p2.y - this.p1.y));

//         return n / d;
//     }

//     isIntersecting(line: Line): boolean {
//         let x1, x2, x3, x4, y1, y2, y3, y4, t, u, d;

//         x1 = this.p1.x;
//         x2 = this.p2.x;
//         x3 = line.p1.x;
//         x4 = line.p2.x;

//         y1 = this.p1.y;
//         y2 = this.p2.y;
//         y3 = line.p1.y;
//         y4 = line.p2.y;

//         d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

//         t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d;
//         u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / d;

//         return (t > 0 && t < 1 && u > 0 && u < 1);
//     }
// }

export class PhysicsObject {
    constructor(
        private _position: Vec2,
        private _velocity: Vec2,
        private _acceleration: Vec2,
        private _aabb: AABB,
        private _mass: number,
        private _hasGravity: boolean,
        private _isStatic: boolean
    ) { }

    get position(): Vec2 {
        return this._position;
    }

    get velocity(): Vec2 {
        return this._velocity;
    }

    get acceleration(): Vec2 {
        return this._acceleration;
    }

    get hasGravity(): boolean {
        return this._hasGravity;
    }

    get isStatic(): boolean {
        return this._isStatic;
    }

    get mass(): number {
        return this._mass;
    }

    get aabb(): AABB {
        return this._aabb;
    }

    applyForce(force: Vec2): void {
        force.divide(this.mass);
        this.acceleration.add(force);
    }

    update(): void {
        this._velocity.add(this.acceleration);
        this._position.add(this.velocity);
        this._acceleration = new Vec2(0, 0);
    }
}