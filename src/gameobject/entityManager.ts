import { GameObject } from "./entity";
import { Renderer } from "../renderer";

export default class EntityManager {
    entities: GameObject[];

    constructor() {
        this.entities = [];
    }

    update(deltaTime: number) {
        this.entities.forEach(entity => {
            entity.update(deltaTime);
        });
    }

    render(renderer: Renderer) {
        this.entities.forEach(entity => {
            entity.render(renderer);
        });
    }

    newEntity(entity: GameObject): GameObject {
        if (!this.entities.includes(entity)) this.entities.push(entity);

        return entity;
    }

    removeEntity(entity: GameObject) {
        if (this.entities.includes(entity)) this.entities.splice(this.entities.indexOf(entity), 1);
    }
}