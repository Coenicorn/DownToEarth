import { Renderer } from "./Renderer";
import { InputHandler } from "./inputHandler";
import { entityManager } from "./gameObject/entityManager";
import { level } from "./level";
import { Time } from "./time";
import { Player } from "./gameObject/player";
import { storedAssets, loadImages } from "./image";
import { Particle, ParticleManager } from "./gameObject/particle";

let inputHandler: InputHandler;
let player: Player;

let menu: HTMLDivElement;
let resumeButton: HTMLDivElement;

let running = true;
let cameraSpeed = 5;

function update() {
    inputHandler.handleKeys();

    if (!player.alive) {
        // stop game
        running = false;
    }

    entityManager.update(Time.deltaTime);

    ParticleManager.update();
    level.checkPlayerCamera(player);

    Renderer.camera.moveTo({ x: Renderer.camera.position.x + cameraSpeed, y: player.position.y });

    if (player.position.x + Renderer.center.x - Renderer.camera.position.x < 0) {
        player.alive = false;
    }

    cameraSpeed += 0.01;
}

function render() {
    Renderer.clear();

    Renderer.translate({ x: 0, y: 0 });
    Renderer.drawSprite(storedAssets["Background1"], 0, 0);

    level.renderLevel();

    entityManager.render();
    ParticleManager.render();
}

function startGameLoop(): void {
    Time.update();

    // for changes in fps, doesn't really help with testing though
    if (running) update();

    if (Time.canRender) {
        render();

        Time.resetRendertimer();
    }

    requestAnimationFrame(startGameLoop);
}

function initDom() {
    resumeButton = document.getElementById("button-resume") as HTMLDivElement;

    menu = document.getElementById("menu") as HTMLDivElement;

    resumeButton.onclick = () => {
        if (running) return;

        Time.reset();
        running = true;

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
    await loadImages();

    player = new Player(
        { x: 0, y: -300 },
        { x: 50, y: 100 },
        storedAssets["player"]
    );

    entityManager.addPlayer(player);
    entityManager.generateRock();

    inputHandler = new InputHandler({
        "a": () => player.move(0),
        "d": () => player.move(1),
        " ": () => player.move(2),
    });

    initDom();
    addEventListeners();

    Time.reset();
    Time.setFps(60);

    startGameLoop();
}

onload = init;