import { GameObject } from "./entity";

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

    update(deltaTime: number): void {
        this.entities.forEach(entity => {
            entity.update(deltaTime);
        });
    }

    render(): void {
        this.entities.forEach(entity => {
            entity.render();
        });
    }
}

const entityManager = new EntityManager();

export { entityManager };