import { WEAPON_TYPES } from '../game/constants.js';

const HEART = '❤️';
const SKULL = '💀';

export class HUD {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this._pickupMsg = '';
    this._pickupTimer = 0;
  }

  showPickup(msg, duration = 2) {
    this._pickupMsg  = msg;
    this._pickupTimer = duration;
  }

  update(dt) {
    if (this._pickupTimer > 0) this._pickupTimer -= dt;
  }

  draw(player, score, level, soundMgr) {
    const { ctx } = this;
    const W = this.canvas.width;
    const H = this.canvas.height;

    // Semi-transparent bottom bar
    ctx.save();
    ctx.globalAlpha = 0.75;
    ctx.fillStyle = '#111';
    ctx.fillRect(0, H - 48, W, 48);
    ctx.restore();

    // HP hearts
    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = '#fff';
    ctx.fillText('HP:', 8, H - 28);
    const hpPct  = player.hp / player.maxHp;
    const barW   = 120;
    ctx.fillStyle = '#333';
    ctx.fillRect(36, H - 38, barW, 14);
    ctx.fillStyle = hpPct > 0.5 ? '#4caf50' : hpPct > 0.25 ? '#ff9800' : '#f44336';
    ctx.fillRect(36, H - 38, Math.round(barW * hpPct), 14);
    ctx.fillStyle = '#fff';
    ctx.fillText(`${player.hp}/${player.maxHp}`, 162, H - 27);

    // Active weapon
    const weapDef = WEAPON_TYPES[player.currentWeapon];
    const ammoTxt = weapDef.ammo === Infinity
      ? '∞'
      : `${player.ammo[weapDef.ammo] ?? 0}`;
    ctx.fillStyle = weapDef.color;
    ctx.font = 'bold 13px monospace';
    ctx.fillText(`${weapDef.label}  [${ammoTxt}]`, W / 2 - 80, H - 18);

    // Score & level (top-right)
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`LEVEL ${level}   SCORE: ${score}`, W - 10, 20);
    ctx.textAlign = 'left';

    // Sound toggles (top-right corner, left of score)
    if (soundMgr) {
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      const mx = soundMgr.musicEnabled ? '#4caf50' : '#f44336';
      const sx = soundMgr.sfxEnabled   ? '#4caf50' : '#f44336';
      ctx.fillStyle = mx; ctx.fillRect(W - 58, 26, 24, 14);
      ctx.fillStyle = '#fff'; ctx.fillText('♪ M', W - 46, 37);
      ctx.fillStyle = sx; ctx.fillRect(W - 30, 26, 24, 14);
      ctx.fillStyle = '#fff'; ctx.fillText('SFX', W - 18, 37);
      ctx.textAlign = 'left';
    }

    // Effect indicators (top-left)
    let effectX = 8;
    if (player.shielded)   { ctx.fillText('⭐ SHIELD', effectX, 20); effectX += 90; }
    if (player.turbo)      { ctx.fillText('🚀 TURBO',  effectX, 20); effectX += 80; }
    if (player.megaDamage) { ctx.fillText('💥 MEGA',   effectX, 20); }

    // Pickup message
    if (this._pickupTimer > 0) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, this._pickupTimer);
      ctx.font = 'bold 18px monospace';
      ctx.fillStyle = '#ffeb3b';
      ctx.textAlign = 'center';
      ctx.fillText(this._pickupMsg, W / 2, H / 2 - 60);
      ctx.restore();
    }
  }

  drawCrosshair() {
    const { ctx } = this;
    const cx = this.canvas.width  / 2;
    const cy = this.canvas.height / 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy); ctx.lineTo(cx + 8, cy);
    ctx.moveTo(cx, cy - 8); ctx.lineTo(cx, cy + 8);
    ctx.stroke();
  }
}
