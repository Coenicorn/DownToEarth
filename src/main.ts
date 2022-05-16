import { BoxCollider, BoxRendererComponent, CameraFollow, ControllerComponent, PlayerComponent, SpriteComponent } from "./ecs/components";
import { ecs, Entity } from "./lib/ECS";
import { SpriteRenderer, BoxRenderer, TrackCamera, CharacterController, CollisionManager } from "./ecs/systems";
import { StoredAssets, loadImage } from "./image";
import { Input } from "./input";
import { Vec2 } from "./lib/vec2";
import { Camera, view } from "./lib/renderer";

const storedAssets = {} as StoredAssets;

export const globalState = {
    level: {
        totalLevelHeight: 100000,
        totalLevelWidth: 4000,
        currentLevel: 1
    }
}

export const GameCamera = new Camera(0, 0);
export const Time = { DeltaTime: 0 };

let border1: Entity;
let border2: Entity;
let player: Entity;
let level: Entity;

let last = 0, targetFps = 60, fps = 1000 / targetFps, timeElapsed = 0, framerateUpdate = 0;
let running = false;

function renderGUI(): void {



    // render height meter
    view.context.drawImage(storedAssets["depth_meter"], 20, 20);

    view.context.fillStyle = "black";
    let yPos = storedAssets["depth_meter"].height / globalState.level.totalLevelHeight * ecs.getComponents(player).transform.position.y;
    yPos = yPos < storedAssets["depth_meter"].height ? yPos : storedAssets["depth_meter"].height;
    view.context.fillRect(10, 20 + yPos, 50, 5);



}

function renderStaticContent(): void {
    view.context.drawImage(storedAssets["landscape"], 0, 0, view.width, view.height);
}

function startGameLoop() {
    let now = Date.now();
    timeElapsed += (now - last);
    Time.DeltaTime = (now - last) / fps;

    framerateUpdate += (now - last);
    if (framerateUpdate > 500) {
        document.getElementById("framerate")!.innerHTML = (fps / (now - last) * targetFps).toString();
        framerateUpdate = 0;
    }

    last = now;

    // clear canvas
    view.context.clearRect(0, 0, view.width, view.height);

    // renderStaticContent();

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

    // LEVEL INITIALIZATION



    level = ecs.newEntity();

    let levelComponents = ecs.getComponents(level);

    ecs.getComponents(level).transform.position = new Vec2(0, 0);
    ecs.addComponent(level, new SpriteComponent(storedAssets["level1"], new Vec2(storedAssets["level1"].width, storedAssets["level1"].height), new Vec2(0, 400)));
    ecs.addComponent(level, new BoxCollider(levelComponents.get(SpriteComponent).dimensions.x, levelComponents.get(SpriteComponent).dimensions.y - 400, true));
    ecs.addComponent(level, new BoxRendererComponent(levelComponents.get(BoxCollider).width, levelComponents.get(BoxCollider).height, "rgba(255, 0, 0, .5)", new Vec2(0, 0)));

    // BORDER INITIALIZATION

    border1 = ecs.newEntity();
    ecs.addComponent(border1, new BoxCollider(1, globalState.level.totalLevelHeight, true));

    border2 = ecs.newEntity();
    ecs.getComponents(border2).transform.position.x = globalState.level.totalLevelWidth;
    ecs.addComponent(border2, new BoxCollider(1, globalState.level.totalLevelHeight, true));

    // PLAYER INITIALIZATION

    player = ecs.newEntity();
    ecs.addComponent(player, new SpriteComponent(storedAssets["player"], new Vec2(100, 100), new Vec2(0, 0)));
    ecs.addComponent(player, new ControllerComponent(8, 8, 6));
    ecs.addComponent(player, new BoxCollider(100, 100, false));
    ecs.addComponent(player, new PlayerComponent());
    ecs.addComponent(player, new CameraFollow());




    // // entity component system initialization
    ecs.addSystem(new CharacterController());
    ecs.addSystem(new CharacterController());
    ecs.addSystem(new CollisionManager());
    ecs.addSystem(new TrackCamera());
    ecs.addSystem(new SpriteRenderer());
    ecs.addSystem(new BoxRenderer());



    // starting the main game loop
    last = Date.now();
    running = true;
    startGameLoop();

}

onload = init;