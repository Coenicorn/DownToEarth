import { Renderer, Camera, loadImages } from "./renderer";
import { InputHandler } from "./inputHandler";
import { EntityManager } from "./gameObject/entityManager";
import { Player, Rock } from "./gameObject/entity";
import { StoredAssets } from "./types";
import { Level } from "./level";

let camera: Camera;
let renderer: Renderer;
let inputHandler: InputHandler;
let entityManager: EntityManager;
let player: Player;
let storedAssets: StoredAssets;
let level: Level;

let GRAVITY = 3;

let running = true;
const fps = 1000 / 60;
let lastUpdate: number;

function update() {
    inputHandler.handleKeys();

    entityManager.update(level);

    camera.moveTo(player.position);
}

function render() {
    renderer.clear();

    renderer.translateToScreenCoordinates({ x: 0, y: 0 });
    renderer.drawSprite(storedAssets["Background1"], 0, 0, renderer.width, renderer.height);

    level.renderLevel();

    entityManager.render(renderer);
}

function startGameLoop(): void {
    let now = Date.now();
    let lag = now - lastUpdate;
    lastUpdate = now;

    while (lag >= 0) {

        update();
        lag -= fps;
    }

    render();

    if (running) requestAnimationFrame(startGameLoop);
}

async function init() {
    storedAssets = await loadImages([
        "Background1"
    ], "./src/assets");

    camera = new Camera({ x: 0, y: 0 });
    renderer = new Renderer(innerWidth, innerHeight, camera);
    renderer.mount("#main");

    entityManager = new EntityManager();

    player = new Player(
        { x: 0, y: -300 },
        { x: 50, y: 100 }
    );

    entityManager.newEntity(player);
    // entityManager.newEntity(new Rock(
    //     { x: 0, y: 0 },
    //     { x: 200, y: 200 }
    // ))

    inputHandler = new InputHandler({
        "a": () => player.move(0),
        "d": () => player.move(1),
        " ": () => player.move(2)
    });

    level = new Level({
        segmentLength: 10,
        maxLevelHeight: 500,
        noiseSampleSize: 1000,
        renderDistance: 500,
        maxChunkSegments: 50,
        levelDownExtension: 1500
    }, renderer);

    lastUpdate = Date.now();

    startGameLoop();
}

onload = init;