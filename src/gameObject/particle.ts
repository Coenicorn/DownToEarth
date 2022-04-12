import { Renderer } from "../Renderer";
import { Time } from "../time";
import { Vec2 } from "./physics";

export class Particle {
    position: Vec2;
    velocity: Vec2;
    size: number;
    color: string;
    lifetime: number;
    life: number;

    constructor(pos: Vec2, vel: Vec2, size: number, color: string, lifetime: number) {
        this.position = pos;
        this.velocity = vel;
        this.size = size;
        this.color = color;
        this.lifetime = lifetime;
        this.life = this.lifetime;
    }

    update() {
        this.life -= Time.getFrameTime();

        this.position.x += this.velocity.x * Time.deltaTime;
        this.position.y += this.velocity.y * Time.deltaTime;
    }

    render() {
        Renderer.alpha(this.life / this.lifetime);
        Renderer.color(this.color);
        Renderer.translate(Renderer.getScreenPosition(this.position));
        Renderer.drawRectangle(0, 0, this.size, this.size);
        Renderer.alpha(1);
    }
}

class particleManager {
    particles: Particle[];

    constructor() {
        this.particles = [];
    }

    update() {
        this.particles.forEach(particle => {
            particle.update();

            if (particle.life < 0) {
                this.particles.splice(this.particles.indexOf(particle), 1);
            }
        });
    }

    render() {
        this.particles.forEach(particle => {
            particle.render();
        });
    }

    newParticle(p: Particle) {
        this.particles.push(p);
    }
}

export const ParticleManager = new particleManager();