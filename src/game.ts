import { Renderer, loadImage } from "./Renderer";
import { InputHandler } from "./inputHandler";
import { entityManager } from "./gameObject/entityManager";
import { Player, Rock } from "./gameObject/entity";
import { StoredAssets } from "./types";
import { level } from "./level";
import { Vec2 } from "./gameObject/physics";
import generateBackgroundImage from "./background";
import { Time } from "./time";

let inputHandler: InputHandler;
let player: Player;
let storedAssets: StoredAssets;

let menu: HTMLDivElement;
let resumeButton: HTMLDivElement;

let running = true;
let rockTimer = 0;
let rockChance = .5;

// ------------------------------------------------------------
// rock generation
// ------------------------------------------------------------

function generateRock(player: Player) {
    // generate position for new rock in front of the player
    let newPos = {
        x: player.position.x + Math.random() * 500,
        y: -600
    };

    let rock = new Rock(
        newPos,
        Math.round(Math.random() * 70) + 30,
        storedAssets["rock1"],
    )

    entityManager.newEntity(rock);
}

// ------------------------------------------------------------
//
// ------------------------------------------------------------


function update() {
    inputHandler.handleKeys();

    entityManager.update(Time.deltaTime);

    rockTimer += 1;
    if (rockTimer > 200 && Math.random() > rockChance) {
        generateRock(player);
        rockTimer = 0;
        rockChance = 2;
    } else {
        // rockChance -= .05;
    }

    level.checkPlayerCamera(player);
}

function render() {
    Renderer.clear();

    Renderer.translateToScreenCoordinates({ x: Renderer.camera.position.x / 4, y: Renderer.camera.position.y / 4 });
    Renderer.drawSprite(storedAssets["Background1"], 0, 0);

    level.renderLevel();

    entityManager.render();
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
    storedAssets = {} as StoredAssets;

    storedAssets["rock1"] = await loadImage("./src/assets/rock1.png");
    storedAssets["player"] = await loadImage("./src/assets/player.png");

    storedAssets["Background1"] = await loadImage(generateBackgroundImage());

    player = new Player(
        { x: 0, y: -300 },
        { x: 50, y: 100 },
        storedAssets["player"]
    );

    entityManager.newEntity(player);

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