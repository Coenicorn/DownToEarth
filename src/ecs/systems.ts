import { canvas, context } from "../canvas";
import { Input } from "../input";
import { globalState } from "../main";
import { Vec2 } from "../lib/vec2";
import { BoxCollider, BoxRendererComponent, CameraFollow, ControllerComponent, SpriteComponent } from "./components";
import { System, Component, Entity, ecs } from "../lib/ECS";

export class BoxRenderer extends System {
    componentsRequired: Set<Function> = new Set([BoxRendererComponent]);

    update(entities: Set<number>): void {
        for (let id of entities) {
            let entity = ecs.getComponents(id);

            let box = entity.get(BoxRendererComponent);

            context.fillStyle = box.color;
            context.fillRect(entity.transform.position.x - globalState.camera.position.x, entity.transform.position.y - globalState.camera.position.y, box.width, box.height);
        }
    }
}

export class SpriteRenderer extends System {
    componentsRequired: Set<Function> = new Set([SpriteComponent])

    update(entities: Set<number>): void {
        for (let id of entities.values()) {
            let entity = ecs.getComponents(id);
            let spritecomp = entity.get(SpriteComponent);

            let width = spritecomp.image.width * spritecomp.scale.x;
            let height = spritecomp.image.height * spritecomp.scale.y;

            context.drawImage(spritecomp.image, entity.transform.position.x - spritecomp.anchor.x * width - globalState.camera.position.x, entity.transform.position.y - spritecomp.anchor.y * height - globalState.camera.position.y, width, height);
        }
    }
}

export class TrackCamera extends System {
    componentsRequired: Set<Function> = new Set([CameraFollow]);

    update(entities: Set<number>): void {
        for (let id of entities) {
            let entity = ecs.getComponents(id);

            globalState.camera.position = entity.transform.position.clone();

            globalState.camera.position.x -= canvas.width / 2;
            globalState.camera.position.y -= canvas.height / 2;
        }
    }
}