import { Camera }       from './engine/camera.js';
import { Raycaster }    from './engine/raycaster.js';
import { Renderer }     from './engine/renderer.js';
import { Player }       from './game/player.js';
import { Enemy }        from './game/enemy.js';
import { Projectile }   from './game/projectile.js';
import { Powerup }      from './game/powerup.js';
import { HUD }          from './ui/hud.js';
import { Menu }         from './ui/menu.js';
import { SoundManager } from './audio/soundmanager.js';
import { createLevel1 } from './map/levels/level1.js';
import { createLevel2 } from './map/levels/level2.js';
import { createLevel3 } from './map/levels/level3.js';
import { createLevel4 } from './map/levels/level4.js';

const LEVEL_FACTORIES = [createLevel1, createLevel2, createLevel3, createLevel4];

// ─── Canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('gameCanvas');
const BASE_W = 640, BASE_H = 400;
canvas.width  = BASE_W;
canvas.height = BASE_H;

function scaleCanvas() {
  const scale = Math.min(window.innerWidth / BASE_W, window.innerHeight / BASE_H);
  canvas.style.width  = `${BASE_W * scale}px`;
  canvas.style.height = `${BASE_H * scale}px`;
}
scaleCanvas();
window.addEventListener('resize', scaleCanvas);

// ─── Input ───────────────────────────────────────────────────────────────────
const keys = {};
let mouseMovX = 0;
let mouseDown = false;
let pointerLocked = false;

window.addEventListener('keydown', e => {
  keys[e.code] = true;
  // Init audio on first interaction (Chrome autoplay policy)
  game.sound.init();
  if (e.code === 'Escape') handleEscape();
  if ((e.code === 'ArrowUp')   && game.menu.visible) { game.menu.navigate(-1); e.preventDefault(); }
  if ((e.code === 'ArrowDown') && game.menu.visible) { game.menu.navigate(1);  e.preventDefault(); }
  if (e.code === 'Enter' && game.menu.visible) handleMenuSelect();
  if (e.code === 'KeyQ' && game.player) game.player.switchWeapon(-1);
  if (e.code === 'KeyE' && game.player) game.player.switchWeapon(1);
  // Sound toggles
  if (e.code === 'KeyM') {
    const on = game.sound.toggleMusic();
    game.hud.showPickup(on ? '♪ Muzyka WŁĄCZONA' : '♪ Muzyka WYŁĄCZONA', 1.5);
  }
  if (e.code === 'KeyN') {
    const on = game.sound.toggleSfx();
    game.hud.showPickup(on ? '🔊 Dźwięki WŁĄCZONE' : '🔇 Dźwięki WYŁĄCZONE', 1.5);
  }
});
window.addEventListener('keyup', e => { keys[e.code] = false; });

canvas.addEventListener('click', () => {
  game.sound.init();
  if (!pointerLocked && !game.menu.visible) canvas.requestPointerLock();
  else if (game.menu.visible) handleMenuSelect();
});
canvas.addEventListener('mousedown', () => { mouseDown = true; game.sound.init(); });
canvas.addEventListener('mouseup',   () => { mouseDown = false; });
document.addEventListener('mousemove', e => {
  if (document.pointerLockElement === canvas) mouseMovX += e.movementX;
});
document.addEventListener('pointerlockchange', () => {
  pointerLocked = document.pointerLockElement === canvas;
});

function handleEscape() {
  if (game.state === 'playing') {
    game.state = 'paused';
    game.sound.stopMusic();
    game.menu.show('paused');
  } else if (game.state === 'paused') {
    game.state = 'playing';
    game.sound.startMusic();
    game.menu.hide();
  }
}

function handleMenuSelect() {
  const sel = game.menu.getSelection();
  if (!sel) return;
  if (sel.includes('GRAJ') || sel.includes('WRÓĆ')) {
    if (game.state === 'main') loadLevel(1);
    game.state = 'playing';
    game.menu.hide();
    game.sound.startMusic();
    if (!pointerLocked) canvas.requestPointerLock();
  } else if (sel.includes('MENU')) {
    game.sound.stopMusic();
    game.state = 'main';
    game.menu.show('main');
  } else if (sel.includes('RESTART')) {
    loadLevel(game.level);
    game.state = 'playing';
    game.menu.hide();
    game.sound.startMusic();
  } else if (sel.includes('NASTĘPNY')) {
    loadLevel(game.level + 1);
    game.state = 'playing';
    game.menu.hide();
    game.sound.startMusic();
  }
}

// ─── Game state ──────────────────────────────────────────────────────────────
const game = {
  state: 'main',
  level: 1,
  score: 0,
  map: null,
  camera: null,
  player: null,
  enemies: [],
  projectiles: [],
  powerups: [],
  raycaster: new Raycaster(BASE_W),
  renderer: new Renderer(canvas),
  hud: new HUD(canvas),
  menu: new Menu(canvas),
  sound: new SoundManager(),
};

