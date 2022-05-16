import { MotionComponent } from "../ecs/components";
import { globalState } from "../main";
import { Component, System } from "./ECS";
import { Vec2 } from "./vec2";

export class PhysicsComponent extends Component {
    constructor(
        private _position: Vec2,
        private _velocity: Vec2,
        private _acceleration: Vec2,
        private _dimensions: Vec2,
        private _friction: number,
        private _mass: number,
        private _hasGravity: boolean,
        private _isStatic: boolean
    ) {
        super();
    }

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

    get dimensions(): Vec2 {
        return this._dimensions;
    }

    get friction(): number {
        return this._friction;
    }

    applyForce(force: Vec2): void {
        force.divide(this.mass);
        this.acceleration.add(force);
    }

    update(): void {
        this._velocity.add(this.acceleration);
        this._position.x += this._velocity.x * globalState.Time.deltaTime;
        this._position.y += this._velocity.y * globalState.Time.deltaTime;
        if (this._acceleration.magnitude == 0) this._velocity.multiply(.95);
        this._acceleration = new Vec2(0, 0);
    }
}

export class PhysicsController extends System {
    componentsRequired: Set<Function> = new Set([PhysicsComponent, MotionComponent]);

    update(entities: Set<number>): void {
        for (let id of entities) {
            let entity = this.ecs.getComponents(id);
            let physics = entity.get(PhysicsComponent);

            if (physics.hasGravity)
                physics.applyForce(new Vec2(0, 9.81));

            physics.update();
        }
    }
}


























// export class CollisionManager extends System {
//     componentsRequired: Set<Function> = new Set([BoxCollider]);

//     update(entities: Set<number>): void {
//         for (let i = 0; i < 3; i++) {
//             for (let id of entities) {
//                 let entity = ecs.getComponents(id);

//                 let pos1 = entity.transform.position;
//                 let box1 = entity.get(BoxCollider);

//                 for (let entityCollidingId of entities) {
//                     let entityColliding = ecs.getComponents(entityCollidingId);

//                     if (entityColliding == entity) continue;

//                     // aabb collision detection
//                     let pos2 = entityColliding.transform.position;
//                     let box2 = entityColliding.get(BoxCollider);

//                     if (pos1.x + box1.width < pos2.x + .1 || pos2.x + box2.width < pos1.x + .1 || pos1.y + box1.height < pos2.y + .1 || pos2.y + box2.height < pos1.y + .1) continue;

//                     box1.collidingWith.push(entityCollidingId);
//                     box2.collidingWith.push(id);
//                 }
//             }

//             for (let id of entities) {
//                 let entity = ecs.getComponents(id);

//                 let box = entity.get(BoxCollider);
//                 if (box.isStatic) continue;

//                 while (box.collidingWith.length > 0) {
//                     // calculate the amount the two objects are intersecting

//                     let entityCollidingId = box.collidingWith.pop()!, entityColliding = ecs.getComponents(entityCollidingId);

//                     let box2 = entityColliding.get(BoxCollider);

//                     let physics = entity.get(PhysicsComponent);
//                     let physHis = entityColliding.get(PhysicsComponent);

//                     let cX = (entity.transform.position.x + box.width / 2) - (entityColliding.transform.position.x + box2.width / 2);
//                     let cY = (entity.transform.position.y + box.height / 2) - (entityColliding.transform.position.y + box2.height / 2);

//                     let dX = (cX > 0);
//                     let dY = (cY > 0);

//                     cX = Math.abs(cX);
//                     cY = Math.abs(cY);

//                     cX = cX - box2.width / 2 - box.width / 2;
//                     cY = cY - box2.height / 2 - box.height / 2;

//                     let myMoveVec;

//                     myMoveVec = new Vec2(cX, cY);

//                     if (dX) myMoveVec.x *= -1;
//                     if (dY) myMoveVec.y *= -1;

//                     if (cX > cY) {
//                         entity.transform.position.x += myMoveVec.x;

//                         if (physics) {
//                             physics.velocity.x = 0;
//                         }
//                     }
//                     else {
//                         entity.transform.position.y += myMoveVec.y;

//                         if (physics) {
//                             physics.velocity.y = 0;

//                             if (!dY) physics.onground = true;
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }