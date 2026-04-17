// Renderer — draws walls, floor/ceiling, and sprites onto canvas
import { WALL_COLORS } from '../game/constants.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    // Pre-allocate pixel buffer for floor/ceiling
    this.imageData = this.ctx.createImageData(this.width, this.height);
  }

  resize(w, h) {
    this.width = w;
    this.height = h;
    this.imageData = this.ctx.createImageData(w, h);
  }

  drawScene(hits, camera, sprites, zBuffer) {
    this._drawFloorCeiling(camera);
    this._drawWalls(hits);
    this._drawSprites(sprites, camera, zBuffer);
  }

  _drawFloorCeiling(camera) {
    const { width, height, imageData } = this;
    const data = imageData.data;
    const halfH = height >> 1;

    for (let y = 0; y < height; y++) {
      const isCeiling = y < halfH;
      const rowDist = isCeiling
        ? height / (height - 2 * y + 1e-9)
        : height / (2 * y - height + 1e-9);

      const floorStepX = rowDist * (2 * camera.planeX) / width;
      const floorStepY = rowDist * (2 * camera.planeY) / width;

      let floorX = camera.x + rowDist * (camera.dirX - camera.planeX);
      let floorY = camera.y + rowDist * (camera.dirY - camera.planeY);

      for (let x = 0; x < width; x++) {
        // Simple checker pattern for floor, gradient for ceiling
        const fx = Math.floor(floorX) & 1;
        const fy = Math.floor(floorY) & 1;
        const idx = (y * width + x) * 4;

        if (isCeiling) {
          // Sky gradient: light blue → darker
          const t = y / halfH;
          data[idx]     = Math.round(135 - t * 80);
          data[idx + 1] = Math.round(206 - t * 100);
          data[idx + 2] = Math.round(235 - t * 80);
          data[idx + 3] = 255;
        } else {
          // Checkerboard floor
          const bright = (fx === fy) ? 180 : 120;
          data[idx]     = bright;
          data[idx + 1] = Math.round(bright * 0.9);
          data[idx + 2] = Math.round(bright * 0.6);
          data[idx + 3] = 255;
        }

        floorX += floorStepX;
        floorY += floorStepY;
      }
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  _drawWalls(hits) {
    const { ctx, width, height } = this;
    const halfH = height >> 1;

    for (let x = 0; x < width; x++) {
      const { perpWallDist, side, wallX, tileId } = hits[x];
      if (perpWallDist <= 0) continue;

      const lineHeight = Math.min(height * 2, Math.round(height / perpWallDist));
      const drawStart = Math.max(0, halfH - (lineHeight >> 1));
      const drawEnd   = Math.min(height - 1, halfH + (lineHeight >> 1));

      // Pick wall color from palette
      const base = WALL_COLORS[tileId] || WALL_COLORS[1];
      const shade = side === 1 ? 0.6 : 1.0; // darken EW sides
      const dist  = Math.max(0, 1 - perpWallDist / 12);

      ctx.fillStyle = `rgb(${Math.round(base[0] * shade * dist)},${Math.round(base[1] * shade * dist)},${Math.round(base[2] * shade * dist)})`;
      ctx.fillRect(x, drawStart, 1, drawEnd - drawStart);
    }
  }

  // Sprite billboard rendering
  _drawSprites(sprites, camera, zBuffer) {
    if (!sprites || sprites.length === 0) return;
    const { ctx, width, height } = this;

    // Sort sprites by distance (farthest first) — keep original object reference to preserve class methods
    const sorted = sprites
      .filter(s => s.alive !== false)
      .map(s => {
        const dx = s.x - camera.x;
        const dy = s.y - camera.y;
        return { ref: s, dist: dx * dx + dy * dy, x: s.x, y: s.y };
      })
      .sort((a, b) => b.dist - a.dist);

    const invDet = 1 / (camera.planeX * camera.dirY - camera.dirX * camera.planeY);

    for (const { ref: sp, x: spX, y: spY } of sorted) {
      const spriteX = spX - camera.x;
      const spriteY = spY - camera.y;

      const transformX = invDet * (camera.dirY * spriteX - camera.dirX * spriteY);
      const transformY = invDet * (-camera.planeY * spriteX + camera.planeX * spriteY);

      if (transformY <= 0.1) continue; // behind camera

      const spriteScreenX = Math.round((width / 2) * (1 + transformX / transformY));
      const spriteH = Math.abs(Math.round(height / transformY));
      const spriteW = spriteH;

      const drawStartY = Math.max(0, Math.round((height - spriteH) / 2));
      const drawEndY   = Math.min(height - 1, Math.round((height + spriteH) / 2));
      // rawStartX is the UNCLAMPED left edge of the sprite in screen space.
      // We pass it to drawColumn so the texture UV is correct even when the
      // sprite is partially off the left edge of the screen.
      const rawStartX  = Math.round(spriteScreenX - spriteW / 2);
      const drawStartX = Math.max(0, rawStartX);
      const drawEndX   = Math.min(width - 1, Math.round(spriteScreenX + spriteW / 2));

      for (let stripe = drawStartX; stripe <= drawEndX; stripe++) {
        if (transformY > zBuffer[stripe]) continue; // wall in front
        sp.drawColumn(ctx, stripe, rawStartX, drawEndX, drawStartY, drawEndY, spriteW, spriteH, transformY);
      }
    }
  }

  // Flash overlay (damage, pickup etc.)
  drawFlash(color, alpha) {
    const { ctx, width, height } = this;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }
}
