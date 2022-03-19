import SimplexNoise from "./simplex-noise";

import { Renderer } from "./renderer";
import { Vec2 } from "./types";
import { GameObject } from "./gameobject/entity";

// level split up in chunks
class Chunk {
    position: Vec2;
    renderer: Renderer;
    points: Vec2[];

    constructor(pos: Vec2, chunkAmnt: number) {
        this.position = pos;
        this.points = [];

        this.renderer = new Renderer();

        this.makeLayout();
    }

    makeLayout() {
        return;
    }
}

export class Level {
    points: Vec2[];
    segmentLength: number;
    noiseInstance: SimplexNoise;
    maxLevelHeight: number;
    noiseSampleSize: number;
    player: GameObject;
    maxAllowedBackwardsMotion: number;
    maxChunkSegments: number;

    constructor(player: GameObject) {
        this.points = [];
        this.segmentLength = 10;
        this.noiseInstance = new SimplexNoise();

        this.maxLevelHeight = 100;
        this.noiseSampleSize = 1000;
        this.maxAllowedBackwardsMotion = this.segmentLength;
        this.maxChunkSegments = 20;

        this.player = player;

        this.makeLayout();
    }

    makeLayout() {
        return;
    }

    renderLevel(renderer: Renderer) {
        return;
    }

    update() {
        return;
    }
}