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

export class Line {
    p1: Vec2;
    p2: Vec2;
    normal: Vec2;

    constructor(p1: Vec2, p2: Vec2) {
        this.p1 = p1;
        this.p2 = p2;

        let dX = this.p2.x - this.p1.x;
        let dY = this.p2.y - this.p1.y;

        this.normal = new Vec2(dY, -dX);
        this.normal.magnitude = 1;
    }

    getDistanceFromPoint(pt: Vec2): number {
        // define the x and y of point, the denominator and the numerator
        let x, y, d, n;

        x = pt.x;
        y = pt.y;

        // denominator is the length of this line
        d = Math.sqrt(Math.pow(this.p2.x - this.p1.x, 2) + Math.pow(this.p2.y - this.p1.y, 2));


        // numerator is the (absolute) area of the triangle defined by pt, this.p1 and this.p2
        n = Math.abs((this.p2.x - this.p1.x) * (this.p1.y - y) - (this.p1.x - x) * (this.p2.y - this.p1.y));

        return n / d;
    }

    isIntersecting(line: Line): boolean {
        let x1, x2, x3, x4, y1, y2, y3, y4, t, u, d;

        x1 = this.p1.x;
        x2 = this.p2.x;
        x3 = line.p1.x;
        x4 = line.p2.x;

        y1 = this.p1.y;
        y2 = this.p2.y;
        y3 = line.p1.y;
        y4 = line.p2.y;

        d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

        t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d;
        u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / d;

        return (t > 0 && t < 1 && u > 0 && u < 1);
    }
}

export class Mesh {
    constructor(
        private _mesh: Array<Line>
    ) { }

    getLines(): Line[] {
        return this._mesh;
    }

    getLinesOffset(pos: Vec2): Line[] {
        let lines = [];
        for (let line of this._mesh) { lines.push(new Line(line.p1.clone(), line.p2.clone())) }
        for (let line of lines) {
            line.p1.x += pos.x;
            line.p1.y += pos.y;
            line.p2.x += pos.x;
            line.p2.y += pos.y;
        }
        return lines;
    }

    static getLineMeshFromAABB(w: number, h: number): Mesh {
        let x = 0, y = 0;
        return new Mesh([
            new Line(
                new Vec2(x, y),
                new Vec2(x + w, y)
            ),
            new Line(
                new Vec2(x + w, y),
                new Vec2(x + w, y + h)
            ),
            new Line(
                new Vec2(x + w, y + h),
                new Vec2(x, y + h)
            ),
            new Line(
                new Vec2(x, y + h),
                new Vec2(x, y)
            )
        ]);
    }
}


const storedAssets = {} as StoredAssets;

export const globalState = {
    Time: {
        deltaTime: 0
    },
    camera: {
        position: new Vec2(0, 0)
    },
    level: {
        totalLevelHeight: 100000,
        totalLevelWidth: canvas.width * 2,
        currentLevel: 1
    }
}

let border1: Entity;
let border2: Entity;
let player: Entity;
let level: Entity;

let last = 0, targetFps = 60, fps = 1000 / targetFps, timeElapsed = 0, framerateUpdate = 0;
let running = false;

function renderGUI(): void {



    // render height meter
    context.drawImage(storedAssets["depth_meter"], 20, 20);

    context.fillStyle = "black";
    let yPos = storedAssets["depth_meter"].height / globalState.level.totalLevelHeight * ecs.getComponents(player).transform.position.y;
    yPos = yPos < storedAssets["depth_meter"].height ? yPos : storedAssets["depth_meter"].height;
    context.fillRect(10, 20 + yPos, 50, 5);



}

function renderStaticContent(): void {
    context.drawImage(storedAssets["landscape"], 0, 0, canvas.width, canvas.height);
}

