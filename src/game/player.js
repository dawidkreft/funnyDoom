import { WEAPON_TYPES } from './constants.js';

export class Player {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;

    this.hp = 100;
    this.maxHp = 100;
    this.dead = false;

    // Weapons & ammo
    this.weapons = ['gumgun', 'plushie'];
    this.currentWeapon = 'gumgun';
    this.ammo = { balloons: 50, icecreams: 0, deodorants: 0 };

    // Active effects
    this.shielded = false;
    this.turbo = false;
    this.megaDamage = false;
    this._effectTimers = {};

    // Cooldown between shots
    this._shotCooldown = 0;

    // Visual feedback
    this.hitFlash = 0;   // seconds remaining
    this.pickupFlash = 0;
  }

  get speedMult() { return this.turbo ? 1.5 : 1.0; }
  get damageMult() { return this.megaDamage ? 2.0 : 1.0; }

  canShoot() {
    const def = WEAPON_TYPES[this.currentWeapon];
    if (this._shotCooldown > 0) return false;
    if (def.ammo === Infinity) return true;
    return (this.ammo[def.ammo] ?? 0) > 0;
  }

  shoot() {
    const def = WEAPON_TYPES[this.currentWeapon];
    this._shotCooldown = def.cooldown;
    if (def.ammo !== Infinity) this.ammo[def.ammo]--;
    return {
      damage: Math.round(def.damage * this.damageMult),
      weapon: this.currentWeapon,
    };
  }

  takeDamage(amount) {
    if (this.shielded) return;
    this.hp = Math.max(0, this.hp - amount);
    this.hitFlash = 0.25;
    this._justHit = true;
    if (this.hp <= 0) this.dead = true;
  }

  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
    this.pickupFlash = 0.2;
  }

  applyEffect(type, duration) {
    this[type] = true;
    clearTimeout(this._effectTimers[type]);
    this._effectTimers[type] = setTimeout(() => {
      this[type] = false;
    }, duration * 1000);
    this.pickupFlash = 0.2;
  }

  switchWeapon(dir) {
    const idx = this.weapons.indexOf(this.currentWeapon);
    const next = (idx + dir + this.weapons.length) % this.weapons.length;
    this.currentWeapon = this.weapons[next];
  }

  addWeapon(name) {
    if (!this.weapons.includes(name)) {
      this.weapons.push(name);
    }
    this.currentWeapon = name;
  }

  update(dt) {
    if (this._shotCooldown > 0) this._shotCooldown -= dt;
    if (this.hitFlash > 0)    this.hitFlash    -= dt;
    if (this.pickupFlash > 0) this.pickupFlash -= dt;
  }
}
