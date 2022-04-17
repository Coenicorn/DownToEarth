import { Renderer } from "./renderer";
import { InputHandler } from "./inputHandler";
import { entityManager } from "./gameObject/entityManager";
import { level } from "./level";
import { Time } from "./time";
import { Player } from "./gameObject/player";
import { storedAssets, loadImages } from "./image";

let inputHandler: InputHandler;
let player: Player;

let running = true;
let gameAnimationFrameReference: number;

function update() {
    inputHandler.handleKeys();

    if (!player.alive) {
        // stop game
        running = false;
        showMenu();
    }

    entityManager.update(Time.deltaTime);

    level.update(player);
}

function render() {
    Renderer.clear();

    Renderer.translate({ x: 0, y: 0 });
    Renderer.drawSprite(storedAssets["Background1"], 0, 0, Renderer.width, Renderer.height);

    level.renderLevel();

    entityManager.render();

    document.getElementById("score")!.innerHTML = `Score: ${Time.getTimeElapsed()}`;
}

function startGameLoop(): void {
    if (running) requestAnimationFrame(startGameLoop);

    Time.update(running);

    // for changes in fps, doesn't really help with testing though
    update();

    if (Time.canRender) {
        render();

        Time.resetRendertimer();
    }
}

async function init() {
    await loadImages();

    player = new Player(
        { x: 0, y: 0 },
        { x: 50, y: 100 },
        storedAssets["player"]
    );

    entityManager.addPlayer(player);
    entityManager.generateRock();

    inputHandler = new InputHandler({
        "a": () => player.move(0),
        "d": () => player.move(1),
        " ": () => player.move(2),
        "Escape": () => {
            running = false;
            showMenu();
        }
    });

    initMenuFunctionsDom();

    Time.reset();
    Time.setFps(60);
}

// ----------------
// DOM FUNCTIONS
// ----------------

function showMenu() {
    document.getElementById("menu")!.style.visibility = "visible";
}

function hideMenu() {
    document.getElementById("menu")!.style.visibility = "hidden";
}

function startGame() {
    player.alive = true;
    running = true;
    Time.reset();
    cancelAnimationFrame(gameAnimationFrameReference);
    startGameLoop();
}

function initMenuFunctionsDom() {
    let resetButton, resumeButton;

    resetButton = document.getElementById("reset") as HTMLDivElement;
    resumeButton = document.getElementById("resume") as HTMLDivElement;

    // initialize newGame functionality
    resetButton.onclick = reset;

    resumeButton.onclick = resume;
}

function reset() {
    entityManager.reset();
    player.reset();
    Time.resetTimeElapsed();

    level.generateChunks();
    startGame();

    hideMenu();
}

function resume() {
    if (!player.alive) return;

    startGame();

    hideMenu();
}

// ----------------
// END
// ----------------

onload = init;