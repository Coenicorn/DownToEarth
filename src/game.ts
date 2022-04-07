import { Renderer, loadImage } from "./Renderer";
import { InputHandler } from "./inputHandler";
import { entityManager } from "./gameObject/entityManager";
import { Player, Rock } from "./gameObject/entity";
import { StoredAssets } from "./types";
import { level } from "./level";
import { Vec2 } from "./gameObject/physics";
import generateBackgroundImage from "./background";

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
    Renderer.clear();

    Renderer.translateToScreenCoordinates(new Vec2(Renderer.camera.position.x / 4, Renderer.camera.position.y / 4));
    Renderer.drawSprite(storedAssets["Background1"], 0, 0);

    level.renderLevel();

    entityManager.render();
}

function startGameLoop(): void {
    if (!running) return;

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

    requestAnimationFrame(startGameLoop);
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
    storedAssets = {} as StoredAssets;

    storedAssets["rock1"] = await loadImage("./src/assets/rock1.png");
    storedAssets["player"] = await loadImage("./src/assets/player.png");

    storedAssets["Background1"] = await loadImage(generateBackgroundImage());

    player = new Player(
        new Vec2(0, -300),
        new Vec2(50, 100),
        storedAssets["player"]
    );

    entityManager.newEntity(player);
    entityManager.newEntity(new Rock(
        new Vec2(0, -500),
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