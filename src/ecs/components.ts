import { Component, Entity } from "../lib/ECS";
import { Vec2 } from "../lib/vec2";

export class CameraFollow extends Component { }

export class Renderable extends Component {
    public readonly anchor: Vec2;

    constructor(
        anchor: Vec2
    ) {
        super();

        this.anchor = anchor;
    }
}

export class SpriteComponent extends Renderable {
    constructor(
        public image: HTMLImageElement,
        public dimensions: Vec2,
        anchor: Vec2
    ) {
        super(anchor);
    }
}

export class ControllerComponent extends Component {
    constructor(
        public speed: number,
        public maxSpeed: number,
        public jumpHeight: number
    ) { super(); }
}

export class BoxCollider extends Component {
    constructor(
        public width: number,
        public height: number,
        public isStatic: boolean,
    ) { super(); }
}

export class BoxRendererComponent extends Renderable {
    constructor(
        public width: number,
        public height: number,
        public color: string,
        anchor: Vec2
    ) { super(anchor); }
}

export class PlayerComponent extends Component {
    constructor() { super(); }
}

export class MotionComponent extends Component {
    constructor(
        public velocity: Vec2,
        public acceleration: Vec2
    ) { super(); }
}