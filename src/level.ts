import { LevelConfig, Vec2 } from "./types";
import { Line, lineMeshFromPoints } from "./gameObject/physics";
import { Renderer, Camera } from "./renderer";
import SimplexNoise from "./simplex-noise";

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

            newX = i * this.config.segmentLength;

            // generate noise sample for y position
            noiseValue = noiseInstance.noise2D((this.xPosition + newX) / this.config.noiseSampleSize, 0);
            div = 0;
            for (let ii = 1; ii < 3; ii++) {
                noiseValue += noiseInstance.noise2D(((this.xPosition + newX) / this.config.noiseSampleSize) * ii, 0) / Math.pow(2, ii);
                div += 1 / Math.pow(2, ii);
            }
            noiseValue /= 1 + div;
            noiseValue = noiseValue * this.config.maxLevelHeight / 2 + this.config.maxLevelHeight / 2;


            newY = noiseValue;
            points.push({ x: newX, y: newY });
        }

        // for full chunk, including bottom rectangle
        points.push({ x: this.config.maxChunkSegments * this.config.segmentLength, y: this.config.levelDownExtension });
        points.push({ x: 0, y: this.config.levelDownExtension });

        this.mesh = lineMeshFromPoints(points);

        this.renderer.color("green");
        this.renderer.fillShape(points);
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
            this.renderer.drawSprite(chunk.renderer.getCanvas(), chunk.xPosition, 0);
        });
    }

    getChunkAt(x: number): Chunk | undefined {
        let self = this;

        function a(chunks: Chunk[], start: number, end: number): Chunk | undefined {
            if (start > end) return;

            let mid = Math.floor((start + end) / 2);

            let chunk = chunks[mid];

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