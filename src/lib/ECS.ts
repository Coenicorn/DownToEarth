import { Vec2 } from "./vec2";

export type Entity = number;

export abstract class Component { }

class Transform extends Component {
    constructor(
        public position: Vec2,
    ) { super(); }
}

export abstract class System {
    ecs!: ecsLocal;

    abstract componentsRequired: Set<Function>;
    abstract update(entities: Set<Entity>): void;
}

type ComponentClass<T extends Component> = new (...args: any[]) => T;

class ComponentContainer {
    public components = new Map<Function, Component>();

    public transform = new Transform(new Vec2(0, 0));

    add(component: Component): void {
        this.components.set(component.constructor, component);
    }

    get<T extends Component>(component: ComponentClass<T>): T {
        return this.components.get(component) as T;
    }

    remove<T extends Component>(component: ComponentClass<T>): void {
        this.components.delete(component.constructor);
    }

    has<T extends Component>(component: ComponentClass<T>): boolean {
        return this.components.has(component);
    }

    hasAll(componentClasses: Iterable<Function>): boolean {
        for (let cls of componentClasses) {
            if (!this.components.has(cls)) return false;
        }

        return true;
    }
}

class ecsLocal {
    private entities = new Map<Entity, ComponentContainer>();
    private entitiesToRemove: Array<Entity> = [];

    private systems = new Map<System, Set<Entity>>();

    private nextEntityId = 0;

    newEntity(): Entity {
        let e = this.nextEntityId;
        this.nextEntityId++;
        this.entities.set(e, new ComponentContainer());
        return e;
    }

    removeEntity(entity: Entity): void {
        this.entitiesToRemove.push(entity);
    }

    addComponent(entity: Entity, component: Component): void {
        this.entities.get(entity)?.add(component);
        this.checkEntity(entity);
    }

    getComponents(entity: Entity): ComponentContainer {
        return this.entities.get(entity) as ComponentContainer;
    }

    addSystem(system: System): void {
        system.ecs = this;

        this.systems.set(system, new Set());

        for (let entity of this.entities.keys()) {
            this.checkES(entity, system);
        }
    }

    checkEntity(entity: Entity): void {
        for (let system of this.systems.keys()) {
            this.checkES(entity, system);
        }
    }

    checkES(entity: Entity, system: System): void {
        let need = system.componentsRequired;
        let have = this.entities.get(entity);
        if (have?.hasAll(need)) {
            this.systems.get(system)?.add(entity);
        } else {
            this.systems.get(system)?.delete(entity);
        }
    }

    destroyEntity(entity: Entity): void {
        this.entities.delete(entity);
        for (let entities of this.systems.values()) {
            entities.delete(entity);
        }
    }

    update(): void {
        for (let [system, entities] of this.systems.entries()) {
            system.update(entities);
        }

        // remove entities
        for (let i = 0; i < this.entitiesToRemove.length; i++) {
            let e = this.entitiesToRemove.pop()

            if (!e) return;

            this.destroyEntity(e);
        }
    }
}

export const ecs = new ecsLocal();