function startGameLoop() {
    let now = Date.now();
    timeElapsed += (now - last);
    globalState.Time.deltaTime = (now - last) / fps;

    // framerateUpdate += (now - last);
    // if (framerateUpdate > 500) {
    //     document.getElementById("framerate")!.innerHTML = (fps / (now - last) * targetFps).toString();
    //     framerateUpdate = 0;
    // }

    last = now;

    // clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    renderStaticContent();

    ecs.update();

    renderGUI();

    if (Input.hasKey("q")) running = false;

    if (running) requestAnimationFrame(startGameLoop);
}

async function init() {

    // asset initialization
    storedAssets["player"] = await loadImage("./img/player.png");
    storedAssets["depth_meter"] = await loadImage("./img/depth_meter.png");
    storedAssets["landscape"] = await loadImage("./img/landscape.png");
    storedAssets["level1"] = await loadImage("./img/level1.png");

    level = ecs.newEntity();
    ecs.addComponent(level, new BoxRendererComponent(globalState.level.totalLevelWidth, 100, "red", new Vec2(0, 0)))
    ecs.addComponent(level, new BoxCollider(globalState.level.totalLevelWidth, 100, true))
    ecs.addComponent(level, new SpriteComponent(storedAssets["level1"], new Vec2(1, 1), new Vec2(0, 0)));

    console.log(ecs.getComponents(level).get(SpriteComponent));

    ecs.getComponents(level).transform.position = new Vec2(0, canvas.height - 100);

    border1 = ecs.newEntity();
    ecs.addComponent(border1, new BoxCollider(1, globalState.level.totalLevelHeight, true));
    border2 = ecs.newEntity();
    ecs.addComponent(border2, new BoxCollider(1, globalState.level.totalLevelHeight, true));
    ecs.getComponents(border2).transform.position.x = globalState.level.totalLevelWidth;

    player = ecs.newEntity();
    ecs.addComponent(player, new SpriteComponent(storedAssets["player"], new Vec2(.2, .2), new Vec2(.25, .25)));
    ecs.addComponent(player, new ControllerComponent(1, 8, 6));
    ecs.addComponent(player, new BoxCollider(100, 100, false));
    ecs.addComponent(player, new PhysicsComponent(10, true));
    ecs.addComponent(player, new PlayerComponent());
    ecs.addComponent(player, new CameraFollow());

    // // entity component system initialization
    ecs.addSystem(new CharacterController());
    ecs.addSystem(new PhysicsController());
    ecs.addSystem(new CollisionManager());
    ecs.addSystem(new TrackCamera());
    ecs.addSystem(new BoxRenderer());
    ecs.addSystem(new SpriteRenderer());
    ecs.addSystem(new WireFrameRenderer());

    // starting the main game loop
    last = Date.now();
    running = true;
    startGameLoop();

}

onload = init;

class InputLocal {
    private keys: Array<string> = [];
    private mouseXPos = 0;
    private mouseYPos = 0;

    constructor() {
        addEventListener("keydown", this.keyPress.bind(this));
        addEventListener("keyup", this.keyRelease.bind(this));
        addEventListener("mousemove", this.mouseMove.bind(this));
    }

    mouseMove(e: MouseEvent): void {
        let x = e.clientX;
        let y = e.clientY;

        this.mouseXPos = x;
        this.mouseYPos = y;
    }

    get mouseX(): number {
        return this.mouseXPos;
    }

    get mouseY(): number {
        return this.mouseYPos;
    }

    keyPress(event: KeyboardEvent): void {
        let key = event.key;

        if (!this.keys.includes(key)) this.keys.push(key);
    }

    keyRelease(event: KeyboardEvent): void {
        let key = event.key;

        if (this.keys.includes(key)) this.keys.splice(this.keys.indexOf(key), 1);
    }

    hasKey(key: string): boolean {
        return this.keys.includes(key);
    }
}

export const Input = new InputLocal();

export interface StoredAssets {
    [index: string]: HTMLImageElement;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
        let t = new Image();

