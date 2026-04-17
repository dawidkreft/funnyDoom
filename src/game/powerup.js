import { POWERUP_TYPES } from './constants.js';
import { getSprites, SPRITE_SIZE } from './sprites.js';

export class Powerup {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.alive = true;
    const def = POWERUP_TYPES[type] || {};
    this.label = def.label || type;
    this._bobTimer = Math.random() * Math.PI * 2;
  }

  update(dt) {
    this._bobTimer += dt * 2;
  }

  tryPickup(player) {
    if (!this.alive) return false;
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    if (Math.sqrt(dx * dx + dy * dy) > 0.65) return false;

    const def = POWERUP_TYPES[this.type];
    if (!def) return false;

    if (def.heal)   player.heal(def.heal);
    if (def.effect) player.applyEffect(def.effect, def.duration);
    if (def.amount) player.ammo.balloons = (player.ammo.balloons || 0) + def.amount;
    if (def.weapon) {
      player.addWeapon(def.weapon);
      if (def.ammo) Object.assign(player.ammo, def.ammo);
    }

    this.alive = false;
    return true;
  }

  drawColumn(ctx, stripe, drawStartX, drawEndX, drawStartY, drawEndY, spriteW, spriteH) {
    const sprites = getSprites();
    const tex = sprites.pickups[this.type];
    if (!tex) return;

    // Gentle vertical bob using a sine wave baked into drawStartY offset
    const bob = Math.round(Math.sin(this._bobTimer) * 4);
    const sy = drawStartY + bob;
    const ey = drawEndY   + bob;

    const texX = Math.floor((stripe - drawStartX) / Math.max(1, spriteW) * SPRITE_SIZE);
    ctx.drawImage(tex, texX, 0, 1, SPRITE_SIZE, stripe, sy, 1, Math.max(1, ey - sy));
  }
}
