import { globalState } from "../main";
import { BoxRendererComponent, CameraFollow, SpriteComponent } from "./components";
import { System, ecs } from "../lib/ECS";
import { view } from "../render";

export class BoxRenderer extends System {
    componentsRequired: Set<Function> = new Set([BoxRendererComponent]);

    update(entities: Set<number>): void {
        for (let id of entities) {
            let entity = ecs.getComponents(id);

            let box = entity.get(BoxRendererComponent);

            let x = globalState.camera.getScreenX(entity.transform.position.x);
            let y = globalState.camera.getScreenY(entity.transform.position.y);

            view.context.fillStyle = box.color;
            view.context.fillRect(x, y, box.width, box.height);
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

            let x = globalState.camera.getScreenX(entity.transform.position.x);
            let y = globalState.camera.getScreenY(entity.transform.position.y);

            view.context.drawImage(spritecomp.image, x - spritecomp.anchor.x * width, y - spritecomp.anchor.y * height, width, height);
        }
    }
}

export class TrackCamera extends System {
    componentsRequired: Set<Function> = new Set([CameraFollow]);

    update(entities: Set<number>): void {
        for (let id of entities) {
            let entity = ecs.getComponents(id);

            // set camera position to entity position
            globalState.camera.setX(entity.transform.position.x);
            globalState.camera.setY(entity.transform.position.y);
        }
    }
}