        t.src = src;

        t.onload = () => resolve(t);
        t.onerror = () => { throw new Error("Image not found") };
    });
}

export const storedAssets = {} as StoredAssets;

export const canvas = document.createElement("canvas");
export const context = canvas.getContext("2d")!;

const width = innerWidth;
const height = innerHeight;

canvas.width = width;
canvas.height = height;

document.body.appendChild(canvas);


export class BoxRenderer extends System {
    componentsRequired: Set<Function> = new Set([BoxRendererComponent]);

    update(entities: Set<number>): void {
        for (let id of entities) {
            let entity = ecs.getComponents(id);

            let box = entity.get(BoxRendererComponent);

            context.fillStyle = box.color;
            context.fillRect(entity.transform.position.x - globalState.camera.position.x, entity.transform.position.y - globalState.camera.position.y, box.width, box.height);
        }
    }
}

export class WireFrameRenderer extends System {
    componentsRequired: Set<Function> = new Set([MeshCollider]);

    update(entities: Set<number>): void {
        for (let id of entities) {
            let entity = ecs.getComponents(id);
            let mesh = entity.get(MeshCollider).mesh.getLines();

            context.strokeStyle = "black";
            context.lineWidth = 1;
            context.beginPath();
            for (let i = 0; i < mesh.length; i++) {
                let line = mesh[i];

                context.moveTo(line.p1.x + entity.transform.position.x - globalState.camera.position.x, line.p1.y + entity.transform.position.y - globalState.camera.position.y);
                context.lineTo(line.p2.x + entity.transform.position.x - globalState.camera.position.x, line.p2.y + entity.transform.position.y - globalState.camera.position.y);
            }
            context.closePath();
            context.stroke();
        }
    }
}

export class SpriteRenderer extends System {
    componentsRequired: Set<Function> = new Set([SpriteComponent])

    update(entities: Set<number>): void {
        for (let id of entities.values()) {
            let entity = ecs.getComponents(id);
            let spritecomp = entity.get(SpriteComponent);

            let width = spritecomp.image.width * spritecomp.scale.x;
            let height = spritecomp.image.height * spritecomp.scale.y;

            context.drawImage(spritecomp.image, entity.transform.position.x - spritecomp.anchor.x * width - globalState.camera.position.x, entity.transform.position.y - spritecomp.anchor.y * height - globalState.camera.position.y, width, height);
        }
    }
}

export class CharacterController extends System {
    componentsRequired: Set<Function> = new Set([ControllerComponent, PhysicsComponent]);

    update(entities: Set<number>): void {
        for (let id of entities) {
            let entity = ecs.getComponents(id);

            let pos = entity.transform.position;
            let controller = entity.get(ControllerComponent);
            let physics = entity.get(PhysicsComponent);

            if (Input.hasKey("a")) physics.acceleration.x += -controller.speed * globalState.Time.deltaTime;
            if (Input.hasKey("d")) physics.acceleration.x += controller.speed * globalState.Time.deltaTime;
            if (Input.hasKey(" ") && physics.onground) physics.acceleration.y -= controller.jumpHeight;

            physics.velocity.add(physics.acceleration);

            if (physics.velocity.x > controller.maxSpeed) physics.velocity.x = controller.maxSpeed;
            if (physics.velocity.x < -controller.maxSpeed) physics.velocity.x = -controller.maxSpeed;

            entity.transform.position.add(physics.velocity);
            physics.acceleration = new Vec2(0, 0);

            physics.onground = false;
        }
    }
}

export class PhysicsController extends System {
    componentsRequired: Set<Function> = new Set([PhysicsComponent]);

