import { PhysicsObject, AABB } from "./physics";

export class QuadTree {
    _max_objects: number = 5;
    _max_level: number = 10;

    _level: number;
    _objects: PhysicsObject[];
    _bounds: AABB;
    _nodes: QuadTree[];

    constructor(
        b: AABB,
        l: number
    ) {
        this._bounds = b;
        this._level = l;
        this._nodes = [];
        this._objects = [];
    }

    clear(): void {
        this._objects.splice(0, this._objects.length);

        for (let i = 0, len = this._nodes.length; i < len; i++) {
            this._nodes[i].clear();
        }
        this._nodes.splice(0, this._nodes.length);
    }

    split(): void {
        let subWidth = Math.round(this._bounds.x / 2);
        let subHeight = Math.round(this._bounds.y / 2);

        let x = this._bounds.x;
        let y = this._bounds.y;

        this._nodes.push(new QuadTree(new AABB(x, y, subWidth, subHeight), this._level + 1));
        this._nodes.push(new QuadTree(new AABB(x + subWidth, y, subWidth, subHeight), this._level + 1));
        this._nodes.push(new QuadTree(new AABB(x + subWidth, y + subHeight, subWidth, subHeight), this._level + 1));
        this._nodes.push(new QuadTree(new AABB(x, y + subHeight, subWidth, subHeight), this._level + 1));
    }

    getIndex(obj: PhysicsObject): number {
        let index = -1;

        let centerX = this._bounds.width / 2;
        let centerY = this._bounds.height / 2;

        let bounds = obj.aabb;

        let canFitLeft = (bounds.x < centerX && bounds.x + bounds.width < centerX);
        let canFitRight = (bounds.x > centerX && bounds.x + bounds.width > centerX);

        if (bounds.y < centerY && bounds.y + bounds.height < centerY) {
            if (canFitLeft) {
                index = 0;
            } else {
                index = 1;
            }
        } else {
            if (canFitRight) {
                index = 2;
            } else {
                index = 3;
            }
        }

        return index;
    }

    insert(obj: PhysicsObject): void {
        if (this._nodes[0]) {
            let index = this.getIndex(obj);

            if (index != -1) {
                this._nodes[index].insert(obj);
            }
        }

        this._objects.push(obj);

        if (this._objects.length > this._max_objects && this._level < this._max_level) {
            if (!this._nodes[0]) {
                this.split();
            }

            let i = 0;
            while (i < this._objects.length) {
                let index = this.getIndex(this._objects[i]);

                if (index != -1) {
                    let objToPush = this._objects.splice(i, 1)[0];
                    this._nodes[i].insert(objToPush);
                } else {
                    i++;
                }
            }
        }
    }

    retrieve(toPush: Array<PhysicsObject>, obj: PhysicsObject): PhysicsObject[] {
        let index = this.getIndex(obj);

        if (index != -1 && this._nodes[0]) {
            this._nodes[index].retrieve(toPush, obj);
        }

        toPush.concat(this._objects);

        return toPush;
    }
}