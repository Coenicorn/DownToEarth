import InputHandler from "./inputHandler";
import { Player, Rock } from "./gameobject/entity";
import EntityManager from "./gameobject/entityManager";
import { Camera, Renderer, loadImages } from "./renderer";
import { Level } from "./level";
import { StoredAssets } from "./types";

let entityManager: EntityManager;
let player: Player;
let inputHandler: InputHandler;
let renderer: Renderer;
let level: Level;
let camera: Camera;
let globalImages: StoredAssets;

let running = true;
let deltaTime = 0;
const fps = 1000 / 60;
let lastUpdate = Date.now();
let renderTimer = 0;

function update() {
    inputHandler.handleKeys();

    camera.follow(player);

    entityManager.update(deltaTime);

    // level.update(player);
}

function render() {
    camera.viewport.clear();
    camera.viewport.translate(0, 0);

    camera.viewport.drawSprite(globalImages["Background1"], 0, 0, camera.viewport.width, camera.viewport.height);

    camera.viewport.translateVec2(camera.position);

    level.renderLevel();

    entityManager.render(camera);
}

function startGameLoop(): void {

    let now = Date.now();
    deltaTime = (now - lastUpdate) / fps;
    renderTimer += now - lastUpdate;
    lastUpdate = now;

    update();

    render();

    if (renderTimer > fps) {
        render();

        document.getElementById("player-pos")!.innerHTML = `Player position: {${Math.round(player.position.x)}, ${Math.round(player.position.y)}}`

        renderTimer = 0;
    }

    if (running) requestAnimationFrame(startGameLoop);
}

async function init() {
    globalImages = await loadImages([
        "Background1"
    ], "./src/assets");

    renderer = new Renderer(screen.width, screen.height);
    renderer.mount("#main");

    camera = new Camera({ x: 0, y: 0 }, 5, renderer);

    player = new Player(
        { x: 0, y: 0 },
        { x: 50, y: 50 }
    );

    entityManager = new EntityManager();
    entityManager.newEntity(player);

    inputHandler = new InputHandler({
        " ": () => player.move(0),
        "a": () => player.move(1),
        "d": () => player.move(2),
        "s": () => player.move(3),
        "w": () => player.move(4)
    });

    level = new Level(player, camera, {
        segmentLength: 10,
        maxLevelHeight: 200,
        noiseSampleSize: 500,
        renderDistance: 1000,
        maxChunkSegments: 100,
        levelDownExtension: 500
    });

    entityManager.newEntity(new Rock(
        { x: 100, y: 0 },
        { x: 100, y: 100 }
    ))

    startGameLoop();
}

onload = init;