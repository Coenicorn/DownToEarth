import SimplexNoise from "./simplex-noise";

import { Camera, Renderer } from "./renderer";
import { LevelConfig, Vec2 } from "./types";
import { Player } from "./gameobject/entity";
import { Line, createLineMeshFromPoints, createLine } from "./mesh";

// level split up in chunks
class Chunk {
    position: number;
    renderer: Renderer;
    mesh: Line[];
    config: LevelConfig;

    constructor(pos: number, config: LevelConfig, noiseInstance: SimplexNoise) {
        this.position = pos;

        this.mesh = [];
        this.config = config;

        this.renderer = new Renderer(this.config.maxChunkSegments * this.config.segmentLength, this.config.maxLevelHeight + this.config.levelDownExtension);

        this.generateNoiseLayout(noiseInstance);
    }

    generateNoiseLayout(noiseInstance: SimplexNoise) {
        let points: Vec2[] = [];
        this.renderer.clear();

        let xOffset = 0;

        while (true) {
            // check if level is big enough to stop
            if (xOffset >= this.config.maxChunkSegments * this.config.segmentLength + this.config.segmentLength) break;

            let newX = xOffset;

            // generate new point with y as noise value

            // get noise value from current x position
            let noiseValue = noiseInstance.noise2D((this.position + newX) / this.config.noiseSampleSize, 0);
            let div = 0;
            for (let i = 1; i < 3; i++) {
                noiseValue += noiseInstance.noise2D(((this.position + newX) / this.config.noiseSampleSize) * i, 0) / Math.pow(2, i);
                div += 1 / Math.pow(2, i);
            }
            noiseValue /= 1 + div;
            noiseValue = noiseValue * this.config.maxLevelHeight / 2 + this.config.maxLevelHeight / 2;

            let newY = noiseValue;

            points.push({ x: newX, y: newY });

            xOffset += this.config.segmentLength;
        }

        points.push({ x: xOffset - this.config.segmentLength, y: this.config.maxLevelHeight + this.config.levelDownExtension });
        points.push({ x: 0, y: this.config.maxLevelHeight + this.config.levelDownExtension });

        this.mesh = createLineMeshFromPoints(points);

        // render level to cache
        this.renderer.fillShape(points, "#4d4d4d");
        this.renderer.drawShape(points);

        for (let i = 0; i < this.mesh.length; i++) {
            let x = this.mesh[i].p2.x;
            let y = this.mesh[i].p2.y;
            x -= (this.mesh[i].p2.x - this.mesh[i].p1.x) / 2;
            y -= (this.mesh[i].p2.y - this.mesh[i].p1.y) / 2;
            this.renderer.drawLine(x, y, x + this.mesh[i].surfaceNormal.x, y + this.mesh[i].surfaceNormal.y, 5);
        }
    }
}

export class Level {
    chunks: Chunk[];
    noiseInstance: SimplexNoise;
    positionSinceLastChunkGeneration: number;
    camera: Camera;

    config: LevelConfig;

    constructor(player: Player, camera: Camera, config: LevelConfig) {
        this.chunks = [];
        this.noiseInstance = new SimplexNoise();
        this.positionSinceLastChunkGeneration = camera.viewport.width;
        this.camera = camera;

        this.config = config;

        this.makeLayout();
    }

    makeLayout() {
        let xOffset = -this.config.renderDistance - this.camera.viewport.width / 2;

        while (true) {

            // multiply maxchunksize by segmentlength to get actual level length
            if (xOffset > screen.width / 2 + this.config.renderDistance) break;

            this.chunks.push(new Chunk(xOffset, this.config, this.noiseInstance));

            // multiply maxchunksize by segmentlength to get actual level length
            xOffset += this.config.maxChunkSegments * this.config.segmentLength;
        }

        this.positionSinceLastChunkGeneration = this.chunks[this.chunks.length - 1].position;
    }

    renderLevel() {
        for (let chunk of this.chunks) {
            this.camera.viewport.drawSprite(chunk.renderer.getCanvas(), chunk.position, this.camera.viewport.height - this.config.maxLevelHeight);
        }

        this.camera.viewport.color("red");
    }

    update(player: Player) {
        // the player can only move to the right

        let playerX = player.position.x + this.camera.viewport.width / 2;

        if (playerX >= this.positionSinceLastChunkGeneration) {
            this.positionSinceLastChunkGeneration += this.config.maxChunkSegments * this.config.segmentLength;

            let newChunk = this.chunks.shift() as Chunk;

            newChunk.position = this.positionSinceLastChunkGeneration;
            newChunk.generateNoiseLayout(this.noiseInstance);

            this.chunks.push(newChunk);
        }
    }

    getPositionFromLeft(x: number): number {
        return (x - this.camera.viewport.width / 2) - this.chunks[0].position;
    }

    getChunk(x: number): Chunk | undefined {
        // get the chunk the coordinate lies in
        let self = this;

        function searchChunkArray(chunks: Chunk[], start: number, end: number): Chunk | undefined {
            if (start >= end) return;

            let mid = Math.floor((start + end) / 2);

            if (x > chunks[mid].position && x < chunks[mid].position + self.config.segmentLength * self.config.maxChunkSegments) {
                return chunks[0];
            }

            if (x > chunks[mid].position) {
                return searchChunkArray(chunks, mid + 1, end);
            } else {
                return searchChunkArray(chunks, start, mid - 1);
            }
        }

        return searchChunkArray(this.chunks, 0, this.chunks.length);
    }
}