    update(entities: Set<number>): void {
        for (let id of entities) {
            let entity = ecs.getComponents(id);

            let physics = entity.get(PhysicsComponent);
            let pos = entity.transform.position;

            if (physics.gravity) physics.acceleration.y += 3;

            physics.acceleration.divide(physics.mass);
            physics.velocity.add(physics.acceleration);

            physics.acceleration = new Vec2(0, 0);

            pos.x += physics.velocity.x * globalState.Time.deltaTime;
            pos.y += physics.velocity.y * globalState.Time.deltaTime;

            physics.velocity.x *= 0.9;
        }
    }
}

export class CollisionManager extends System {
    componentsRequired: Set<Function> = new Set([BoxCollider]);

    update(entities: Set<number>): void {
        for (let i = 0; i < 3; i++) {
            for (let id of entities) {
                let entity = ecs.getComponents(id);

                let pos1 = entity.transform.position;
                let box1 = entity.get(BoxCollider);

                for (let entityCollidingId of entities) {
                    let entityColliding = ecs.getComponents(entityCollidingId);

                    if (entityColliding == entity) continue;

                    // aabb collision detection
                    let pos2 = entityColliding.transform.position;
                    let box2 = entityColliding.get(BoxCollider);

                    if (pos1.x + box1.width < pos2.x + .1 || pos2.x + box2.width < pos1.x + .1 || pos1.y + box1.height < pos2.y + .1 || pos2.y + box2.height < pos1.y + .1) continue;

                    box1.collidingWith.push(entityCollidingId);
                    box2.collidingWith.push(id);
                }
            }

            for (let id of entities) {
                let entity = ecs.getComponents(id);

                let box = entity.get(BoxCollider);
                if (box.isStatic) continue;

                while (box.collidingWith.length > 0) {
                    // calculate the amount the two objects are intersecting

                    let entityCollidingId = box.collidingWith.pop()!, entityColliding = ecs.getComponents(entityCollidingId);

                    let box2 = entityColliding.get(BoxCollider);

                    let physics = entity.get(PhysicsComponent);
                    let physHis = entityColliding.get(PhysicsComponent);

                    let cX = (entity.transform.position.x + box.width / 2) - (entityColliding.transform.position.x + box2.width / 2);
                    let cY = (entity.transform.position.y + box.height / 2) - (entityColliding.transform.position.y + box2.height / 2);

                    let dX = (cX > 0);
                    let dY = (cY > 0);

                    cX = Math.abs(cX);
                    cY = Math.abs(cY);

                    cX = cX - box2.width / 2 - box.width / 2;
                    cY = cY - box2.height / 2 - box.height / 2;

                    let myMoveVec;

                    myMoveVec = new Vec2(cX, cY);

                    if (dX) myMoveVec.x *= -1;
                    if (dY) myMoveVec.y *= -1;

                    if (cX > cY) {
                        entity.transform.position.x += myMoveVec.x;

                        if (physics) {
                            physics.velocity.x = 0;
                        }
                    }
                    else {
                        entity.transform.position.y += myMoveVec.y;

                        if (physics) {
                            physics.velocity.y = 0;

                            if (!dY) physics.onground = true;
                        }
                    }
                }
            }
        }
    }
}

export class TrackCamera extends System {
    componentsRequired: Set<Function> = new Set([CameraFollow]);

    update(entities: Set<number>): void {
        for (let id of entities) {
            let entity = ecs.getComponents(id);

            globalState.camera.position = entity.transform.position.clone();

            globalState.camera.position.x -= canvas.width / 2;
            globalState.camera.position.y -= canvas.height / 2;
        }
    }
}


export type Entity = number;

export abstract class Component { }

class Transform extends Component {
    constructor(
        public position: Vec2,
    ) { super(); }
}

export abstract class System {
    ecs!: ecsLocal;

    abstract componentsRequired: Set<Function>;
    abstract update(entities: Set<Entity>): void;
}

type ComponentClass<T extends Component> = new (...args: any[]) => T;

class ComponentContainer {
    public components = new Map<Function, Component>();

    public transform = new Transform(new Vec2(0, 0));