game.menu.show('main');

function loadLevel(num) {
  game.level = num;
  const factory = LEVEL_FACTORIES[Math.min(num - 1, LEVEL_FACTORIES.length - 1)];
  const map = factory();
  game.map = map;

  const { x, y, angle } = map.playerStart;
  game.camera = new Camera(x, y, angle);
  game.player = new Player(x, y, angle);

  // Safety filter: remove any spawns inside walls (map authoring protection)
  game.enemies = map.enemySpawns
    .filter(s => !map.isWall(s.x, s.y))
    .map(s => new Enemy(s.x, s.y, s.type));
  game.powerups = map.items.map(i => new Powerup(i.x, i.y, i.type));
  game.projectiles = [];
}

// ─── Game loop ───────────────────────────────────────────────────────────────
let lastTime = 0;

function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  if (game.state === 'playing') update(dt);
  render();
}

function update(dt) {
  const { camera, player, map, enemies, projectiles, powerups } = game;

  // Rotation (keyboard + mouse)
  const rotDelta = (keys['ArrowLeft']  ? -camera.rotSpeed * dt : 0)
                 + (keys['ArrowRight'] ?  camera.rotSpeed * dt : 0)
                 + mouseMovX * 0.003;
  mouseMovX = 0;
  camera.rotate(rotDelta);

  // Movement
  const spd = camera.moveSpeed * player.speedMult * dt;
  const fwd = (keys['KeyW'] || keys['ArrowUp'])   ?  spd : 0;
  const bck = (keys['KeyS'] || keys['ArrowDown']) ? -spd : 0;
  const str = (keys['KeyA'] ? -spd * 0.7 : 0) + (keys['KeyD'] ? spd * 0.7 : 0);
  const move = fwd + bck;

  camera.tryMove(
    camera.dirX * move + (-camera.dirY) * str,
    camera.dirY * move +   camera.dirX  * str,
    map
  );
  player.x = camera.x;
  player.y = camera.y;

  // Shoot
  if ((mouseDown || keys['Space']) && player.canShoot()) {
    const shot = player.shoot();
    game.sound.playShoot(shot.weapon);
    projectiles.push(new Projectile(
      player.x, player.y,
      camera.dirX, camera.dirY,
      shot.damage, true, shot.weapon
    ));
  }

  // Update entities
  player.update(dt);
  game.hud.update(dt);
  enemies.forEach(e => e.update(dt, player, map));
  powerups.forEach(p => {
    p.update(dt);
    if (p.tryPickup(player)) {
      game.hud.showPickup(p.label);
      game.sound.playPickup();
    }
  });
  for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].update(dt, map, enemies, player);
    if (!projectiles[i].alive) projectiles.splice(i, 1);
  }

  // Sound events from flags
  if (player._justHit) { game.sound.playPlayerHit(); player._justHit = false; }
  enemies.forEach(e => {
    if (e._justHit)  { game.sound.playEnemyHit();   e._justHit  = false; }
    if (e._justDied) { game.sound.playEnemyDeath();  e._justDied = false; }
  });

  // Score kills
  enemies.forEach(e => {
    if (!e.alive && !e._scored) { game.score += 100; e._scored = true; }
  });

  // Level clear when all enemies dead
  if (enemies.length > 0 && enemies.every(e => !e.alive)) {
    game.state = 'levelclear';
    game.sound.stopMusic();
    game.menu.show('levelclear');
  }

  // Game over
  if (player.dead) {
    game.state = 'gameover';
    game.sound.stopMusic();
    game.menu.show('gameover');
  }
}

function render() {
  const { camera, player, map, enemies, projectiles, powerups, raycaster, renderer, hud, menu } = game;

  if (game.state === 'main' || !map) {
    renderer.ctx.fillStyle = '#111';
    renderer.ctx.fillRect(0, 0, BASE_W, BASE_H);
    menu.draw(game.score);
    return;
  }

  const hits = raycaster.castAll(camera, map);
  const sprites = [
    ...enemies.filter(e => e.alive),
    ...projectiles.filter(p => p.alive),
    ...powerups.filter(p => p.alive),
  ];

  renderer.drawScene(hits, camera, sprites, raycaster.zBuffer);

  if (player.hitFlash > 0)    renderer.drawFlash('#f44336', player.hitFlash * 2.5);
  if (player.pickupFlash > 0) renderer.drawFlash('#ffeb3b', player.pickupFlash * 1.5);

  hud.draw(player, game.score, game.level, game.sound);
  hud.drawCrosshair();

  if (menu.visible) menu.draw(game.score);
}

requestAnimationFrame(t => { lastTime = t; loop(t); });
