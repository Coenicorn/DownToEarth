import { GameObject } from "./entity";
import { Camera } from "../renderer";

export default class EntityManager {
    entities: GameObject[];

    constructor() {
        this.entities = [];
    }

    update(deltaTime: number) {
        this.entities.forEach(entity => {
            entity.update(deltaTime);

            this.entities.forEach(entityColliding => {
                if (entity == entityColliding) return;

                entity.collide(entityColliding);
            })
        });
    }

    render(camera: Camera) {
        this.entities.forEach(entity => {
            entity.render(camera);
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