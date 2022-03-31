import { GameObject } from "./entity";
import { Renderer } from "../renderer";
import { Level } from "../level";
export declare class EntityManager {
    private entities;
    constructor();
    newEntity(entity: GameObject): void;
    removeEntity(entity: GameObject): void;
    update(level: Level): void;
    render(renderer: Renderer): void;
}
