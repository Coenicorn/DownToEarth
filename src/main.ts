import { canvas, context } from "./canvas";
import { BoxCollider, BoxRendererComponent, CameraFollow, ControllerComponent, PlayerComponent, SpriteComponent } from "./ecs/components";
import { ecs, Entity } from "./lib/ECS";
import { SpriteRenderer, BoxRenderer, TrackCamera } from "./ecs/systems";
import { StoredAssets, loadImage } from "./image";
import { Input } from "./input";
import { Vec2 } from "./lib/vec2";
import { PhysicsComponent, PhysicsController } from "./lib/physics.ecs";
import { AABB, PhysicsObject } from "./lib/physics";

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

    framerateUpdate += (now - last);
    if (framerateUpdate > 500) {
        document.getElementById("framerate")!.innerHTML = (fps / (now - last) * targetFps).toString();
        framerateUpdate = 0;
    }

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



    // level = ecs.newEntity();

    // ecs.addComponent(level, new BoxRendererComponent(globalState.level.totalLevelWidth, 100, "red", new Vec2(0, 0)))
    // ecs.addComponent(level, new BoxCollider(globalState.level.totalLevelWidth, 100, true))
    // ecs.addComponent(level, new SpriteComponent(storedAssets["level1"], new Vec2(1, 1), new Vec2(0, .4)));
    // ecs.addComponent(level, new PhysicsComponent(new PhysicsObject(ecs.getComponents(level).transform.position, new Vec2(0, 0), new Vec2(0, 0), new AABB(0, 0, globalState.level.totalLevelWidth, 100), 10, true, false)));

    // ecs.getComponents(level).transform.position = new Vec2(0, canvas.height - 100);



    // border1 = ecs.newEntity();

    // ecs.addComponent(border1, new BoxCollider(1, globalState.level.totalLevelHeight, true));


    // border2 = ecs.newEntity();

    // ecs.addComponent(border2, new BoxCollider(1, globalState.level.totalLevelHeight, true));

    // ecs.getComponents(border2).transform.position.x = globalState.level.totalLevelWidth;




    player = ecs.newEntity();

    ecs.addComponent(player, new SpriteComponent(storedAssets["player"], new Vec2(.2, .2), new Vec2(.25, .25)));
    ecs.addComponent(player, new ControllerComponent(1, 8, 6));
    ecs.addComponent(player, new BoxCollider(100, 100, false));
    ecs.addComponent(player, new PlayerComponent());
    ecs.addComponent(player, new CameraFollow());
    ecs.addComponent(player, new PhysicsComponent(new PhysicsObject(ecs.getComponents(player).transform.position, new Vec2(0, 0), new Vec2(0, 0), new AABB(0, 0, 100, 100), 10, false, false)));


    for (let i = 0; i < 100; i++) {
        let t = ecs.newEntity();

        // ecs.getComponents(t).transform.position = new Vec2(Math.random() * canvas.width, Math.random() * canvas.height);

        ecs.addComponent(t, new BoxRendererComponent(10, 10, "red", new Vec2(0, 0)));
        ecs.addComponent(t, new PhysicsComponent(new PhysicsObject(ecs.getComponents(t).transform.position, new Vec2(0, 0), new Vec2(0, 0), new AABB(0, 0, 10, 10), 10, true, false)));
    }



    // // entity component system initialization
    // ecs.addSystem(new CharacterController());
    ecs.addSystem(new PhysicsController(new AABB(0, 0, globalState.level.totalLevelWidth + 1, globalState.level.totalLevelHeight + 1)));
    ecs.addSystem(new TrackCamera());
    ecs.addSystem(new BoxRenderer());
    ecs.addSystem(new SpriteRenderer());



    // starting the main game loop
    last = Date.now();
    running = true;
    startGameLoop();

}

onload = init;