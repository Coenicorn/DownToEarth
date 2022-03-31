import { GameObject } from "./entity";
import { Renderer } from "../renderer";
import { Level } from "../level";

export class EntityManager {
    private entities: GameObject[];

    constructor() {
        this.entities = [];
    }

    newEntity(entity: GameObject): void {
        if (!this.entities.includes(entity)) this.entities.push(entity);
    }

    removeEntity(entity: GameObject): void {
        if (this.entities.includes(entity)) this.entities.splice(this.entities.indexOf(entity), 1);
    }

    update(level: Level): void {
        this.entities.forEach(entity => {
            // gravity
            if (!entity.onground) entity.acceleration.y += .5;

            entity.update();

            entity.collideLevel(level);
        });
    }

    render(renderer: Renderer): void {
        this.entities.forEach(entity => {
            entity.render(renderer);
        });
    }
}