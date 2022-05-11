export class Vec2 {
    x: number;
    y: number;

    constructor(
        x: number,
        y: number
    ) {
        this.x = x;
        this.y = y;
    }

    clone(): Vec2 {
        return new Vec2(this.x, this.y);
    }

    get magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    set magnitude(val: number) {
        let len = val / this.magnitude;
        this.multiply(len);
    }

    add(val: number): void;
    add(val: Vec2): void;
    add(val: number | Vec2): void {
        if (typeof (val) == "number") {
            this.x += val;
            this.y += val;
        } else {
            this.x += val.x;
            this.y += val.y;
        }
    }

    subtract(val: number): void;
    subtract(val: Vec2): void;
    subtract(val: number | Vec2): void {
        if (typeof (val) == "number") {
            this.x -= val;
            this.y -= val;
        } else {
            this.x -= val.x;
            this.y -= val.y;
        }
    }

    divide(val: number): void;
    divide(val: Vec2): void;
    divide(val: number | Vec2): void {
        if (typeof (val) == "number") {
            this.x /= val;
            this.y /= val;
        } else {
            this.x /= val.x;
            this.y /= val.y;
        }
    }

    multiply(val: number): void;
    multiply(val: Vec2): void;
    multiply(val: number | Vec2): void {
        if (typeof (val) == "number") {
            this.x *= val;
            this.y *= val;
        } else {
            this.x *= val.x;
            this.y *= val.y;
        }
    }
}