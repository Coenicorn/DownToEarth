import { LevelConfig } from "./types";
import { AABB, intersectsAABB, intersectsAABBLine, Line, lineMeshFromPoints } from "./gameObject/physics";
import { renderer } from "./renderer";
import SimplexNoise from "./simplex-noise";
import { Vec2 } from "./gameObject/physics";
import { Player } from "./gameObject/entity";

class Chunk {
    mesh: Line[];
    config: LevelConfig;
    xPosition: number;

    constructor(noiseInstance: SimplexNoise, config: LevelConfig, xPosition: number) {
        this.xPosition = xPosition;
        this.config = config;
        this.mesh = [];

        this.makeLayout(noiseInstance);
    }

    makeLayout(noiseInstance: SimplexNoise): void {
        let points: Vec2[] = [];

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
    }
}

class Level {
    config: LevelConfig;
    chunks: Chunk[];
    noiseInstance: SimplexNoise;

    constructor(config: LevelConfig) {
        this.config = config;
        this.chunks = [];
        this.noiseInstance = new SimplexNoise();

        this.generateChunks();
    }

    checkPlayerCamera(player: Player): void {
        // check if the camera is allowed to move to the player (if the player is far enough away from the left
        // side of the level)
        let playerX, posFromLeft, posFromRight, chunkX;

        chunkX = this.chunks[0].xPosition;
        playerX = player.position.x;

        posFromLeft = playerX - renderer.center.x - chunkX;
        posFromRight = this.chunks[this.chunks.length - 1].xPosition + this.config.maxChunkSegments * this.config.segmentLength - playerX - renderer.center.x;

        // Check if the player is close enough to the left side of the level to not move the camera
        if (posFromLeft > 0) renderer.camera.moveTo(player.position);
        else renderer.camera.moveTo({ x: chunkX + renderer.center.x, y: player.position.y });

        // stop player from falling off map on the left side
        if (player.position.x <= chunkX) player.position.x = chunkX;

        // check if new chunk needs to be generated
        if (posFromRight < 0) {
            let c = this.chunks.shift()!;

            c.xPosition = this.chunks[this.chunks.length - 1].xPosition + this.config.maxChunkSegments * this.config.segmentLength;
            c.makeLayout(this.noiseInstance);

            this.chunks.push(c);
        }
    }

    generateChunks(): void {
        let xOffset = -this.config.maxChunkSegments * this.config.segmentLength - renderer.center.x;

        while (true) {
            if (xOffset > renderer.width + this.config.maxChunkSegments * this.config.segmentLength + this.config.renderDistance) break;

            this.chunks.push(new Chunk(this.noiseInstance, this.config, xOffset));

            xOffset += this.config.maxChunkSegments * this.config.segmentLength;
        }
    }

    renderLevel(): void {
        renderer.translateRelative({ x: 0, y: 0 });

        this.chunks.forEach(chunk => {
            renderer.color("green");
            renderer.fillLineMesh(chunk.mesh);
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

    getCollidingLines(aabb: AABB): Line[] {
        // get chunks player is in
        let chunks = [], lines: Line[] = [];
        chunks.push(level.getChunkAt(aabb.position.x));
        chunks.push(level.getChunkAt(aabb.position.x + aabb.dimensions.x));

        // for each line segment in said chunks, check for collisions of all line segments of the AABB
        chunks.forEach(chunk => {
            chunk?.mesh.forEach(line => {
                if (intersectsAABBLine(line, aabb)) lines.push(line);
            });
        });

        return lines;
    }
}

export const level = new Level({
    segmentLength: 10,
    maxLevelHeight: 700,
    noiseSampleSize: 2000,
    renderDistance: 500,
    maxChunkSegments: 50,
    levelDownExtension: 1500
});