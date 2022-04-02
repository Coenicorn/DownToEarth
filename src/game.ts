import { renderer, loadImages } from "./renderer";
import { InputHandler } from "./inputHandler";
import { entityManager } from "./gameObject/entityManager";
import { Player, Rock } from "./gameObject/entity";
import { StoredAssets } from "./types";
import { level } from "./level";

let inputHandler: InputHandler;
let player: Player;
let storedAssets: StoredAssets;

let menu: HTMLDivElement;
let resumeButton: HTMLDivElement;

let running = true;
const fps = 1000 / 60;
let lastUpdate: number;
let deltaTime: number;
let renderTimer: number;

function update() {
    inputHandler.handleKeys();

    entityManager.update(deltaTime);

    level.checkPlayerCamera(player);
}

function render() {
    renderer.clear();

    renderer.translateToScreenCoordinates({ x: 0, y: 0 });
    renderer.drawSprite(storedAssets["Background1"], 0, 0, renderer.width, renderer.height);

    level.renderLevel();

    entityManager.render();
}

function startGameLoop(): void {
    let now = Date.now();
    deltaTime = (now - lastUpdate) / fps;
    renderTimer += now - lastUpdate;
    lastUpdate = now;

    // for changes in fps, doesn't really help with testing though
    update();

    if (renderTimer > fps) {
        render();

        renderTimer = 0;
    }

    if (running) requestAnimationFrame(startGameLoop);
}

function initDom() {
    resumeButton = document.getElementById("button-resume") as HTMLDivElement;

    menu = document.getElementById("menu") as HTMLDivElement;

    resumeButton.onclick = () => {
        if (running) return;

        renderTimer = 0;
        lastUpdate = Date.now();
        running = true;

        startGameLoop();

        menu.style.visibility = "hidden";
    }
}

function addEventListeners() {
    addEventListener("blur", () => {
        inputHandler.releaseAllkeys();
        running = false;

        menu.style.visibility = "visible";
    });
}

async function init() {
    storedAssets = await loadImages([
        "Background1",
        "rock1",
        "player"
    ], "./src/assets");

    player = new Player(
        { x: 0, y: -300 },
        { x: 50, y: 100 },
        storedAssets["player"]
    );

    entityManager.newEntity(player);
    entityManager.newEntity(new Rock(
        { x: 0, y: -500 },
        200,
        storedAssets["rock1"]
    ));

    inputHandler = new InputHandler({
        "a": () => player.move(0),
        "d": () => player.move(1),
        " ": () => player.move(2),
        "r": () => {
            if (!running) {
                renderTimer = 0;
                lastUpdate = Date.now();

                startGameLoop();
            }
        }
    });

    initDom();
    addEventListeners();

    renderTimer = 0;
    lastUpdate = Date.now();

    startGameLoop();
}

onload = init;