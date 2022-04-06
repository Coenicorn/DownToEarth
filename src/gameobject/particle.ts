import { Renderer } from "../Renderer";
import { Vec2 } from "./physics";

class Particle {
    position: Vec2;
    velocity: Vec2;
    size: number;
    color: string;
    lifetime: number;

    constructor(pos: Vec2, size: number, color: string, lifetime: number) {
        this.position = pos;
        this.velocity = Vec2.zeroVector;
        this.size = size;
        this.color = color;
        this.lifetime = lifetime;
    }
}

class particleManager {
    private particles: Particle[];

    constructor() {
        this.particles = [];
    }

    update() {

    }
}

export const ParticleManager = new particleManager();