    add(component: Component): void {
        this.components.set(component.constructor, component);
    }

    get<T extends Component>(component: ComponentClass<T>): T {
        return this.components.get(component) as T;
    }

    remove<T extends Component>(component: ComponentClass<T>): void {
        this.components.delete(component.constructor);
    }

    has<T extends Component>(component: ComponentClass<T>): boolean {
        return this.components.has(component);
    }

    hasAll(componentClasses: Iterable<Function>): boolean {
        for (let cls of componentClasses) {
            if (!this.components.has(cls)) return false;
        }

        return true;
    }
}

class ecsLocal {
    private entities = new Map<Entity, ComponentContainer>();
    private entitiesToRemove: Array<Entity> = [];

    private systems = new Map<System, Set<Entity>>();

    private nextEntityId = 0;

    newEntity(): Entity {
        let e = this.nextEntityId;
        this.nextEntityId++;
        this.entities.set(e, new ComponentContainer());
        return e;
    }

    removeEntity(entity: Entity): void {
        this.entitiesToRemove.push(entity);
    }

    addComponent(entity: Entity, component: Component): void {
        this.entities.get(entity)?.add(component);
        this.checkEntity(entity);
    }

    getComponents(entity: Entity): ComponentContainer {
        return this.entities.get(entity) as ComponentContainer;
    }

    addSystem(system: System): void {
        system.ecs = this;

        this.systems.set(system, new Set());

        for (let entity of this.entities.keys()) {
            this.checkES(entity, system);
        }
    }

    checkEntity(entity: Entity): void {
        for (let system of this.systems.keys()) {
            this.checkES(entity, system);
        }
    }

    checkES(entity: Entity, system: System): void {
        let need = system.componentsRequired;
        let have = this.entities.get(entity);
        if (have?.hasAll(need)) {
            this.systems.get(system)?.add(entity);
        } else {
            this.systems.get(system)?.delete(entity);
        }
    }

    destroyEntity(entity: Entity): void {
        this.entities.delete(entity);
        for (let entities of this.systems.values()) {
            entities.delete(entity);
        }
    }

    update(): void {
        for (let [system, entities] of this.systems.entries()) {
            system.update(entities);
        }

        // remove entities
        for (let i = 0; i < this.entitiesToRemove.length; i++) {
            let e = this.entitiesToRemove.pop()

            if (!e) return;

            this.destroyEntity(e);
        }
    }
}

export const ecs = new ecsLocal();


export class CameraFollow extends Component { }

export class Renderable extends Component {
    public readonly anchor: Vec2;

    constructor(
        anchor: Vec2
    ) {
        super();

        this.anchor = anchor;
    }
}

export class SpriteComponent extends Renderable {
    constructor(
        public image: HTMLImageElement,
        public scale: Vec2,
        anchor: Vec2
    ) {
        super(anchor);
    }
}

export class PhysicsComponent extends Component {
    public onground = false;
    public velocity = new Vec2(0, 0)
    public acceleration = new Vec2(0, 0);
    public nextPos: null | Vec2 = null;

    constructor(
        public mass: number,
        public gravity: boolean,
    ) { super(); }
}

export class ControllerComponent extends Component {
    constructor(
        public speed: number,
        public maxSpeed: number,
        public jumpHeight: number
    ) { super(); }
}

export class BoxCollider extends Component {
    public collidingWith: Array<Entity> = [];
    public nextPos: null | Vec2 = null;

    constructor(
        public width: number,
        public height: number,
        public isStatic: boolean,
    ) { super(); }
}

export class MeshCollider extends Component {
    constructor(
        public mesh: Mesh
    ) { super(); }
}

export class BoxRendererComponent extends Renderable {
    constructor(
        public width: number,
        public height: number,
        public color: string,
        anchor: Vec2
    ) { super(anchor); }
}

export class PlayerComponent extends Component {
    constructor() { super(); }
}