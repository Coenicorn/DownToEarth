import { Time, GameCamera } from "../main";
import { BoxCollider, BoxRendererComponent, CameraFollow, ControllerComponent, SpriteComponent } from "./components";
import { System, ecs } from "../lib/ECS";
import { view } from "../lib/renderer";
import { Input } from "../input";
import { PhysicsComponent } from "../lib/physics.ecs";
import { Vec2 } from "../lib/vec2";

export class BoxRenderer extends System {
    componentsRequired: Set<Function> = new Set([BoxRendererComponent]);

    update(entities: Set<number>): void {
        for (let id of entities) {
            let entity = ecs.getComponents(id);

            let box = entity.get(BoxRendererComponent);

            let x = GameCamera.getScreenX(entity.transform.position.x);
            let y = GameCamera.getScreenY(entity.transform.position.y);
            let scale = GameCamera.zoom;

            view.context.fillStyle = box.color;
            view.context.fillRect(x, y, box.width * scale, box.height * scale);
        }
    }
}

export class SpriteRenderer extends System {
    componentsRequired: Set<Function> = new Set([SpriteComponent]);

    update(entities: Set<number>): void {
        for (let id of entities.values()) {
            let entity = ecs.getComponents(id);
            let spritecomp = entity.get(SpriteComponent);

            let width = spritecomp.dimensions.x * GameCamera.zoom;
            let height = spritecomp.dimensions.y * GameCamera.zoom;

            let x = GameCamera.getScreenX(entity.transform.position.x);
            let y = GameCamera.getScreenY(entity.transform.position.y);

            view.context.drawImage(spritecomp.image, x - spritecomp.anchor.x, y - spritecomp.anchor.y, width, height);
        }
    }
}

export class TrackCamera extends System {
    componentsRequired: Set<Function> = new Set([CameraFollow]);

    update(entities: Set<number>): void {
        for (let id of entities) {
            let entity = ecs.getComponents(id);

            // set camera position to entity position
            GameCamera.setX(entity.transform.position.x);
            GameCamera.setY(entity.transform.position.y);
        }
    }
}

export class CharacterController extends System {
    componentsRequired: Set<Function> = new Set([ControllerComponent]);

    update(entities: Set<number>): void {
        for (let id of entities) {
            let entity = ecs.getComponents(id);
            let controller = entity.get(ControllerComponent);

            if (Input.hasKey("w")) entity.transform.position.y -= controller.speed * Time.DeltaTime;
            if (Input.hasKey("a")) entity.transform.position.x -= controller.speed * Time.DeltaTime;
            if (Input.hasKey("s")) entity.transform.position.y += controller.speed * Time.DeltaTime;
            if (Input.hasKey("d")) entity.transform.position.x += controller.speed * Time.DeltaTime;
        }
    }
}

export class CollisionManager extends System {
    componentsRequired: Set<Function> = new Set([BoxCollider]);

    update(entities: Set<number>): void {
        for (let id of entities) {
            let entity = ecs.getComponents(id);
            let box1 = entity.get(BoxCollider);

            for (let colId of entities) {
                if (colId == id) continue;

                let collidingEntity = ecs.getComponents(colId);
                let box2 = collidingEntity.get(BoxCollider);

                // check intersection

                if (!(
                    entity.transform.position.x + box1.width < collidingEntity.transform.position.x &&
                    entity.transform.position.x > collidingEntity.transform.position.x + box2.width &&
                    entity.transform.position.y + box1.height < collidingEntity.transform.position.y &&
                    entity.transform.position.y > collidingEntity.transform.position.y + box2.height
                )) continue;

                console.log("colliding");
            }
        }
    }
}