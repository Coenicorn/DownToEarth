import SimplexNoise from "./simplex-noise";

import { Camera, Renderer } from "./renderer";
import { LevelConfig, Vec2 } from "./types";
import { Player } from "./gameobject/entity";

// level split up in chunks
class Chunk {
    position: number;
    renderer: Renderer;
    points: Vec2[];
    config: LevelConfig;

    constructor(pos: number, config: LevelConfig, noiseInstance: SimplexNoise) {
        this.position = pos;

        this.points = [];
        this.config = config;

        this.renderer = new Renderer(this.config.maxChunkSegments * this.config.segmentLength, this.config.maxLevelHeight + this.config.levelDownExtension);

        this.generateNoiseLayout(noiseInstance);
    }

    generateNoiseLayout(noiseInstance: SimplexNoise) {
        this.points = [];
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

            this.points.push({ x: newX, y: newY });

            xOffset += this.config.segmentLength;
        }

        this.points.push({ x: xOffset - this.config.segmentLength, y: this.config.maxLevelHeight + this.config.levelDownExtension });
        this.points.push({ x: 0, y: this.config.maxLevelHeight + this.config.levelDownExtension });

        // render level to cache
        this.renderer.fillShape(this.points, "#4d4d4d");
        // this.renderer.drawShape(this.points);
    }
}

export class Level {
    chunks: Chunk[];
    noiseInstance: SimplexNoise;
    player: Player;
    positionSinceLastChunkGeneration: number;
    camera: Camera;

    config: LevelConfig;

    constructor(player: Player, camera: Camera, config: LevelConfig) {
        this.chunks = [];
        this.noiseInstance = new SimplexNoise();
        this.player = player;
        this.positionSinceLastChunkGeneration = camera.viewport.width;
        this.camera = camera;

        this.config = config;

        this.makeLayout();
    }

    makeLayout() {
        let xOffset = 0;

        while (true) {

            // multiply maxchunksize by segmentlength to get actual level length
            if (xOffset > screen.width + this.config.maxChunkSegments * this.config.segmentLength * 2) break;

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
        let playerX = player.position.x + this.camera.viewport.width / 2;

        if (playerX >= this.positionSinceLastChunkGeneration) {
            this.positionSinceLastChunkGeneration += this.config.maxChunkSegments * this.config.segmentLength;

            let newChunk = this.chunks.shift() as Chunk;

            newChunk.position = this.positionSinceLastChunkGeneration;
            newChunk.generateNoiseLayout(this.noiseInstance);

            this.chunks.push(newChunk);
        }
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