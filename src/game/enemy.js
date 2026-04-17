import { ENEMY_TYPES } from './constants.js';
import { getSprites, SPRITE_SIZE } from './sprites.js';

// FSM states
const IDLE   = 'idle';
const ALERT  = 'alert';
const CHASE  = 'chase';
const ATTACK = 'attack';
const DEAD   = 'dead';

const DETECT_RANGE  = 8;
const ATTACK_RANGE  = 0.9;

export class Enemy {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    const def = ENEMY_TYPES[type];
    this.hp        = def.hp;
    this.maxHp     = def.hp;
    this.speed     = def.speed;
    this.damage    = def.damage;
    this.color     = def.color;
    this.emoji     = def.emoji;
    this.alive     = true;
    this.state     = IDLE;
    this._attackCooldown = 0;
    this._animFrame = 0;
    this._animTimer = 0;
    this._hitFlash  = 0;
  }

  update(dt, player, map) {
    if (!this.alive) return;

    this._attackCooldown -= dt;
    this._animTimer      += dt;
    if (this._hitFlash > 0) this._hitFlash -= dt;

    if (this._animTimer > 0.15) {
      this._animFrame = (this._animFrame + 1) % 4;
      this._animTimer = 0;
    }

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    switch (this.state) {
      case IDLE:
        if (dist < DETECT_RANGE) this.state = ALERT;
        break;

      case ALERT:
        this.state = CHASE;
        break;

      case CHASE:
        if (dist < ATTACK_RANGE) {
          this.state = ATTACK;
        } else if (dist > DETECT_RANGE * 1.5) {
          this.state = IDLE;
        } else {
          // Move toward player
          const nx = dx / dist;
          const ny = dy / dist;
          const speed = this.speed * dt;
          const nx2 = this.x + nx * speed;
          const ny2 = this.y + ny * speed;
          if (!map.isWall(nx2, this.y)) this.x = nx2;
          if (!map.isWall(this.x, ny2)) this.y = ny2;
        }
        break;

      case ATTACK:
        if (dist > ATTACK_RANGE) {
          this.state = CHASE;
        } else if (this._attackCooldown <= 0) {
          player.takeDamage(this.damage);
          this._attackCooldown = 1.2;
        }
        break;
    }
  }

  takeDamage(amount) {
    this.hp -= amount;
    this._hitFlash = 0.15;
    this._justHit = true;
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
      this._justDied = true;
      this.state = DEAD;
    }
  }

  // Called by Renderer per sprite column stripe
  drawColumn(ctx, stripe, drawStartX, drawEndX, drawStartY, drawEndY, spriteW, spriteH) {
    const sprites = getSprites();
    const tex = sprites.enemies[this.type];
    if (!tex) return;

    // Which column of the 64px texture corresponds to this screen stripe
    const texX = Math.floor((stripe - drawStartX) / Math.max(1, spriteW) * SPRITE_SIZE);

    // Flash white on hit by temporarily drawing with lighter composite
    if (this._hitFlash > 0) {
      ctx.save();
      ctx.globalAlpha = 0.6 + this._hitFlash * 2;
      ctx.filter = 'brightness(3) saturate(0)';
    }

    ctx.drawImage(
      tex,
      texX, 0, 1, SPRITE_SIZE,          // 1px wide source column
      stripe, drawStartY, 1, Math.max(1, drawEndY - drawStartY) // dest
    );

    if (this._hitFlash > 0) ctx.restore();
  }
}
