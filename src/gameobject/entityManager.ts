import { GameObject } from "./entity";
import { Renderer } from "../renderer";
import { Level } from "../level";

class EntityManager {
    private entities: GameObject[];

    constructor() {
        this.entities = [];
    }

    getEntity(id: string): GameObject | null {
        for (let entity of this.entities) {
            if (entity.id == id) return entity;
        }

        return null;
    }

    newEntity(entity: GameObject): void {
        if (!this.entities.includes(entity)) this.entities.push(entity);
    }

    removeEntity(entity: GameObject): void {
        if (this.entities.includes(entity)) this.entities.splice(this.entities.indexOf(entity), 1);
    }

    update(level: Level, deltaTime: number): void {
        this.entities.forEach(entity => {
            entity.update(deltaTime);

            entity.collideLevel(level);
        });
    }

    render(renderer: Renderer): void {
        this.entities.forEach(entity => {
            entity.render(renderer);
        });
    }
}

const entityManager = new EntityManager();

export { entityManager };