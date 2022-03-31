import { LevelConfig } from "./types";
import { Line, lineMeshFromPoints } from "./gameObject/physics";
import { Renderer, Camera } from "./renderer";
import SimplexNoise from "./simplex-noise";
import { Vec2 } from "./gameObject/physics";
import { Player } from "./gameObject/entity";

class Chunk {
    mesh: Line[];
    config: LevelConfig;
    xPosition: number;
    renderer: Renderer;

    constructor(noiseInstance: SimplexNoise, config: LevelConfig, xPosition: number) {
        this.xPosition = xPosition;
        this.config = config;
        this.renderer = new Renderer(config.maxChunkSegments * config.segmentLength, config.maxLevelHeight + this.config.levelDownExtension, new Camera({ x: 0, y: 0 }));
        this.mesh = [];

        this.makeLayout(noiseInstance);
    }

    makeLayout(noiseInstance: SimplexNoise): void {
        let points: Vec2[] = [];
        this.renderer.clear();

        // generate the maximum allowed chunk segments
        for (let i = 0, l = this.config.maxChunkSegments; i <= l; i++) {
            let newX, newY, noiseValue, div;

            // get the position relative to the x position of the chunk
            newX = i * this.config.segmentLength + this.xPosition;

            // generate noise sample for y position
            noiseValue = noiseInstance.noise2D((newX) / this.config.noiseSampleSize, 0);
            div = 0;
            for (let ii = 1; ii < 3; ii++) {
                noiseValue += noiseInstance.noise2D(((newX) / this.config.noiseSampleSize) * ii, 0) / Math.pow(2, ii);
                div += 1 / Math.pow(2, ii);
            }
            noiseValue /= 1 + div;
            noiseValue = noiseValue * this.config.maxLevelHeight / 2;


            newY = noiseValue;
            points.push({ x: newX, y: newY });
        }

        // for full chunk, including bottom rectangle
        points.push({ x: this.xPosition + this.config.maxChunkSegments * this.config.segmentLength, y: this.config.levelDownExtension });
        points.push({ x: this.xPosition, y: this.config.levelDownExtension });

        this.mesh = lineMeshFromPoints(points);

        // this.renderer.color("green");
        // this.renderer.fillShape(points);
    }
}

export class Level {
    config: LevelConfig;
    chunks: Chunk[];
    noiseInstance: SimplexNoise;
    renderer: Renderer;

    constructor(config: LevelConfig, renderer: Renderer) {
        this.config = config;
        this.chunks = [];
        this.noiseInstance = new SimplexNoise();
        this.renderer = renderer;

        this.generateChunks();
    }

    // checkPositionFromLeft(x: number): number {
    //     let chunkX = this.chunks[0].xPosition;

    // }

    update(player: Player): void {
        // check if new chunk has to be generated

    }

    generateChunks(): void {
        let xOffset = -this.config.maxChunkSegments * this.config.segmentLength;

        while (true) {
            if (xOffset > this.renderer.width + this.config.maxChunkSegments * this.config.segmentLength) break;

            this.chunks.push(new Chunk(this.noiseInstance, this.config, xOffset));

            xOffset += this.config.maxChunkSegments * this.config.segmentLength;
        }
    }

    renderLevel(): void {
        this.renderer.translate({ x: 0, y: 0 });

        this.chunks.forEach(chunk => {
            this.renderer.color("green");
            this.renderer.fillLineMesh(chunk.mesh);
        });
    }

    getChunkAt(x: number): Chunk | undefined {
        let self = this;

        if (x == 0) x += 1;

        function a(chunks: Chunk[], start: number, end: number): Chunk | undefined {
            let mid = Math.floor((start + end) / 2);

            let chunk = chunks[mid];

            if (!chunk) return;

            let xMin = chunk.xPosition;
            let xMax = chunk.xPosition + self.config.segmentLength * self.config.maxChunkSegments;

            if (x >= xMin && x <= xMax) {
                return chunk;
            }

            if (x > xMin) return a(chunks, mid + 1, end);
            else return a(chunks, start, mid - 1);
        }

        return a(this.chunks, 0, this.chunks.length);
    }
}