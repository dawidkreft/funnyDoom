// Shared constants — wall colours, risk levels, etc.

// RGB colours for each wall tile ID
export const WALL_COLORS = {
  1: [255, 105, 180],  // hot pink
  2: [255, 220, 50],   // yellow
  3: [80, 200, 80],    // green
  4: [100, 180, 255],  // sky blue
  9: [180, 120, 60],   // brown (door)
};

export const TILE_FLOOR  = 0;
export const TILE_WALL   = 1;

export const ENEMY_TYPES = {
  potato: { hp: 20, speed: 1.5, damage: 5,  color: '#c8a44b', emoji: '🥔' },
  donut:  { hp: 15, speed: 2.0, damage: 8,  color: '#ff9fc8', emoji: '🍩' },
  cactus: { hp: 40, speed: 0.8, damage: 12, color: '#4caf50', emoji: '🌵' },
  frog:   { hp: 80, speed: 1.2, damage: 20, color: '#76ff03', emoji: '🐸' }, // boss
  cloud:  { hp: 30, speed: 1.8, damage: 7,  color: '#b0bec5', emoji: '☁️' },
};

export const WEAPON_TYPES = {
  gumgun:  { damage: 15, cooldown: 0.4, ammo: 'balloons', color: '#ff6e40', label: 'Armatka 🎈' },
  icer:    { damage: 20, cooldown: 0.7, ammo: 'icecreams', color: '#40c4ff', label: 'Lody-Blaster 🍦' },
  plushie: { damage: 10, cooldown: 0.2, ammo: Infinity,    color: '#ce93d8', label: 'Pluszak 🧸' },
  stinker: { damage: 25, cooldown: 1.2, ammo: 'deodorants',color: '#a5d6a7', label: 'Śmierdzik 💨' },
};

export const POWERUP_TYPES = {
  pizza:         { heal: 25,  label: '🍕 +25 HP' },
  shield:        { duration: 5,  effect: 'shielded', label: '⭐ Tęczowa Tarcza' },
  turbo:         { duration: 8,  effect: 'turbo',    label: '🚀 Turbo Trampki' },
  megaammo:      { duration: 10, effect: 'megaDamage',label: '💥 Mega Siła' },
  ammo:          { amount: 25,   label: '🎈 Balony +25' },
  weapon_icer:   { weapon: 'icer',    ammo: { icecreams: 20 },  label: '🍦 Lody-Blaster!' },
  weapon_stinker:{ weapon: 'stinker', ammo: { deodorants: 10 }, label: '💨 Śmierdzik!' },
};
