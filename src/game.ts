import InputHandler from "./inputHandler";
import { Player } from "./gameobject/entity";
import EntityManager from "./gameobject/entityManager";
import { Renderer } from "./renderer";
import BackgroundImage from "./assets/Background1.png";
import { Level } from "./level";

const entityManager = new EntityManager();
const inputHandler = new InputHandler({});
const renderer = new Renderer();
renderer.mount("#main");

let running = true;
let deltaTime = 0;
const fps = 1000 / 60;
let lastUpdate = Date.now();
let renderTimer = 0;

// initialize player
let player = new Player(
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 50, y: 100 }
);
entityManager.newEntity(player);

const level = new Level(player);

function update() {
    entityManager.update(deltaTime);

    level.update();
}

function render() {
    renderer.clear();

    level.renderLevel(renderer);

    entityManager.render(renderer)
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

        renderTimer = 0;
    }

    if (running) requestAnimationFrame(startGameLoop);
}

startGameLoop();