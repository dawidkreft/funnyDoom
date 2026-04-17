// Projectile — shot by player or enemy
import { getSprites, SPRITE_SIZE } from './sprites.js';

export class Projectile {
  constructor(x, y, dx, dy, damage, fromPlayer = true, weapon = 'gumgun') {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.damage = damage;
    this.fromPlayer = fromPlayer;
    this.weapon = weapon;
    this.speed = 6;
    this.alive = true;
    this.radius = 0.08;
  }

  update(dt, map, enemies, player) {
    if (!this.alive) return;

    const steps = 3;
    const stepDt = dt / steps;

    for (let i = 0; i < steps; i++) {
      this.x += this.dx * this.speed * stepDt;
      this.y += this.dy * this.speed * stepDt;

      // Wall collision
      if (map.isWall(this.x, this.y)) {
        this.alive = false;
        return;
      }

      // Hit test
      if (this.fromPlayer) {
        for (const e of enemies) {
          if (!e.alive) continue;
          const ex = e.x - this.x;
          const ey = e.y - this.y;
          if (Math.sqrt(ex*ex + ey*ey) < 0.45) {
            e.takeDamage(this.damage);
            this.alive = false;
            return;
          }
        }
      } else {
        const px = player.x - this.x;
        const py = player.y - this.y;
        if (Math.sqrt(px*px + py*py) < 0.35) {
          player.takeDamage(this.damage);
          this.alive = false;
          return;
        }
      }
    }
  }

  // Sprite draw column — uses weapon-specific sprite texture
  drawColumn(ctx, stripe, drawStartX, drawEndX, drawStartY, drawEndY, spriteW, spriteH) {
    const sprites = getSprites();
    const tex = this.fromPlayer
      ? sprites.projectiles[this.weapon]
      : sprites.projectiles['gumgun']; // enemies reuse balloon (red tint via composite)
    if (!tex) return;

    const texX = Math.floor((stripe - drawStartX) / Math.max(1, spriteW) * SPRITE_SIZE);

    if (!this.fromPlayer) {
      ctx.save();
      ctx.filter = 'hue-rotate(140deg) saturate(2)'; // tint enemy shots red
    }
    ctx.drawImage(
      tex,
      texX, 0, 1, SPRITE_SIZE,
      stripe, drawStartY, 1, Math.max(1, drawEndY - drawStartY)
    );
    if (!this.fromPlayer) ctx.restore();
  }
}
